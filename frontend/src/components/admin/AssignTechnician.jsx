import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const AssignTechnician = () => {
    const { id } = useParams(); // reportId
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    useEffect(() => {
        loadReport();
        loadTechnicians();
    }, [id]);

    // ===========================
    // LOAD REPORT
    // ===========================
    const loadReport = async () => {
        try {
            const response = await api.get(`/api/reports/${id}`);
            setReport(response.data.data ?? response.data);
        } catch (error) {
            console.error(error);
            setMessage("Unable to load report");
        }
    };

    // ===========================
    // LOAD AVAILABLE TECHNICIANS
    // ===========================
    const loadTechnicians = async () => {
        try {
            const response = await api.get("/api/technicians/available");
            setTechnicians(response.data.data ?? response.data);
        } catch (error) {
            console.error(error);
            setMessage("Unable to load technicians");
        } finally {
            setLoading(false);
        }
    };

    // ===========================
    // ASSIGN TECHNICIAN (Uses Backend /api/assignments)
    // ===========================
    const handleAssign = async (e) => {
        e.preventDefault();

        if (!selectedTechnician) {
            alert("Please select a technician");
            return;
        }

        try {
            const request = {
                reportId: Number(id),
                technicianId: Number(selectedTechnician),
                notes: notes || "Assigned via Admin Portal"
            };

            await api.post("/api/assignments", request);

            setMessage("Technician assigned successfully!");
            setTimeout(() => {
                navigate("/admin/reports");
            }, 1500);
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "Assignment failed");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <TopNavbar />
                <div className="p-8 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-6">Assign Technician</h1>

                    {message && (
                        <div className={`p-4 mb-4 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="bg-white shadow rounded-lg p-6 space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Incident Details</h2>
                                <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                                    <p><strong>Title:</strong> {report?.title}</p>
                                    <p><strong>Location:</strong> {report?.suburb}, {report?.municipality}</p>
                                    <p><strong>Priority:</strong> {report?.priority}</p>
                                    <p><strong>Current Status:</strong> {report?.status}</p>
                                </div>
                            </div>

                            <form onSubmit={handleAssign} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Available Technician
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={selectedTechnician}
                                        onChange={(e) => setSelectedTechnician(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Technician --</option>
                                        {technicians.map((tech) => (
                                            <option key={tech.id} value={tech.id}>
                                                {tech.name || tech.fullName || `Technician #${tech.id}`} ({tech.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assignment Notes (Optional)
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add instructions for the technician..."
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/admin/reports")}
                                        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-150"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Confirm Assignment
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignTechnician;