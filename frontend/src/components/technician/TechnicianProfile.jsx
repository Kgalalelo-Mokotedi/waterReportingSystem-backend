import React, { useState } from "react";
import { UserCircle, Shield, Mail, Phone, MapPin, CheckCircle } from "lucide-react";

export default function TechnicianProfile() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const firstName = localStorage.getItem("firstName") || storedUser.firstName || "Technician";
    const lastName = localStorage.getItem("lastName") || storedUser.lastName || "";
    const email = localStorage.getItem("email") || storedUser.email || "technician@municipality.gov";

    const [successMessage, setSuccessMessage] = useState("");

    const handleSave = (e) => {
        e.preventDefault();
        setSuccessMessage("Profile preferences updated successfully.");
        setTimeout(() => setSuccessMessage(""), 4000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Technician Profile</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your field worker account information and security settings.</p>
            </div>

            {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                    <CheckCircle size={18} />
                    <span>{successMessage}</span>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
                <div className="flex items-center gap-4 border-b pb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl shadow-inner">
                        {firstName[0]}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{firstName} {lastName}</h2>
                        <p className="text-sm text-blue-600 font-medium">Municipal Field Technician</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                defaultValue={firstName}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                defaultValue={lastName}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50"
                                readOnly
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            defaultValue={email}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Department</label>
                        <input
                            type="text"
                            defaultValue="Water Infrastructure & Pipeline Maintenance"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50"
                            readOnly
                        />
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-750 text-white px-6 py-2.5 rounded-lg font-medium text-sm shadow transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}