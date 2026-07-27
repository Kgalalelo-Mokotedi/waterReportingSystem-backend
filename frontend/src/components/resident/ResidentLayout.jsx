import React from "react";
import { Outlet } from "react-router-dom";
import ResidentSidebar from "./ResidentSidebar";
import ResidentTopNavbar from "./ResidentTopNavbar";

export default function ResidentLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <ResidentSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <ResidentTopNavbar />
                <main className="p-8 space-y-6 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}