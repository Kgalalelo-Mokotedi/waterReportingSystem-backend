import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Wrench, ClipboardList, User, LogOut, Droplets } from "lucide-react";

export default function TechnicianSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
            isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`;

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen sticky top-0">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
                    <Droplets size={22} />
                </div>
                <div>
                    <h1 className="font-bold text-gray-800 text-lg leading-tight">Tech Portal</h1>
                    <p className="text-xs text-gray-500">Water Outage System</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <NavLink to="/technician" end className={navLinkClass}>
                    <Wrench size={18} /> Dashboard
                </NavLink>
                <NavLink to="/technician/reports" className={navLinkClass}>
                    <ClipboardList size={18} /> Assigned Reports
                </NavLink>
                <NavLink to="/technician/profile" className={navLinkClass}>
                    <User size={18} /> Profile
                </NavLink>
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </aside>
    );
}