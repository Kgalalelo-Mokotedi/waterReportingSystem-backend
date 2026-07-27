import React from "react";
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

export default function Sidebar({ user }) {

    const navigate = useNavigate();

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
            path: "/admin/assignments"
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

                    <img
                        src="https://ui-avatars.com/api/?name=Admin&background=ffffff&color=2563eb"
                        alt="Admin"
                        className="w-14 h-14 rounded-full"
                    />

                    <div>

                        <h2 className="font-semibold">

                            {user
                                ? `${user.firstName} ${user.lastName}`
                                : "Administrator"}

                        </h2>

                        <p className="text-blue-200 text-sm">

                            Administrator

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