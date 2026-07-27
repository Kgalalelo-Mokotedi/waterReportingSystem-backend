import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function ReportsManagement() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchStatus, setSearchStatus] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        loadReports();
    }, [page, searchStatus]);

    const loadReports = async () => {
        try {
            setLoading(true);
            setErrorMsg("");

            let url = `/api/reports`;
            let params = { page, size: 10 };

            if (searchStatus) {
                url = `/api/reports/search/status`;
                params.status = searchStatus;
            }

            console.log(`Fetching reports from: ${url}`, params);
            const res = await api.get(url, { params });
            console.log("Reports API Response:", res.data);

            // Handle multiple response structures (Page object vs direct array wrapped in ApiResponse)
            const rawData = res.data.data ?? res.data;

            if (Array.isArray(rawData)) {
                setReports(rawData);
                setTotalPages(1);
            } else if (rawData && Array.isArray(rawData.content)) {
                setReports(rawData.content);
                setTotalPages(rawData.totalPages || 0);
            } else {
                setReports([]);
            }

        } catch (err) {
            console.error("Failed to load reports:", err);
            setErrorMsg(err.response?.data?.message || "Failed to load reports from database.");
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar user={user} />
            <div className="flex-1 flex flex-col">
                <TopNavbar user={user} />
                <main className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800">Reports Management</h1>
                        <select
                            className="border p-2 rounded bg-white shadow-sm"
                            value={searchStatus}
                            onChange={(e) => { setSearchStatus(e.target.value); setPage(0); }}
                        >
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="ASSIGNED">Assigned</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                    </div>

                    {errorMsg && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-md">
                            {errorMsg}
                        </div>
                    )}

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-6">Loading reports...</td></tr>
                            ) : reports.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-6 text-gray-500">No reports found in database.</td></tr>
                            ) : (
                                reports.map((rep) => (
                                    <tr key={rep.id}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{rep.title}</td>
                                        <td className="px-6 py-4 text-gray-600">{rep.suburb}, {rep.municipality}</td>
                                        <td className="px-6 py-4 text-gray-600">{rep.priority}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">{rep.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => navigate(`/admin/reports/${rep.id}`)} className="text-blue-600 hover:text-blue-900 font-medium">View</button>
                                            <button onClick={() => navigate(`/admin/reports/${rep.id}`)} className="text-indigo-600 hover:text-indigo-900 font-medium">Assign</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}