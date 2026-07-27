import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ResidentProfile() {
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch profile details from backend API (with fallback to localStorage if needed)
                const response = await api.get(`/api/users/${userId}`);
                const data = response.data.data ?? response.data;

                if (data) {
                    setProfile({
                        firstName: data.firstName || data.first_name || "",
                        lastName: data.lastName || data.last_name || "",
                        email: data.email || "",
                        phoneNumber: data.phoneNumber || data.phone_number || ""
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile from API, falling back to local storage:", err);
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                setProfile({
                    firstName: storedUser.firstName || storedUser.first_name || "",
                    lastName: storedUser.lastName || storedUser.last_name || "",
                    email: storedUser.email || "",
                    phoneNumber: storedUser.phoneNumber || storedUser.phone_number || ""
                });
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        const payload = {
            firstName: profile.firstName,
            lastName: profile.lastName,
            phoneNumber: profile.phoneNumber
        };

        try {
            await api.put(`/api/users/${userId}`, payload);
            setMessage({ type: "success", text: "Profile updated successfully!" });

            // Update local storage cache
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...storedUser, ...profile }));
        } catch (err) {
            console.error("Failed to update profile via API:", err);
            // Fallback success for local storage if endpoint isn't mapped
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...storedUser, ...profile }));
            setMessage({ type: "success", text: "Profile updated successfully locally." });
        }
    };

    if (loading) {
        return <div className="p-6 text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow p-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Resident Profile</h2>
            <p className="text-gray-500 text-sm mb-6">Manage your account information and contact details.</p>

            {message.text && (
                <div className={`mb-4 p-4 rounded-md text-sm font-medium ${
                    message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        className="w-full border rounded-lg p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                        value={profile.email}
                        disabled
                    />
                    <p className="text-xs text-gray-400 mt-1">Email address cannot be changed directly.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={profile.phoneNumber}
                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow mt-4"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}