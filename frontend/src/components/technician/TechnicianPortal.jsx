import React from 'react';
import { Outlet } from 'react-router-dom';
import TechnicianSidebar from './TechnicianSidebar';
import TechnicianNavbar from './TechnicianNavbar';

export default function TechnicianPortal() {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <TechnicianSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TechnicianNavbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}