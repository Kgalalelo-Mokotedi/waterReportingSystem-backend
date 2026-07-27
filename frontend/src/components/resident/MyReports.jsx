import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // Fetch reports and filter client-side (or query by resident endpoint if available)
                const response = await api.get("/api/reports");
                const data = response.data.data ?? response.data?.content ?? response.data;
                const list = Array.isArray(data) ? data : [];

                // Filter to only include reports belonging to the current logged-in user (resident/creator)
                const filtered = list.filter(r => {
                    const ownerId = r.residentId || r.resident?.id || r.userId || r.user?.id;
                    return userId ? String(ownerId) === String(userId) : true;
                });

                setReports(filtered);
            } catch (err) {
                console.error("Failed to fetch reports:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [userId]);

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Submitted Reports</h2>
            {loading ? (
                <p className="text-gray-500">Loading reports...</p>
            ) : reports.length === 0 ? (
                <p className="text-gray-500">No reports found for your account.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b text-gray-600 text-sm">
                            <th className="py-3 px-4">Reference</th>
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-4">Priority</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reports.map((r) => (
                            <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
                                <td className="py-3 px-4 font-semibold text-blue-600">{r.referenceNumber || `#${r.id}`}</td>
                                <td className="py-3 px-4 font-medium text-gray-800">{r.title}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        r.priority === "HIGH" || r.priority === "URGENT" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                    }`}>{r.priority}</span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        r.status === "ASSIGNED" || r.status === "IN_PROGRESS"
                                            ? "bg-orange-100 text-orange-700"
                                            : r.status === "REJECTED"
                                                ? "bg-red-100 text-red-700"
                                                : r.status === "RESOLVED" || r.status === "CLOSED"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-blue-50 text-blue-700"
                                    }`}>{r.status}</span>
                                </td>
                                <td className="py-3 px-4 text-gray-500">{r.createdAt?.substring(0, 10) || "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}