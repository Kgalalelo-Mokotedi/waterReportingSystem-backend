import React, { useState } from "react";

export default function ResidentProfile() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [profile, setProfile] = useState({
        firstName: storedUser.firstName || storedUser.first_name || "",
        lastName: storedUser.lastName || storedUser.last_name || "",
        email: storedUser.email || "",
        phoneNumber: storedUser.phoneNumber || storedUser.phone_number || ""
    });
    const [message, setMessage] = useState("");

    const handleSave = (e) => {
        e.preventDefault();
        setMessage("Profile updated successfully locally.");
        localStorage.setItem("user", JSON.stringify({ ...storedUser, ...profile }));
    };

    return (
        <div className="bg-white rounded-xl shadow p-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Resident Profile</h2>
            <p className="text-gray-500 text-sm mb-6">Manage your account information.</p>

            {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{message}</div>}

            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
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