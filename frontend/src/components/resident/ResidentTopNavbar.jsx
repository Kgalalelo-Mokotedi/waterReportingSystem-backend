import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Bell, CalendarDays } from "lucide-react";

export default function ResidentTopNavbar() {
    const navigate = useNavigate();
    const [today, setToday] = useState("");

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
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const name = `${storedUser.firstName || storedUser.first_name || "Resident"} ${storedUser.lastName || storedUser.last_name || ""}`.trim();

    return (
        <header className="bg-white shadow-sm border-b px-8 py-5 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {name}</h1>
                <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                    <CalendarDays size={16} />
                    <span>{today}</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative">
                    <Bell size={22} className="text-gray-600" />
                </button>

                <div className="flex items-center gap-3">
                    <UserCircle size={36} className="text-blue-700" />
                    <div className="hidden md:block">
                        <h3 className="font-semibold text-sm">{name}</h3>
                        <p className="text-gray-500 text-xs">Resident</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-sm transition"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </header>
    );
}