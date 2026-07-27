import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import authentication
import AuthPortal from './components/AuthPortal';

// Import Technician Portal Layout & Sub-Pages
import TechnicianPortal from './components/technician/TechnicianPortal';
import TechnicianDashboard from './components/technician/TechnicianDashboard';
import AssignedReports from './components/technician/AssignedReports';
import IncidentDetails from './components/technician/IncidentDetails';
import UpdateStatus from './components/technician/UpdateStatus';
import TechnicianProfile from './components/technician/TechnicianProfile';

// Import Resident Portal Layout and Sub-Pages
import ResidentLayout from './components/resident/ResidentLayout';
import ResidentDashboard from './components/resident/ResidentDashboard';
import CreateReport from './components/resident/CreateReport';
import MyReports from './components/resident/MyReports';
import ReportHistory from './components/resident/ReportHistory';
import ResidentProfile from './components/resident/ResidentProfile';

// Administrator Components
import AdminDashboard from './components/admin/AdminDashboard';
import ReportsManagement from './components/admin/ReportsManagement';
import ReportDetails from './components/admin/ReportDetails';
import AssignTechnician from './components/admin/AssignTechnician';
import TechnicianManagement from './components/admin/TechnicianManagement';
import CategoriesManagement from './components/admin/CategoriesManagement';

/**
 * Helper to extract and decode the role string from the stored JWT token.
 */
const getStoredRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return null;

        const decodedPayload = JSON.parse(atob(payloadBase64));

        const rawRole =
            decodedPayload.role ||
            decodedPayload.roles ||
            decodedPayload.authorities ||
            'RESIDENT';

        return rawRole.toString().toUpperCase();

    } catch (e) {
        console.error('Failed to parse authentication token:', e);
        return null;
    }
};

/**
 * Redirect users based on role.
 */
const DashboardRedirect = () => {
    const role = getStoredRole();

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (role.includes('ADMIN') || role.includes('MUNICIPAL')) {
        return <Navigate to="/admin" replace />;
    }

    if (role.includes('TECH') || role.includes('TECHNICIAN')) {
        return <Navigate to="/technician" replace />;
    }

    return <Navigate to="/resident" replace />;
};

/**
 * Protected Route Component
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const role = getStoredRole();

    if (!role) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    const hasAccess = allowedRoles.some((allowed) =>
        role.includes(allowed)
    );

    if (!hasAccess) {
        return <DashboardRedirect />;
    }

    return children;
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Authentication Routes */}
                <Route path="/" element={<AuthPortal />} />
                <Route path="/login" element={<AuthPortal />} />

                {/* Dashboard Global Redirect */}
                <Route path="/dashboard" element={<DashboardRedirect />} />

                {/* Resident Portal Nested Routes */}
                <Route
                    path="/resident"
                    element={
                        <ProtectedRoute allowedRoles={['RESIDENT', 'USER']}>
                            <ResidentLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<ResidentDashboard />} />
                    <Route path="create" element={<CreateReport />} />
                    <Route path="reports" element={<MyReports />} />
                    <Route path="history" element={<ReportHistory />} />
                    <Route path="profile" element={<ResidentProfile />} />
                </Route>

                {/* Administrator Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'MUNICIPAL']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'MUNICIPAL']}>
                            <ReportsManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/reports/:id"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'MUNICIPAL']}>
                            <ReportDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/assignments/:id"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'MUNICIPAL']}>
                            <AssignTechnician />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/technicians"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'MUNICIPAL']}>
                            <TechnicianManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/categories"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'MUNICIPAL']}>
                            <CategoriesManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Technician Portal Nested Routes */}
                <Route
                    path="/technician/*"
                    element={
                        <ProtectedRoute allowedRoles={['TECH', 'TECHNICIAN']}>
                            <TechnicianPortal />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<TechnicianDashboard />} />
                    <Route path="reports" element={<AssignedReports />} />
                    <Route path="reports/:id" element={<IncidentDetails />} />
                    <Route path="reports/:id/update" element={<UpdateStatus />} />
                    <Route path="profile" element={<TechnicianProfile />} />
                </Route>

                {/* Fallback Catch-all Route */}
                <Route path="*" element={<DashboardRedirect />} />
            </Routes>
        </BrowserRouter>
    );
}