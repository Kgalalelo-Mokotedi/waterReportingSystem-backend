import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { ArrowLeft, FileText, User, MapPin, Calendar, AlertCircle } from "lucide-react";

export default function ReportDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        fetchReportDetails();
    }, [id]);

    const fetchReportDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/reports/${id}`);
            setReport(response.data.data ?? response.data);
        } catch (err) {
            console.error("Failed to fetch report details:", err);
            setErrorMsg("Could not load report details from database.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar user={user} />
            <div className="flex-1 flex flex-col">
                <TopNavbar user={user} />
                <main className="p-8 max-w-4xl mx-auto w-full space-y-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
                    >
                        <ArrowLeft size={18} /> Back to Reports
                    </button>

                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800">Incident Details</h1>
                        <button
                            onClick={() => navigate(`/admin/assignments/${id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition"
                        >
                            Assign Technician
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                            {errorMsg}
                        </div>
                    )}

                    {loading ? (
                        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                            Loading report details...
                        </div>
                    ) : report ? (
                        <div className="space-y-6">
                            {/* Incident Description Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                                <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg border-b pb-3">
                                    <FileText size={22} /> Incident Information
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Title</p>
                                        <p className="text-gray-800 font-medium text-lg">{report.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Reference Number</p>
                                        <p className="text-gray-800 font-medium">{report.referenceNumber || `#RPT-${report.id}`}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Detailed Description</p>
                                        <p className="text-gray-700 mt-1 bg-gray-50 p-4 rounded-lg border">
                                            {report.description || "No detailed description provided for this incident."}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Priority Level</p>
                                        <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full text-white mt-1 ${
                                            report.priority === "HIGH" || report.priority === "CRITICAL" ? "bg-red-600" :
                                                report.priority === "MEDIUM" ? "bg-yellow-500" : "bg-green-600"
                                        }`}>
                                            {report.priority || "NORMAL"}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Current Status</p>
                                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 mt-1">
                                            {report.status || "REPORTED"}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Location</p>
                                        <p className="text-gray-700 flex items-center gap-1 mt-1">
                                            <MapPin size={16} className="text-gray-400" />
                                            {report.suburb}, {report.municipality}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Date Logged</p>
                                        <p className="text-gray-700 flex items-center gap-1 mt-1">
                                            <Calendar size={16} className="text-gray-400" />
                                            {report.createdAt ? new Date(report.createdAt).toLocaleString() : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Reporter Details Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg border-b pb-3">
                                    <User size={22} /> Person Who Logged Report
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Full Name</p>
                                        <p className="text-gray-800 font-medium">
                                            {report.user?.name || report.reporterName || report.username || "Citizen Reporter"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Email Address</p>
                                        <p className="text-gray-800 font-medium">
                                            {report.user?.email || report.reporterEmail || report.email || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Phone Number</p>
                                        <p className="text-gray-800 font-medium">
                                            {report.user?.phone || report.reporterPhone || report.phone || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Assigned Technician</p>
                                        <p className="text-gray-800 font-medium">
                                            {report.technician?.name || report.technicianName || "Unassigned"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                            Report not found.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}