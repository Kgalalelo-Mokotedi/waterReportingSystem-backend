import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import your page/view components
import AuthPortal from './components/AuthPortal';
import ResidentDashboard from './components/ResidentDashboard';
import TechnicianDashboard from './components/TechnicianDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

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
 * Protected Route
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

                {/* Authentication */}

                <Route path="/" element={<AuthPortal />} />

                <Route path="/login" element={<AuthPortal />} />

                {/* Dashboard Redirect */}

                <Route path="/dashboard" element={<DashboardRedirect />} />

                {/* Resident */}

                <Route
                    path="/resident"
                    element={
                        <ProtectedRoute allowedRoles={['RESIDENT', 'USER']}>
                            <ResidentDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Administrator */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'MUNICIPAL']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Technician */}

                <Route
                    path="/technician"
                    element={
                        <ProtectedRoute allowedRoles={['TECH', 'TECHNICIAN']}>
                            <TechnicianDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all */}

                <Route path="*" element={<DashboardRedirect />} />

            </Routes>

        </BrowserRouter>

    );

}