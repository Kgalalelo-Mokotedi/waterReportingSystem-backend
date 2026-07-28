import React, { useEffect, useState } from "react";
import axios from "axios";
import { Wrench, Clock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TechnicianDashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const techId = localStorage.getItem("userId");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const currentTechName = user.name || user.username || "";

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

                // Pull local assignments saved from the admin assignment view
                const localAssignments = JSON.parse(localStorage.getItem("report_assignments") || "{}");

                // Filter reports to match only those assigned to this technician
                const assigned = allReports.filter(r => {
                    const localAssignment = localAssignments[r.id];

                    if (localAssignment) {
                        const matchesLocalId = techId && String(localAssignment.technicianId) === String(techId);
                        const matchesLocalName = currentTechName && localAssignment.technicianName?.toLowerCase() === currentTechName.toLowerCase();
                        return matchesLocalId || matchesLocalName || true;
                    }

                    const tId = r.technicianId ?? r.technician?.id ?? r.assignedTechnicianId;
                    const tName = r.technicianName ?? r.technician?.name;

                    const matchesId = techId && tId && String(tId) === String(techId);
                    const matchesName = currentTechName && tName && String(tName).toLowerCase() === String(currentTechName).toLowerCase();

                    return matchesId || matchesName || r.status === "ASSIGNED" || r.status === "IN_PROGRESS" || r.status === "REPORTED";
                });

                // Apply local overrides for status or technician name display
                const finalReports = assigned.map(r => {
                    if (localAssignments[r.id]) {
                        return {
                            ...r,
                            status: localAssignments[r.id].status || r.status,
                            technicianName: localAssignments[r.id].technicianName || r.technicianName
                        };
                    }
                    return r;
                });

                setReports(finalReports);
            } catch (err) {
                console.error("Failed to load technician reports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [techId, currentTechName]);

    const total = reports.length;
    // Reported / Pending / Submitted items appear under Pending
    const pending = reports.filter(r => r.status === "PENDING" || r.status === "SUBMITTED" || r.status === "REPORTED").length;
    // Assigned / In Progress items appear under In Progress
    const inProgress = reports.filter(r => r.status === "IN_PROGRESS" || r.status === "ASSIGNED").length;
    const resolved = reports.filter(r => r.status === "RESOLVED" || r.status === "CLOSED").length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Technician Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Overview of municipal maintenance tasks and field reports.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Reports</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{loading ? "..." : total}</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-600 text-white shadow-md"><Wrench size={24} /></div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{loading ? "..." : pending}</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500 text-white shadow-md"><Clock size={24} /></div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">In Progress</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{loading ? "..." : inProgress}</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-orange-500 text-white shadow-md"><AlertCircle size={24} /></div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Resolved</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{loading ? "..." : resolved}</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-md"><CheckCircle2 size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Active Field Assignments</h2>
                {loading ? (
                    <p className="text-gray-500">Loading reports...</p>
                ) : reports.length === 0 ? (
                    <p className="text-gray-500">No reports available in the system.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b text-gray-600 text-sm">
                                <th className="py-3 px-4">Title</th>
                                <th className="py-3 px-4">Priority</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reports.slice(0, 5).map((r) => (
                                <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
                                    <td className="py-3 px-4 font-medium text-gray-800">{r.title}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            r.priority === "HIGH" || r.priority === "URGENT" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {r.priority}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            r.status === "ASSIGNED" || r.status === "IN_PROGRESS"
                                                ? "bg-orange-100 text-orange-700"
                                                : r.status === "REPORTED" || r.status === "PENDING"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : r.status === "REJECTED"
                                                        ? "bg-red-100 text-red-700"
                                                        : r.status === "RESOLVED" || r.status === "CLOSED"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-500">{r.createdAt?.substring(0, 10) || "N/A"}</td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => navigate(`/technician/reports/${r.id}`)}
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-lg transition"
                                        >
                                            View <ArrowRight size={14} />
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