import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Clock,
    UserPlus,
    CheckCircle,
    AlertTriangle,
    Wrench,
    FileText
} from "lucide-react";

export default function RecentUpdates({ reports = [], loading: parentLoading, onUpdateCountChange }) {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchUpdatesFromDB = async () => {
            try {
                // Fetch status update logs or history endpoints from the database
                const response = await api.get("/api/status-updates").catch(() => api.get("/api/reports/history"));
                const data = response.data.data ?? response.data?.content ?? response.data;

                if (Array.isArray(data) && data.length > 0) {
                    setUpdates(data);
                    if (onUpdateCountChange) onUpdateCountChange(data.length);
                } else {
                    generateFallbackUpdates();
                }
            } catch (err) {
                console.error("Failed to load status updates from DB, using fallback tracking:", err);
                generateFallbackUpdates();
            } finally {
                setLoading(false);
            }
        };

        const generateFallbackUpdates = () => {
            const localAssignments = JSON.parse(localStorage.getItem("report_assignments") || "{}");

            const derived = (reports || []).map(report => {
                const override = localAssignments[report.id];
                const currentStatus = override?.status || report.status || "REPORTED";

                return {
                    id: report.id,
                    type: currentStatus,
                    title: `Report #${report.referenceNumber || report.id} - ${report.title || "Incident"}`,
                    description: `Status updated to ${currentStatus}. Location: ${report.suburb || report.municipality || "N/A"}.`,
                    time: report.updatedAt || report.createdAt || new Date().toISOString()
                };
            });

            // Sort by most recent date
            derived.sort((a, b) => new Date(b.time) - new Date(a.time));
            setUpdates(derived);

            // Push count update to parent/navigation badge if provided
            if (onUpdateCountChange) {
                onUpdateCountChange(derived.length);
            }
        };

        if (reports.length > 0) {
            fetchUpdatesFromDB();
        } else {
            setLoading(false);
        }
    }, [reports, onUpdateCountChange]);

    const getIcon = (type) => {
        switch (type) {
            case "ASSIGNED":
            case "ASSIGN":
                return <UserPlus className="text-blue-600" size={20} />;
            case "RESOLVED":
            case "CLOSED":
                return <CheckCircle className="text-green-600" size={20} />;
            case "IN_PROGRESS":
                return <Wrench className="text-orange-500" size={20} />;
            case "REPORTED":
            case "PENDING":
                return <FileText className="text-purple-600" size={20} />;
            default:
                return <AlertTriangle className="text-red-600" size={20} />;
        }
    };

    if (parentLoading || loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-700">Recent Activity</h2>
                <p className="text-gray-500">Loading updates...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-700">Recent Activity</h2>
                {updates.length > 0 && (
                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {updates.length} New
                    </span>
                )}
            </div>

            {updates.length === 0 ? (
                <p className="text-gray-500">No recent activity found.</p>
            ) : (
                <div className="space-y-5">
                    {updates.slice(0, 5).map((update, index) => {
                        const rawDate = update.createdAt || update.timestamp || update.time;
                        const formattedTime = rawDate ? new Date(rawDate).toLocaleString() : "Recently";
                        const updateType = update.type || update.status || update.newStatus;

                        return (
                            <div
                                key={update.id || index}
                                className="flex items-start gap-4 border-b pb-4 last:border-none last:pb-0"
                            >
                                <div className="mt-1">
                                    {getIcon(updateType)}
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800">
                                        {update.title || update.action || `Report Status Update`}
                                    </h4>

                                    <p className="text-gray-600 text-sm mt-1">
                                        {update.description || update.comment || `Status recorded as ${updateType}.`}
                                    </p>

                                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                                        <Clock size={14} />
                                        {formattedTime}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}