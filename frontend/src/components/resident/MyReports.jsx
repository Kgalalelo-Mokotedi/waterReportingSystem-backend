import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get("/api/reports");
                const data = response.data.data ?? response.data?.content ?? response.data;
                setReports(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch reports:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Submitted Reports</h2>
            {loading ? (
                <p className="text-gray-500">Loading reports...</p>
            ) : reports.length === 0 ? (
                <p className="text-gray-500">No reports found.</p>
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
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{r.priority}</span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">{r.status}</span>
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