import React, { useEffect, useState } from "react";
import axios from "axios";

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
                // Fetch reports and status updates in parallel, leveraging backend filtering/endpoints if available
                const [reportsRes, updatesRes] = await Promise.all([
                    api.get("/api/reports").catch(() => ({ data: { data: [] } })),
                    api.get("/api/status-updates").catch(() => ({ data: { data: [] } }))
                ]);

                const reportsData = reportsRes.data.data ?? reportsRes.data?.content ?? reportsRes.data;
                const updatesData = updatesRes.data.data ?? updatesRes.data;

                const reportsList = Array.isArray(reportsData) ? reportsData : [];
                const updatesList = Array.isArray(updatesData) ? updatesData : [];

                // Filter issue/report items belonging strictly to the current user
                const userReportIds = new Set(
                    reportsList
                        .filter(r => {
                            const ownerId = r.residentId || r.resident?.id || r.userId || r.user?.id;
                            return userId ? String(ownerId) === String(userId) : false;
                        })
                        .map(r => Number(r.id))
                );

                // Filter database status update logs so they only display entries linked to the user's issues/reports
                const filteredHistory = updatesList.filter(item => {
                    const reportId = item.reportId || item.report?.id || item.report_id;
                    return reportId ? userReportIds.has(Number(reportId)) : false;
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
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Issue Updates & History</h2>
            {loading ? (
                <p className="text-gray-500">Loading database updates...</p>
            ) : history.length === 0 ? (
                <p className="text-gray-500">No status update logs available for your issues.</p>
            ) : (
                <div className="space-y-4">
                    {history.map((item, idx) => (
                        <div key={item.id || idx} className="border-l-4 border-blue-600 pl-4 py-2 bg-gray-50 rounded-r-lg">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">
                                    Status: {item.newStatus || item.new_status || item.status}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {item.createdAt?.substring(0, 16) || item.created_at?.substring(0, 16) || "N/A"}
                                </span>
                            </div>
                            <p className="text-xs text-blue-600 font-medium mt-1">
                                Issue / Report #{item.reportId || item.report?.id || item.report_id || "N/A"}
                            </p>
                            {item.comment && <p className="text-gray-600 text-sm mt-1">{item.comment}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}