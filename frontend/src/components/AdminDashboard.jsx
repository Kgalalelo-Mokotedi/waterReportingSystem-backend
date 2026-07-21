import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ onLogout }) {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ totalReports: 0, activeOutages: 0, resolvedOutages: 0, affectedAreas: 0 });
    const [assignments, setAssignments] = useState({});

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        if (onLogout) onLogout();
        navigate('/login');
    };

    const extractArrayData = (resData) => {
        if (!resData) return [];
        if (Array.isArray(resData)) return resData;
        if (Array.isArray(resData.data)) return resData.data;
        if (Array.isArray(resData.content)) return resData.content;
        return [];
    };

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch Reports
            const reportsRes = await axios.get('http://localhost:8081/api/reports', getAuthHeaders());
            const reportList = extractArrayData(reportsRes?.data);
            setReports(reportList);

            // Fetch Technicians
            const techRes = await axios.get('http://localhost:8081/api/technicians', getAuthHeaders());
            const techList = extractArrayData(techRes?.data);
            setTechnicians(techList);

            // Fetch Stats
            try {
                const statsRes = await axios.get('http://localhost:8081/api/dashboard/stats', getAuthHeaders());
                const statData = statsRes.data?.data || statsRes.data || {};
                setStats({
                    totalReports: statData.totalReports ?? reportList.length,
                    activeOutages: statData.activeOutages ?? reportList.filter(r => r.status !== 'RESOLVED').length,
                    resolvedOutages: statData.resolvedOutages ?? reportList.filter(r => r.status === 'RESOLVED').length,
                    affectedAreas: statData.affectedAreas ?? 1
                });
            } catch {
                setStats({
                    totalReports: reportList.length,
                    activeOutages: reportList.filter(r => r.status !== 'RESOLVED').length,
                    resolvedOutages: reportList.filter(r => r.status === 'RESOLVED').length,
                    affectedAreas: 1
                });
            }
        } catch (error) {
            console.error('Failed to load admin dashboard data:', error);
            setReports([]);
            setTechnicians([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            await axios.patch(`http://localhost:8081/api/reports/${reportId}/status?status=${newStatus}`, {}, getAuthHeaders());
            alert(`Report #${reportId} status updated to ${newStatus}`);
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to update report status:', error);
            alert('Error updating status on the server.');
        }
    };

    const handleAssignTechnician = async (reportId, technicianId) => {
        if (!technicianId) return;
        try {
            await axios.post('http://localhost:8081/api/assignments', {
                reportId: Number(reportId),
                technicianId: Number(technicianId)
            }, getAuthHeaders());

            alert(`Successfully assigned technician to report #${reportId}`);
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to assign technician:', error);
            try {
                // Fallback assignment endpoint structure
                await axios.post(`http://localhost:8081/api/reports/${reportId}/assign/${technicianId}`, {}, getAuthHeaders());
                alert(`Successfully assigned technician to report #${reportId}`);
                fetchDashboardData();
            } catch (err2) {
                alert('Failed to assign technician on the server.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.logo}>🏛 Municipal Admin Dashboard</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchDashboardData} style={styles.refreshBtn}>🔄 Refresh</button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            <div style={styles.content}>
                <div style={styles.statsRow}>
                    <div style={styles.card}>
                        <h4 style={styles.cardTitle}>Total Reports</h4>
                        <span style={styles.statNumber}>{stats.totalReports}</span>
                    </div>
                    <div style={styles.card}>
                        <h4 style={styles.cardTitle}>Active Outages</h4>
                        <span style={{ ...styles.statNumber, color: '#f44336' }}>{stats.activeOutages}</span>
                    </div>
                    <div style={styles.card}>
                        <h4 style={styles.cardTitle}>Resolved Outages</h4>
                        <span style={{ ...styles.statNumber, color: '#52c41a' }}>{stats.resolvedOutages}</span>
                    </div>
                    <div style={styles.card}>
                        <h4 style={styles.cardTitle}>Affected Areas</h4>
                        <span style={{ ...styles.statNumber, color: '#1890ff' }}>{stats.affectedAreas}</span>
                    </div>
                </div>

                <div style={styles.panel}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#262626' }}>All Database Reports & Assignment Management</h3>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                            <tr style={styles.thRow}>
                                <th style={styles.th}>ID / Ref</th>
                                <th style={styles.th}>Title / Location</th>
                                <th style={styles.th}>Municipality</th>
                                <th style={styles.th}>Priority</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Update Status</th>
                                <th style={styles.th}>Assign Technician</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#8c8c8c' }}>Loading reports and database records...</td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#8c8c8c' }}>No database reports found.</td>
                                </tr>
                            ) : (
                                reports.map((report) => {
                                    const repId = report.reportId || report.id;
                                    const refCode = report.referenceCode || `FB${repId}C55`;
                                    const currentStatus = report.status || 'REPORTED';

                                    return (
                                        <tr key={repId} style={styles.tr}>
                                            <td style={styles.td}>
                                                <strong>#{repId}</strong>
                                                <div style={{ fontSize: '11px', color: '#8c8c8c' }}>{refCode}</div>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: 'bold', color: '#262626' }}>{report.title || 'Water System Issue'}</div>
                                                <div style={{ fontSize: '12px', color: '#595959' }}>{report.address || report.streetName || 'Main Location'}</div>
                                            </td>
                                            <td style={styles.td}>{report.municipality || report.city || 'City of Johannesburg'}</td>
                                            <td style={styles.td}>
                                                    <span style={{ fontWeight: 'bold', color: report.priority === 'HIGH' ? '#f44336' : '#faad14' }}>
                                                        {report.priority || 'MEDIUM'}
                                                    </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.statusBadge}>{currentStatus}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <select
                                                    style={styles.select}
                                                    value={currentStatus}
                                                    onChange={(e) => handleStatusChange(repId, e.target.value)}
                                                >
                                                    <option value="REPORTED">Reported</option>
                                                    <option value="ASSIGNED">Assigned</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="WAITING_PARTS">Waiting for Parts</option>
                                                    <option value="RESOLVED">Resolved</option>
                                                </select>
                                            </td>
                                            <td style={styles.td}>
                                                <select
                                                    style={styles.select}
                                                    onChange={(e) => handleAssignTechnician(repId, e.target.value)}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Select Technician</option>
                                                    {technicians.length === 0 ? (
                                                        <option value="" disabled>No technicians registered</option>
                                                    ) : (
                                                        technicians.map((tech) => {
                                                            const techLabel = tech.name || tech.fullName || `Tech #${tech.id} (${tech.employee_number || 'Staff'}) - ${tech.specialisation || 'General'}`;
                                                            return (
                                                                <option key={tech.id} value={tech.id}>
                                                                    {techLabel}
                                                                </option>
                                                            );
                                                        })
                                                    )}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2e7d32', color: '#ffffff', padding: '0 24px', height: '64px' },
    logo: { fontSize: '18px', fontWeight: 'bold' },
    refreshBtn: { backgroundColor: '#ffffff', color: '#2e7d32', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
    logoutBtn: { backgroundColor: 'transparent', color: '#ffffff', border: '1px solid #ffffff', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer' },
    content: { padding: '24px', maxWidth: '1300px', margin: '0 auto' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' },
    card: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    cardTitle: { margin: '0 0 8px 0', color: '#8c8c8c', fontSize: '13px', textTransform: 'uppercase' },
    statNumber: { fontSize: '28px', fontWeight: 'bold', color: '#262626' },
    panel: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '12px' },
    thRow: { borderBottom: '2px solid #f0f0f0', textAlign: 'left' },
    th: { padding: '12px 8px', fontSize: '13px', color: '#595959', fontWeight: 'bold' },
    tr: { borderBottom: '1px solid #f0f0f0' },
    td: { padding: '14px 8px', fontSize: '14px', verticalAlign: 'middle' },
    statusBadge: { padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#fffbe6', color: '#faad14', border: '1px solid #ffe58f' },
    select: { padding: '8px 10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #d9d9d9', backgroundColor: '#262626', color: '#ffffff', cursor: 'pointer', outline: 'none' }
};