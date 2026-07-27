import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LayoutDashboard,
    ClipboardList,
    UserCheck,
    Users,
    Tags,
    BarChart3,
    UserCircle,
    LogOut,
    Droplets
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ firstName: "Administrator", lastName: "", role: "Administrator" });

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        // Try fetching the currently authenticated user details from the database
        const fetchUserData = async () => {
            try {
                // If your backend has an endpoint like /api/auth/me or /api/users/me, use it.
                // Otherwise, check local storage fields if they might be stored under a different key format.
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                if (storedUser && (storedUser.firstName || storedUser.name || storedUser.fullName)) {
                    setUser({
                        firstName: storedUser.firstName || storedUser.name || storedUser.fullName?.split(" ")[0] || "Administrator",
                        lastName: storedUser.lastName || (storedUser.fullName ? storedUser.fullName.split(" ").slice(1).join(" ") : ""),
                        role: storedUser.role || "Administrator"
                    });
                } else {
                    const res = await api.get("/api/auth/me"); // Adjust endpoint if your backend uses a different profile route
                    const userData = res.data.data ?? res.data;
                    setUser({
                        firstName: userData.firstName || userData.name || "Administrator",
                        lastName: userData.lastName || "",
                        role: userData.role || "Administrator"
                    });
                }
            } catch (err) {
                console.error("Failed to fetch fresh user details, falling back to local storage:", err);
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                if (storedUser.firstName) {
                    setUser(storedUser);
                }
            }
        };

        fetchUserData();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const menu = [
        {
            title: "Dashboard",
            icon: <LayoutDashboard size={20} />,
            path: "/admin"
        },
        {
            title: "Reports",
            icon: <ClipboardList size={20} />,
            path: "/admin/reports"
        },
        {
            title: "Assignments",
            icon: <UserCheck size={20} />,
            path: "/admin/assignments/1"
        },
        {
            title: "Technicians",
            icon: <Users size={20} />,
            path: "/admin/technicians"
        },
        {
            title: "Categories",
            icon: <Tags size={20} />,
            path: "/admin/categories"
        },
        {
            title: "Statistics",
            icon: <BarChart3 size={20} />,
            path: "/admin/statistics"
        },
        {
            title: "Profile",
            icon: <UserCircle size={20} />,
            path: "/admin/profile"
        }
    ];

    const getInitials = () => {
        const first = user.firstName ? user.firstName[0] : "A";
        const last = user.lastName ? user.lastName[0] : "";
        return `${first}${last}`.toUpperCase();
    };

    return (
        <aside className="w-72 bg-blue-900 text-white flex flex-col min-h-screen shadow-xl">
            {/* Logo */}
            <div className="p-6 border-b border-blue-800">
                <div className="flex items-center gap-3">
                    <div className="bg-white rounded-full p-2">
                        <Droplets
                            size={32}
                            className="text-blue-700"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">
                            Municipality
                        </h1>
                        <p className="text-blue-200 text-sm">
                            Water Outage System
                        </p>
                    </div>
                </div>
            </div>

            {/* User */}
            <div className="p-6 border-b border-blue-800">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-xl shadow">
                        {getInitials()}
                    </div>
                    <div>
                        <h2 className="font-semibold">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-blue-200 text-sm capitalize">
                            {user.role?.toLowerCase() || "Administrator"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 mt-4">
                {menu.map((item) => (
                    <NavLink
                        key={item.title}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-4 transition-all duration-200
                            ${
                                isActive
                                    ? "bg-blue-700 border-r-4 border-cyan-400"
                                    : "hover:bg-blue-800"
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="border-t border-blue-800 p-5">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full bg-red-600 hover:bg-red-700 rounded-lg py-3 justify-center transition"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}