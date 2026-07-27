import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Wrench, Search, Eye } from "lucide-react";

export default function AssignedReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const techId = localStorage.getItem("userId");

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get("/api/reports");
                const data = response.data.data ?? response.data?.content ?? response.data;
                const allReports = Array.isArray(data) ? data : [];

                const assigned = allReports.filter(r => {
                    const tId = r.technicianId ?? r.technician?.id ?? r.assignedTechnicianId;
                    return String(tId) === String(techId);
                });

                setReports(assigned);
            } catch (err) {
                console.error("Failed to load assigned reports:", err);
            } finally {
                setLoading(false);
            }
        };

        if (techId) {
            fetchReports();
        } else {
            setLoading(false);
        }
    }, [techId]);

    const filteredReports = reports.filter(r => {
        const matchesSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.streetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.suburb?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Assigned Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and update all field maintenance tickets assigned to you.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search title, street..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                {loading ? (
                    <p className="text-gray-500 text-center py-8">Loading assigned reports...</p>
                ) : filteredReports.length === 0 ? (
                    <div className="text-center py-12">
                        <Wrench size={48} className="mx-auto text-gray-300 mb-3" />
                        <h3 className="font-semibold text-gray-700 text-lg">No assigned reports found</h3>
                        <p className="text-gray-500 text-sm mt-1">You don't have any tickets matching your filter parameters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b text-gray-600 text-sm">
                                <th className="py-3 px-4">Title</th>
                                <th className="py-3 px-4">Location</th>
                                <th className="py-3 px-4">Priority</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredReports.map((r) => (
                                <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
                                    <td className="py-3 px-4 font-medium text-gray-800">{r.title}</td>
                                    <td className="py-3 px-4 text-gray-600">{r.streetName}, {r.suburb}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            r.priority === "HIGH" || r.priority === "URGENT" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {r.priority}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            r.status === "IN_PROGRESS" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => navigate(`/technician/reports/${r.id}`)}
                                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm"
                                        >
                                            <Eye size={14} /> View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}