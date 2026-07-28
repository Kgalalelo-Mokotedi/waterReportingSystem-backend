import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardList,
    PlusCircle,
    History,
    UserCircle,
    LogOut,
    Droplets
} from "lucide-react";

export default function ResidentSidebar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const menu = [
        { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/resident" },
        { title: "Create Report", icon: <PlusCircle size={20} />, path: "/resident/create" },
        { title: "My Reports", icon: <ClipboardList size={20} />, path: "/resident/reports" },
        { title: "Profile", icon: <UserCircle size={20} />, path: "/resident/profile" }
    ];

    // Read first and last name from separate items stored in localStorage, with fallbacks to legacy "user" object
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const firstName = localStorage.getItem("firstName") || storedUser.firstName || storedUser.first_name || "Resident";
    const lastName = localStorage.getItem("lastName") || storedUser.lastName || storedUser.last_name || "";
    const name = `${firstName} ${lastName}`.trim();

    return (
        <aside className="w-72 bg-blue-900 text-white flex flex-col min-h-screen shadow-xl">
            <div className="p-6 border-b border-blue-800">
                <div className="flex items-center gap-3">
                    <div className="bg-white rounded-full p-2">
                        <Droplets size={32} className="text-blue-700" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">Municipality</h1>
                        <p className="text-blue-200 text-sm">Water Outage System</p>
                    </div>
                </div>
            </div>

            <div className="p-6 border-b border-blue-800">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-lg shadow">
                        {name[0] || "R"}
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm truncate max-w-[130px]">{name}</h2>
                        <p className="text-blue-200 text-xs">Resident Portal</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 mt-4">
                {menu.map((item) => (
                    <NavLink
                        key={item.title}
                        to={item.path}
                        end={item.path === "/resident"}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
                                isActive ? "bg-blue-700 border-r-4 border-cyan-400" : "hover:bg-blue-800"
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </NavLink>
                ))}
            </nav>

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