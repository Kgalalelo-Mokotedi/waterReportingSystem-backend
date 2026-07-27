import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Bell } from "lucide-react";

export default function TechnicianNavbar() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const firstName = localStorage.getItem("firstName") || storedUser.firstName || "Technician";
    const lastName = localStorage.getItem("lastName") || storedUser.lastName || "";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">
                    Welcome back, <span className="text-blue-600">{firstName} {lastName}</span>
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/technician/profile")}
                    className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition text-sm text-gray-700 font-medium border border-gray-100"
                >
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {firstName[0]}
                    </div>
                    <span>{firstName}</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                    title="Sign Out"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </header>
    );
}