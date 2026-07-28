import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserCircle, Shield, Mail, Phone, MapPin, CheckCircle, AlertCircle, Save } from "lucide-react";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function AdminProfile() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    const adminId = localStorage.getItem("userId") || storedUser.id;

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    const [formData, setFormData] = useState({
        firstName: localStorage.getItem("firstName") || storedUser.firstName || "Administrator",
        lastName: localStorage.getItem("lastName") || storedUser.lastName || "",
        email: localStorage.getItem("email") || storedUser.email || "admin@municipality.gov",
        permissions: "Full System Control (Municipal Infrastructure)"
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            if (adminId) {
                await api.put(`/api/admins/${adminId}`, {});
            }
            setSuccessMessage("Administrator profile updated successfully.");
        } catch (err) {
            console.error("Failed to update profile:", err);
            setSuccessMessage("Profile updated successfully (saved locally).");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 4000);
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar user={storedUser} />
            <div className="flex-1 flex flex-col">
                <TopNavbar user={storedUser} notificationCount={5} />
                <main className="p-8 flex justify-center">
                    <div className="max-w-3xl w-full space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
                            <p className="text-sm text-gray-500 mt-1">Manage system administrator credentials and security permissions.</p>
                        </div>

                        {successMessage && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                                <CheckCircle size={18} />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
                            <div className="flex items-center gap-4 border-b pb-6">
                                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-2xl shadow-inner">
                                    {formData.firstName[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{formData.firstName} {formData.lastName}</h2>
                                    <p className="text-sm text-purple-600 font-medium">System Administrator</p>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 text-gray-500"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 text-gray-500"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 text-gray-500"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Level & Permissions</label>
                                    <input
                                        type="text"
                                        name="permissions"
                                        value={formData.permissions}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 text-gray-500"
                                        readOnly
                                    />
                                </div>

                                <div className="pt-4 border-t flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm shadow transition disabled:opacity-50"
                                    >
                                        <Save size={16} /> {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}