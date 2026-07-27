import React, { useState, useEffect } from "react";
import {
    Bell,
    CalendarDays,
    LogOut,
    UserCircle,
    Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopNavbar({
                                      user,
                                      notificationCount = 0,
                                      onMenuClick
                                  }) {

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

                        Welcome,

                        {" "}

                        {user
                            ? `${user.firstName} ${user.lastName}`
                            : "Administrator"}

                    </h1>

                    <div className="flex items-center gap-2 mt-2 text-gray-500">

                        <CalendarDays size={18} />

                        <span>

                            {today}

                        </span>

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

                            {user
                                ? `${user.firstName} ${user.lastName}`
                                : "Administrator"}

                        </h3>

                        <p className="text-gray-500 text-sm">

                            Administrator

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