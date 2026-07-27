import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function CreateReport() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "PENDING",
        userId: ""
    });

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        loadAllUsersFromDatabase();
    }, []);

    const loadAllUsersFromDatabase = async () => {
        try {
            setLoadingUsers(true);
            setError("");

            let response;
            try {
                response = await api.get("/api/users");
            } catch (err) {
                try {
                    response = await api.get("/api/admin/users");
                } catch (err2) {
                    response = await api.get("/api/technicians");
                }
            }

            const userData = response.data.data ?? response.data?.content ?? response.data;
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (err) {
            console.error("Failed to load users from database:", err);
            setError("Could not load users list. Please verify your backend API endpoint or ensure you have administrator privileges.");
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                status: formData.status,
                userId: formData.userId ? Number(formData.userId) : null
            };

            await api.post("/api/reports", payload);
            setMessage("Report created and assigned to user successfully!");

            setTimeout(() => {
                navigate("/admin/reports");
            }, 1500);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create report.");
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar user={user} />
            <div className="flex-1 flex flex-col">
                <TopNavbar user={user} notificationCount={5} />

                <main className="p-8 space-y-6 max-w-4xl mx-auto w-full">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h1 className="text-3xl font-bold text-gray-800">Create New Report</h1>
                        <p className="text-gray-500 mt-1">Log an incident report and assign it directly to any user registered in the database.</p>
                    </div>

                    {message && (
                        <div className="p-4 bg-green-100 text-green-700 rounded-md shadow-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-md shadow-sm flex flex-col gap-2">
                            <span>{error}</span>
                            <button
                                onClick={loadAllUsersFromDatabase}
                                className="self-start text-xs bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded font-medium transition"
                            >
                                Retry Loading Users
                            </button>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Main Street Pipe Leakage"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Provide detailed description..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        name="priority"
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                    >
                                        <option value="LOW">LOW</option>
                                        <option value="MEDIUM">MEDIUM</option>
                                        <option value="HIGH">HIGH</option>
                                        <option value="URGENT">URGENT</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                                    <select
                                        name="status"
                                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                        <option value="RESOLVED">RESOLVED</option>
                                        <option value="CLOSED">CLOSED</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign User (Database Records)</label>
                                <select
                                    name="userId"
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                    value={formData.userId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">-- Select User from Database --</option>
                                    {loadingUsers ? (
                                        <option disabled>Loading database users...</option>
                                    ) : users.length === 0 ? (
                                        <option disabled>No users found in database</option>
                                    ) : (
                                        users.map((dbUser) => (
                                            <option key={dbUser.id} value={dbUser.id}>
                                                ID: {dbUser.id} - {dbUser.first_name || dbUser.firstName || "User"} {dbUser.last_name || dbUser.lastName || ""} ({dbUser.email || "No Email"})
                                            </option>
                                        ))
                                    )}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">This list displays the User ID and person's name fetched directly from the database.</p>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
                                >
                                    Create and Assign Report
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}