import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Bell,
    CalendarDays,
    LogOut,
    UserCircle,
    Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopNavbar({
                                      notificationCount = 0,
                                      onMenuClick
                                  }) {
    const navigate = useNavigate();
    const [today, setToday] = useState("");
    const [user, setUser] = useState({ firstName: "Administrator", lastName: "", role: "Administrator" });

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const date = new Date();
        setToday(
            date.toLocaleDateString("en-ZA", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            })
        );

        const fetchUserData = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                if (storedUser && (storedUser.firstName || storedUser.name || storedUser.fullName)) {
                    setUser({
                        firstName: storedUser.firstName || storedUser.name || storedUser.fullName?.split(" ")[0] || "Administrator",
                        lastName: storedUser.lastName || (storedUser.fullName ? storedUser.fullName.split(" ").slice(1).join(" ") : ""),
                        role: storedUser.role || "Administrator"
                    });
                } else {
                    const res = await api.get("/api/auth/me");
                    const userData = res.data.data ?? res.data;
                    setUser({
                        firstName: userData.firstName || userData.name || "Administrator",
                        lastName: userData.lastName || "",
                        role: userData.role || "Administrator"
                    });
                }
            } catch (err) {
                console.error("Failed to fetch fresh user details for navbar:", err);
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

    return (
        <header className="bg-white shadow-sm border-b px-8 py-5 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
                <button
                    className="lg:hidden"
                    onClick={onMenuClick}
                >
                    <Menu size={26} />
                </button>

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome,{" "}
                        {user.firstName} {user.lastName}
                    </h1>

                    <div className="flex items-center gap-2 mt-2 text-gray-500">
                        <CalendarDays size={18} />
                        <span>{today}</span>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative">
                    <Bell
                        size={24}
                        className="text-gray-600"
                    />
                    {notificationCount > 0 && (
                        <span
                            className="
                            absolute
                            -top-2
                            -right-2
                            bg-red-600
                            text-white
                            rounded-full
                            text-xs
                            px-2
                            py-0.5"
                        >
                            {notificationCount}
                        </span>
                    )}
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3">
                    <UserCircle
                        size={38}
                        className="text-blue-700"
                    />
                    <div className="hidden md:block">
                        <h3 className="font-semibold">
                            {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-gray-500 text-sm capitalize">
                            {user.role?.toLowerCase() || "Administrator"}
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="
                    flex
                    items-center
                    gap-2
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    transition"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </header>
    );
}