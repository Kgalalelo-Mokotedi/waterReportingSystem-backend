import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReportHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get("/api/status-updates");
                const data = response.data.data ?? response.data;
                setHistory(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load status history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Report History & Updates</h2>
            {loading ? (
                <p className="text-gray-500">Loading history...</p>
            ) : history.length === 0 ? (
                <p className="text-gray-500">No status update logs available.</p>
            ) : (
                <div className="space-y-4">
                    {history.map((item, idx) => (
                        <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2 bg-gray-50 rounded-r-lg">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">Status: {item.status}</span>
                                <span className="text-xs text-gray-400">{item.createdAt || item.updatedDate || "N/A"}</span>
                            </div>
                            {item.comment && <p className="text-gray-600 text-sm mt-1">{item.comment}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}