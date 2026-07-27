import React, { useEffect, useState } from "react";
import axios from "axios";
import { Shield, Users, Wrench, FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export default function AdminProfile() {
    const [stats, setStats] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId") || 1;

    const api = axios.create({
        baseURL: "http://localhost:8081/api",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, techRes] = await Promise.all([
                    api.get("/dashboard/stats").catch(() => ({ data: { data: {} } })),
                    api.get("/technicians").catch(() => ({ data: { data: [] } }))
                ]);

                const statsData = statsRes.data.data ?? statsRes.data;
                const techData = techRes.data.data ?? techRes.data;

                setStats(statsData);
                setTechnicians(Array.isArray(techData) ? techData : []);
            } catch (err) {
                console.error("Failed to load admin profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Shield className="text-blue-600" size={28} /> Admin Control & Profile
                </h1>
                <p className="text-sm text-gray-500 mt-1">System overview, municipal performance metrics, and staff management.</p>
            </div>

            {/* Admin Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Registered Technicians</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{loading ? "..." : technicians.length}</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-600 text-white shadow-md"><Users size={24} /></div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total System Reports</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{loading ? "..." : (stats?.totalReports || stats?.total || 0)}</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-md"><FileText size={24} /></div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending Actions</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{loading ? "..." : (stats?.pendingReports || stats?.pending || 0)}</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500 text-white shadow-md"><Clock size={24} /></div>
                </div>
            </div>

            {/* Technicians List & Assignment Overview */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Wrench size={20} className="text-blue-600" /> Active Field Technicians
                </h2>

                {loading ? (
                    <p className="text-gray-500">Loading technicians...</p>
                ) : technicians.length === 0 ? (
                    <p className="text-gray-500">No technicians registered in the system.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b text-gray-600 text-sm">
                                <th className="py-3 px-4">Employee #</th>
                                <th className="py-3 px-4">Specialisation</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {technicians.map((tech) => (
                                <tr key={tech.id} className="border-b hover:bg-gray-50 text-sm">
                                    <td className="py-3 px-4 font-medium text-gray-800">{tech.employeeNumber || `TECH-${tech.id}`}</td>
                                    <td className="py-3 px-4 text-gray-600">{tech.specialisation || "General Maintenance"}</td>
                                    <td className="py-3 px-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                Active
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}