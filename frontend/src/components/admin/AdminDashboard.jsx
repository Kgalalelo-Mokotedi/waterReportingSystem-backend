import React, { useEffect, useState } from "react";
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
    const [search,setSearch]=useState("");
    const [status,setStatus]=useState("");
    const [priority,setPriority]=useState("");
    const [category,setCategory]=useState("");
    const [municipality,setMunicipality]=useState("");
    const [suburb,setSuburb]=useState("");
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [categories,setCategories]=useState([]);
    const navigate = useNavigate();
    const [updates, setUpdates] = useState([]);
    const [loadingUpdates, setLoadingUpdates] = useState(false);

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [stats, setStats] = useState({
        totalReports: 0,
        pendingReports: 0,
        inProgressReports: 0,
        resolvedReports: 0,
        availableTechnicians: 0,
        assignedTechnicians: 0
    });

    useEffect(() => {
        loadStats();
        loadCategories();
        loadReports();
        loadRecentUpdates();

    }, [
        page,
        search,
        status,
        priority,
        category,
        municipality,
        suburb

    ]);

    const loadStats = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8080/api/dashboard/stats",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.data.success) {
                setStats(response.data.data);
            }

        } catch (error) {

            console.error("Failed to load dashboard statistics", error);

        }

    };


    const loadCategories = async()=>{

        try{

            const response = await axios.get(
                "http://localhost:8080/api/categories",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setCategories(response.data);

        }
        catch(err){

            console.log(err);

        }

    }

    const loadReports = async () => {

        try {

            setLoadingReports(true);

            const response = await axios.get(

                "http://localhost:8080/api/reports",

                {

                    params:{

                        page,

                        size,

                        search,

                        status,

                        priority,

                        category,

                        municipality,

                        suburb

                    },

                    headers:{

                        Authorization:`Bearer ${localStorage.getItem("token")}`

                    }

                }

            );

            setReports(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);

        }
        catch(error){

            console.error(error);

        }
        finally{

            setLoadingReports(false);

        }

    };

    const loadRecentUpdates = async () => {

        try {

            setLoadingUpdates(true);

            const response = await axios.get(
                "http://localhost:8080/api/status-updates",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.data.success) {
                setUpdates(response.data.data);
            } else {
                setUpdates(response.data);
            }

        } catch (error) {

            console.error(error);

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

    const exportReports=()=>{

        alert("Export coming soon");

    }

    const viewReport = (report) => {

        console.log(report);

    };

    const updateStatus = (report) => {

        console.log(report);

    };

    const manageReports = () => navigate("/admin/reports");
    const assignTechnician = () => navigate("/admin/assignments");
    const manageTechnicians = () => navigate("/admin/technicians");
    const manageCategories = () => navigate("/admin/categories");
    const viewStatistics = () => navigate("/admin/statistics");
    const createReport = () => navigate("/admin/reports/new");

    return (

        <div className="flex bg-gray-100 min-h-screen">

            <Sidebar user={user} />

            <div className="flex-1 flex flex-col">

                <TopNavbar
                    user={user}
                    notificationCount={5}
                />

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

                        onAssignTechnician={assignTechnician}

                        onManageTechnicians={manageTechnicians}

                        onManageCategories={manageCategories}

                        onStatistics={viewStatistics}

                        onNewReport={createReport}

                    />

                    <RecentUpdates
                        updates={updates}
                        loading={loadingUpdates}
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