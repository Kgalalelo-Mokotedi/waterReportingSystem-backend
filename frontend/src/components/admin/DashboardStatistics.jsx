import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    ClipboardList,
    Clock,
    Wrench,
    CheckCircle2,
    Users,
    UserCheck
} from "lucide-react";

export default function DashboardStatistics() {
    const [stats, setStats] = useState({
        totalReports: 0,
        pendingReports: 0,
        inProgressReports: 0,
        resolvedReports: 0,
        availableTechnicians: 0,
        assignedTechnicians: 0
    });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                // Fetching reports and technicians to calculate dashboard statistics dynamically
                const [reportsRes, techsRes] = await Promise.all([
                    api.get("/api/reports"),
                    api.get("/api/technicians")
                ]);

                const reports = reportsRes.data.data ?? reportsRes.data.content ?? reportsRes.data;
                const technicians = techsRes.data.data ?? techsRes.data;

                const reportList = Array.isArray(reports) ? reports : [];
                const techList = Array.isArray(technicians) ? technicians : [];

                const totalReports = reportList.length;
                const pendingReports = reportList.filter(r => r.status === "PENDING" || r.status === "SUBMITTED").length;
                const inProgressReports = reportList.filter(r => r.status === "IN_PROGRESS" || r.status === "ASSIGNED").length;
                const resolvedReports = reportList.filter(r => r.status === "RESOLVED" || r.status === "CLOSED").length;

                // Assuming technicians have an availability status or can be checked against active assignments
                const availableTechnicians = techList.filter(t => t.available === true || t.status === "AVAILABLE" || !t.status).length;
                const assignedTechnicians = techList.length - availableTechnicians;

                setStats({
                    totalReports,
                    pendingReports,
                    inProgressReports,
                    resolvedReports,
                    availableTechnicians: availableTechnicians > 0 ? availableTechnicians : techList.length,
                    assignedTechnicians: assignedTechnicians >= 0 ? assignedTechnicians : 0
                });
            } catch (err) {
                console.error("Failed to load dashboard statistics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const cards = [
        {
            title: "Total Reports",
            count: loading ? "..." : stats.totalReports,
            subtitle: "All reported incidents",
            icon: <ClipboardList size={24} className="text-white" />,
            bgIcon: "bg-blue-600"
        },
        {
            title: "Pending Reports",
            count: loading ? "..." : stats.pendingReports,
            subtitle: "Awaiting assignment",
            icon: <Clock size={24} className="text-white" />,
            bgIcon: "bg-amber-500"
        },
        {
            title: "In Progress",
            count: loading ? "..." : stats.inProgressReports,
            subtitle: "Technicians on site",
            icon: <Wrench size={24} className="text-white" />,
            bgIcon: "bg-orange-500"
        },
        {
            title: "Resolved Reports",
            count: loading ? "..." : stats.resolvedReports,
            subtitle: "Completed incidents",
            icon: <CheckCircle2 size={24} className="text-white" />,
            bgIcon: "bg-emerald-600"
        },
        {
            title: "Available Technicians",
            count: loading ? "..." : stats.availableTechnicians,
            subtitle: "Ready for dispatch",
            icon: <Users size={24} className="text-white" />,
            bgIcon: "bg-purple-600"
        },
        {
            title: "Assigned Technicians",
            count: loading ? "..." : stats.assignedTechnicians,
            subtitle: "Currently working",
            icon: <UserCheck size={24} className="text-white" />,
            bgIcon: "bg-teal-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border border-gray-100">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{card.title}</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{card.count}</h3>
                        <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${card.bgIcon} shadow-md`}>
                        {card.icon}
                    </div>
                </div>
            ))}
        </div>
    );
}