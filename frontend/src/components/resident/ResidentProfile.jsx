import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserCircle, Shield, Mail, Phone, MapPin, CheckCircle, AlertCircle, Save } from "lucide-react";

export default function ResidentProfile() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    const residentId = localStorage.getItem("userId") || storedUser.id;

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    const [formData, setFormData] = useState({
        firstName: localStorage.getItem("firstName") || storedUser.firstName || "Resident",
        lastName: localStorage.getItem("lastName") || storedUser.lastName || "",
        email: localStorage.getItem("email") || storedUser.email || "resident@municipality.gov",
        phone: localStorage.getItem("phone") || storedUser.phone || "",
        address: localStorage.getItem("address") || storedUser.address || ""
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
            // Update profile via backend API if available, or update local storage session
            if (residentId) {
                await api.put(`/api/residents/${residentId}`, {
                    phone: formData.phone,
                    address: formData.address
                });
            }

            // Update local storage session values
            localStorage.setItem("phone", formData.phone);
            localStorage.setItem("address", formData.address);

            const updatedUser = { ...storedUser, phone: formData.phone, address: formData.address };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setSuccessMessage("Resident profile preferences updated successfully.");
        } catch (err) {
            console.error("Failed to update profile:", err);
            // Fallback: If backend PUT endpoint isn't wired yet, save locally anyway
            localStorage.setItem("phone", formData.phone);
            localStorage.setItem("address", formData.address);
            setSuccessMessage("Profile updated successfully (saved locally).");
        } finally {
            setLoading(false);
            setTimeout(() => setSuccessMessage(""), 4000);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Resident Profile</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account information, contact details, and registered address.</p>
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
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl shadow-inner">
                        {formData.firstName[0]}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{formData.firstName} {formData.lastName}</h2>
                        <p className="text-sm text-emerald-600 font-medium">Verified Community Resident</p>
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
                                title="First name cannot be changed directly"
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
                                title="Last name cannot be changed directly"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 text-gray-500"
                                readOnly
                                title="Email address cannot be changed directly"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <div className="relative flex items-center">
                                <Phone size={16} className="absolute left-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g., +27 82 123 4567"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address *</label>
                        <div className="relative flex items-center">
                            <MapPin size={16} className="absolute left-3 text-gray-400" />
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="e.g., 64 Maple Drive, Johannesburg"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm shadow transition disabled:opacity-50"
                        >
                            <Save size={16} /> {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}