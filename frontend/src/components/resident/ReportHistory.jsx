import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, MessageSquare, AlertCircle, CheckCircle2, FileText, ArrowRight } from "lucide-react";

export default function ReportHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch reports and status updates in parallel
                const [reportsRes, updatesRes] = await Promise.all([
                    api.get("/api/reports").catch(() => ({ data: { data: [] } })),
                    api.get("/api/status-updates").catch(() => ({ data: { data: [] } }))
                ]);

                const reportsData = reportsRes.data.data ?? reportsRes.data?.content ?? reportsRes.data;
                const updatesData = updatesRes.data.data ?? updatesRes.data;

                const reportsList = Array.isArray(reportsData) ? reportsData : [];
                const updatesList = Array.isArray(updatesData) ? updatesData : [];

                // Create a lookup map for reports belonging to the user so we can attach report titles and references
                const userReportsMap = new Map();
                reportsList.forEach(r => {
                    const ownerId = r.residentId || r.resident?.id || r.userId || r.user?.id;
                    if (userId && String(ownerId) === String(userId)) {
                        userReportsMap.set(Number(r.id), {
                            title: r.title,
                            referenceNumber: r.referenceNumber || `#RPT-${r.id}`
                        });
                    }
                });

                // Filter database status update logs so they only display entries linked to the user's reports
                const filteredHistory = updatesList
                    .filter(item => {
                        const reportId = item.reportId || item.report?.id || item.report_id;
                        return reportId ? userReportsMap.has(Number(reportId)) : false;
                    })
                    .map(item => {
                        const reportId = Number(item.reportId || item.report?.id || item.report_id);
                        return {
                            ...item,
                            reportDetails: userReportsMap.get(reportId) || { title: `Report #${reportId}`, referenceNumber: `#RPT-${reportId}` }
                        };
                    });

                // Sort latest updates first based on timestamp
                filteredHistory.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.created_at || 0);
                    const dateB = new Date(b.createdAt || b.created_at || 0);
                    return dateB - dateA;
                });

                setHistory(filteredHistory);
            } catch (err) {
                console.error("Failed to load issue status history from database:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId]);

    return (
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Incident Updates & History</h2>
                    <p className="text-sm text-gray-500 mt-1">Track all chronological changes, status shifts, and comments made on your reports.</p>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Clock size={14} /> Total Updates: {history.length}
                </span>
            </div>

            {loading ? (
                <div className="py-12 text-center text-gray-500 font-medium">Loading activity history...</div>
            ) : history.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-600 font-medium">No status updates or modification history found for your incidents yet.</p>
                </div>
            ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">
                    {history.map((item, idx) => {
                        const status = item.newStatus || item.new_status || item.status || "UPDATED";
                        const prevStatus = item.previousStatus || item.previous_status;
                        const timestamp = item.createdAt || item.created_at;
                        const comment = item.comment || item.notes;

                        return (
                            <div key={item.id || idx} className="relative group">
                                {/* Timeline Dot */}
                                <div className="absolute -left-6 mt-1.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm flex items-center justify-center"></div>

                                <div className="bg-gray-50 hover:bg-blue-50/30 transition border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                                    {/* Top Row: Report reference and Timestamp */}
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md">
                                                {item.reportDetails.referenceNumber}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-800">
                                                {item.reportDetails.title}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                                            <Clock size={12} /> {timestamp ? timestamp.replace("T", " ").substring(0, 16) : "N/A"}
                                        </span>
                                    </div>

                                    {/* Change Details */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-600 font-medium">Status Change:</span>
                                        {prevStatus && (
                                            <>
                                                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-700">
                                                    {prevStatus}
                                                </span>
                                                <ArrowRight size={14} className="text-gray-400" />
                                            </>
                                        )}
                                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                                            status === "RESOLVED" || status === "CLOSED" ? "bg-emerald-100 text-emerald-700" :
                                                status === "ASSIGNED" || status === "IN_PROGRESS" ? "bg-orange-100 text-orange-700" :
                                                    status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {status}
                                        </span>
                                    </div>

                                    {/* Comment / Note if provided */}
                                    {comment && (
                                        <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 flex items-start gap-2.5 shadow-xs">
                                            <MessageSquare size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                            <p className="whitespace-pre-wrap leading-relaxed">{comment}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}