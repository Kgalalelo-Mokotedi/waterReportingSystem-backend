import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, X, Calendar, MapPin, Tag, AlertTriangle, Clock } from "lucide-react";

export default function MyReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get("/api/reports");
                const data = response.data.data ?? response.data?.content ?? response.data;
                const list = Array.isArray(data) ? data : [];

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
        <div className="bg-white rounded-xl shadow p-6 relative">
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
                            <th className="py-3 px-4 text-right">Actions</th>
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
                                <td className="py-3 px-4 text-right">
                                    <button
                                        onClick={() => setSelectedReport(r)}
                                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium transition"
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

            {/* Detailed View Modal with Backdrop Blur */}
            {selectedReport && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                    {selectedReport.referenceNumber || `#RPT-${selectedReport.id}`}
                                </span>
                                <h3 className="text-xl font-bold text-gray-800">{selectedReport.title}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                            {/* Status and Priority badges */}
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700">
                                    <Clock size={14} /> Status: <span className="text-blue-600 uppercase">{selectedReport.status || "REPORTED"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700">
                                    <AlertTriangle size={14} /> Priority: <span className="text-red-600 uppercase">{selectedReport.priority || "LOW"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700">
                                    <Calendar size={14} /> Logged on: {selectedReport.createdAt ? selectedReport.createdAt.replace("T", " ").substring(0, 16) : "N/A"}
                                </div>
                            </div>

                            {/* Description Box */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Description & Details</h4>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                                    {selectedReport.description || "No description provided."}
                                </div>
                            </div>

                            {/* Location Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <MapPin size={14} /> Location Information
                                    </h4>
                                    <p className="text-sm text-gray-800"><span className="font-medium">Street:</span> {selectedReport.streetName || "N/A"}</p>
                                    <p className="text-sm text-gray-800"><span className="font-medium">Suburb:</span> {selectedReport.suburb || "N/A"}</p>
                                    <p className="text-sm text-gray-800"><span className="font-medium">Municipality:</span> {selectedReport.municipality || "N/A"}</p>
                                    <p className="text-sm text-gray-800"><span className="font-medium">Ward:</span> {selectedReport.wardNumber || "N/A"}</p>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <Tag size={14} /> Additional Assignment
                                    </h4>
                                    <p className="text-sm text-gray-800"><span className="font-medium">Category ID:</span> {selectedReport.categoryId || selectedReport.category?.name || "N/A"}</p>
                                    <p className="text-sm text-gray-800"><span className="font-medium">Technician:</span> {selectedReport.technicianName || selectedReport.technician?.name || "Unassigned"}</p>
                                </div>
                            </div>

                            {/* Photo Preview if exists */}
                            {selectedReport.photoUrl && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Attached Photo</h4>
                                    <img
                                        src={selectedReport.photoUrl}
                                        alt="Incident Attachment"
                                        className="rounded-xl border border-gray-200 max-h-60 object-cover w-full shadow-sm"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}