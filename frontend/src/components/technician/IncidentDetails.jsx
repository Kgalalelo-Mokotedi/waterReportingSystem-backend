import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, MapPin, AlertCircle, CheckCircle, Calendar, FileText } from "lucide-react";

export default function IncidentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const response = await api.get(`/api/reports/${id}`);
                const data = response.data.data ?? response.data;
                setReport(data);
            } catch (err) {
                console.error("Failed to fetch incident details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReportDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading incident details...</div>;
    }

    if (!report) {
        return (
            <div className="bg-white rounded-xl shadow p-8 text-center space-y-4">
                <p className="text-red-600 font-semibold">Incident report not found.</p>
                <button
                    onClick={() => navigate("/technician/reports")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                    Back to Assigned Reports
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate("/technician/reports")}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-950 font-medium bg-white px-4 py-2 rounded-lg border shadow-sm transition"
                >
                    <ArrowLeft size={16} /> Back to Assigned Reports
                </button>
                <button
                    onClick={() => navigate(`/technician/reports/${id}/update`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow transition"
                >
                    Update Status & Notes
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                    <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.priority === "HIGH" || report.priority === "URGENT" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                        }`}>
                            {report.priority} Priority
                        </span>
                        <h1 className="text-2xl font-bold text-gray-800 mt-2">{report.title}</h1>
                    </div>
                    <div>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                            report.status === "IN_PROGRESS" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                        }`}>
                            Status: {report.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-700">Location Address</p>
                                <p className="text-gray-600">{report.streetName}, {report.suburb}</p>
                                <p className="text-gray-500 text-xs">Ward {report.wardNumber} • {report.municipality}, {report.province}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar size={20} className="text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-700">Date Logged</p>
                                <p className="text-gray-600">{report.createdAt ? new Date(report.createdAt).toLocaleString() : "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <FileText size={20} className="text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-700">Category</p>
                                <p className="text-gray-600">{report.category?.name || `Category ID: ${report.categoryId}`}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg text-sm leading-relaxed border">{report.description}</p>
                </div>

                {report.photoUrl && (
                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Incident Photo Evidence</h3>
                        <img
                            src={report.photoUrl}
                            alt="Incident Evidence"
                            className="rounded-lg max-h-80 object-cover border shadow-sm"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}