import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import DashboardCards from "./DashboardCards";
import SearchFilters from "./SearchFilters";
import ReportsTable from "./ReportsTable";
import QuickActions from "./QuickActions";
import RecentUpdates from "./RecentUpdates";
import Pagination from "./Pagination";

export default function AdminDashboard() {

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [suburb, setSuburb] = useState("");

    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [categories, setCategories] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const navigate = useNavigate();
    const [updates, setUpdates] = useState([]);
    const [loadingUpdates, setLoadingUpdates] = useState(false);

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        loadCategories();
        loadRecentUpdates();
        loadTechnicians();
    }, []);

    useEffect(() => {
        loadReports();
    }, [page, search, status, priority, category, municipality, suburb]);

    // Compute stats dynamically from live records to keep metric cards in sync
    const stats = useMemo(() => {
        const totalReports = totalElements || reports.length;

        const pendingReports = reports.filter(r => r.status === "REPORTED" || r.status === "PENDING").length;
        const inProgressReports = reports.filter(r => r.status === "IN_PROGRESS" || r.status === "ASSIGNED").length;
        const resolvedReports = reports.filter(r => r.status === "RESOLVED" || r.status === "CLOSED").length;

        const availableTechnicians = technicians.filter(t => t.available || t.status === "AVAILABLE" || !t.busy).length;
        const assignedTechnicians = technicians.filter(t => t.busy || t.status === "ASSIGNED" || t.status === "BUSY").length;

        return {
            totalReports,
            pendingReports,
            inProgressReports,
            resolvedReports,
            availableTechnicians,
            assignedTechnicians
        };
    }, [reports, totalElements, technicians]);

    const loadTechnicians = async () => {
        try {
            const response = await api.get("/api/technicians");
            const data = response.data.data ?? response.data;
            setTechnicians(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load technicians for stats", error);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await api.get("/api/categories");
            setCategories(response.data.data ?? response.data);
        } catch (err) {
            console.error("Failed to load categories", err);
        }
    };

    const loadReports = async () => {
        try {
            setLoadingReports(true);

            let endpoint = "/api/reports";
            let params = { page, size, sortBy: "createdAt" };

            if (status) {
                endpoint = "/api/reports/search/status";
                params.status = status;
            } else if (priority) {
                endpoint = "/api/reports/search/priority";
                params.priority = priority;
            } else if (municipality) {
                endpoint = "/api/reports/search/municipality";
                params.municipality = municipality;
            } else if (suburb) {
                endpoint = "/api/reports/search/suburb";
                params.suburb = suburb;
            } else if (category) {
                endpoint = "/api/reports/search/category";
                params.categoryId = category;
            } else if (search) {
                endpoint = "/api/reports/search/title";
                params.title = search;
            }

            const response = await api.get(endpoint, { params });
            const data = response.data.data ?? response.data;

            setReports(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);

        } catch (error) {
            console.error("Failed to load reports", error);
            setReports([]);
        } finally {
            setLoadingReports(false);
        }
    };

    const loadRecentUpdates = async () => {
        try {
            setLoadingUpdates(true);
            const response = await api.get("/api/status-updates");
            const data = response.data.data ?? response.data;
            setUpdates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load recent updates", error);
        } finally {
            setLoadingUpdates(false);
        }
    };

    const resetFilters = () => {
        setSearch("");
        setStatus("");
        setPriority("");
        setCategory("");
        setMunicipality("");
        setSuburb("");
        setPage(0);
    };

    const changePage = (newPage) => {
        setPage(newPage);
    };

    const exportReports = () => {
        alert("Export coming soon");
    };

    const viewReport = (report) => {
        navigate(`/admin/reports/${report.id}`);
    };

    const updateStatus = (report) => {
        console.log(report);
    };

    const manageReports = () => navigate("/admin/reports");

    const assignTechnician = (report) => {
        if (report && report.id) {
            navigate(`/admin/assignments/${report.id}`);
        } else {
            alert("Please select a specific report from the table to assign a technician.");
        }
    };

    const openAssignments = (report) => {
        if (report && report.id) {
            navigate(`/admin/assignments/${report.id}`);
        } else {
            navigate("/admin/reports");
        }
    };

    const manageTechnicians = () => navigate("/admin/technicians");
    const manageCategories = () => navigate("/admin/categories");
    const viewStatistics = () => navigate("/admin/statistics");
    const createReport = () => navigate("/admin/reports/new");

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar user={user} />
            <div className="flex-1 flex flex-col">
                <TopNavbar user={user} notificationCount={5} />
                <main className="p-8 space-y-8">
                    <DashboardCards stats={stats} />

                    <SearchFilters
                        search={search}
                        setSearch={setSearch}
                        status={status}
                        setStatus={setStatus}
                        priority={priority}
                        setPriority={setPriority}
                        category={category}
                        setCategory={setCategory}
                        municipality={municipality}
                        setMunicipality={setMunicipality}
                        suburb={suburb}
                        setSuburb={setSuburb}
                        categories={categories}
                        onReset={resetFilters}
                        onExport={exportReports}
                    />

                    <ReportsTable
                        reports={reports}
                        loading={loadingReports}
                        onView={viewReport}
                        onAssign={assignTechnician}
                        onStatus={updateStatus}
                    />

                    <QuickActions
                        onManageReports={manageReports}
                        onAssignTechnician={openAssignments}
                        onManageTechnicians={manageTechnicians}
                        onManageCategories={manageCategories}
                        onStatistics={viewStatistics}
                        onNewReport={createReport}
                    />

                    <RecentUpdates
                        updates={updates}
                        reports={reports}
                        loading={loadingUpdates || loadingReports}
                    />

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        pageSize={size}
                        onPageChange={changePage}
                    />
                </main>
            </div>
        </div>
    );
}