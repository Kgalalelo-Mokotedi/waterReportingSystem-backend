import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ResidentDashboard({ onLogout }) {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalReports: 0, activeOutages: 0, resolvedMonth: 0, updates: 0 });
    const [reports, setReports] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState([]);
    const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'updates'
    const [loading, setLoading] = useState(false);

    // Form state pre-populated with initial default values for easy testing
    const [formData, setFormData] = useState({
        title: 'Burst Pipe on Main Street',
        description: 'Large burst pipe causing flooding.',
        photoUrl: 'https://example.com/photo.jpg',
        priority: 'HIGH',
        status: 'REPORTED',
        streetName: 'Main Street',
        suburb: 'Soweto',
        wardNumber: '12',
        municipality: 'City of Johannesburg',
        province: 'Gauteng',
        residentId: 1,
        categoryId: 1
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    };

    const getStatusBadgeStyle = (status) => {
        const baseStyle = {
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'inline-block'
        };

        switch (status?.toUpperCase()) {
            case 'REPORTED':
            case 'OPEN':
            case 'PENDING':
                return { ...baseStyle, backgroundColor: '#fffbe6', color: '#faad14', border: '1px solid #ffe58f' };
            case 'IN_PROGRESS':
            case 'ON_SITE':
                return { ...baseStyle, backgroundColor: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff' };
            case 'RESOLVED':
            case 'CLOSED':
                return { ...baseStyle, backgroundColor: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f' };
            default:
                return { ...baseStyle, backgroundColor: '#f5f5f5', color: '#595959', border: '1px solid #d9d9d9' };
        }
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/reports', getAuthHeaders());
                const reportList = extractArrayData(res.data);

                setReports(reportList);

                const active = reportList.filter(r => ['REPORTED', 'OPEN', 'IN_PROGRESS'].includes(r.status?.toUpperCase())).length;
                const resolved = reportList.filter(r => ['RESOLVED', 'CLOSED'].includes(r.status?.toUpperCase())).length;

                // Collect updates: check global endpoint first, then aggregate status updates per report if empty
                let updatesList = [];
                try {
                    const updatesRes = await axios.get('http://localhost:8081/api/status-updates', getAuthHeaders());
                    updatesList = extractArrayData(updatesRes.data);
                } catch {
                    // ignore
                }

                if (updatesList.length === 0 && reportList.length > 0) {
                    for (const rep of reportList) {
                        const repId = rep.reportId || rep.id;
                        try {
                            const subRes = await axios.get(`http://localhost:8081/api/status-updates/report/${repId}`, getAuthHeaders());
                            const subData = extractArrayData(subRes.data);
                            updatesList.push(...subData);
                        } catch {
                            // ignore
                        }
                    }
                }

                // Fallback check: if backend returns 0 status logs, fall back to showing reports as initial activity logs
                if (updatesList.length === 0 && reportList.length > 0) {
                    updatesList = reportList.map(r => ({
                        id: r.id,
                        reportId: r.id,
                        status: r.status || 'REPORTED',
                        comment: `Initial report submitted for: ${r.title || 'Water Outage'}`,
                        createdAt: r.createdAt
                    }));
                }

                setStatusUpdates(updatesList);

                setStats({
                    totalReports: reportList.length,
                    activeOutages: active,
                    resolvedMonth: resolved,
                    updates: updatesList.length
                });

            } catch (err) {
                console.error("Failed to fetch reports:", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'residentId' || name === 'categoryId') ? Number(value) : value
        }));
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert("Title is required.");
            return;
        }

        setLoading(true);

        let validPhotoUrl = formData.photoUrl.trim();
        if (validPhotoUrl && !validPhotoUrl.startsWith('http://') && !validPhotoUrl.startsWith('https://')) {
            validPhotoUrl = "https://example.com/photo.jpg";
        }

        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            photoUrl: validPhotoUrl || "https://example.com/photo.jpg",
            priority: formData.priority,
            status: formData.status || "REPORTED",
            streetName: formData.streetName.trim(),
            suburb: formData.suburb.trim(),
            wardNumber: formData.wardNumber.trim(),
            municipality: formData.municipality.trim(),
            province: formData.province.trim(),
            residentId: Number(formData.residentId) || 1,
            categoryId: Number(formData.categoryId) || 1
        };

        try {
            const response = await axios.post('http://localhost:8081/api/reports', payload, getAuthHeaders());

            if (response.data) {
                const addedReport = response.data;
                const updatedList = [addedReport, ...reports];

                const newUpdateLog = {
                    id: addedReport.id,
                    reportId: addedReport.id,
                    status: addedReport.status || 'REPORTED',
                    comment: `Initial report submitted for: ${addedReport.title || 'Water Outage'}`,
                    createdAt: addedReport.createdAt || new Date().toISOString()
                };
                const updatedUpdates = [newUpdateLog, ...statusUpdates];

                setReports(updatedList);
                setStatusUpdates(updatedUpdates);
                setStats(prev => ({
                    ...prev,
                    totalReports: updatedList.length,
                    activeOutages: prev.activeOutages + 1,
                    updates: updatedUpdates.length
                }));

                setFormData({
                    title: '',
                    description: '',
                    photoUrl: 'https://example.com/photo.jpg',
                    priority: 'HIGH',
                    status: 'REPORTED',
                    streetName: '',
                    suburb: '',
                    wardNumber: '',
                    municipality: '',
                    province: '',
                    residentId: 1,
                    categoryId: 1
                });

                alert(`Report submitted successfully! Ref #${addedReport.referenceNumber || addedReport.id}`);
            }
        } catch (err) {
            console.error("Submission failed:", err.response?.data || err.message);

            const backendMsg = err.response?.data?.message
                || (typeof err.response?.data === 'string' ? err.response.data : null)
                || 'Please check required fields.';

            alert(`Failed to submit report: ${backendMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Navigation Header */}
            <header style={styles.header}>
                <div style={styles.logo}>💧 WaterOutage Portal</div>
                <div style={styles.userBadge}>👤 Resident View</div>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </header>

            <div style={styles.content}>
                {/* Stats Summary Panel */}
                <div style={styles.statsRow}>
                    <div onClick={() => setActiveTab('reports')} style={{ ...styles.card, cursor: 'pointer', borderLeftColor: activeTab === 'reports' ? '#1890ff' : '#d9d9d9' }}>
                        <h4 style={styles.cardTitle}>My Reports</h4>
                        <span style={styles.statNumber}>{stats.totalReports}</span>
                        <p style={styles.statSub}>Total submitted</p>
                    </div>
                    <div style={{ ...styles.card, borderLeftColor: '#ff4d4f' }}>
                        <h4 style={styles.cardTitle}>Active Outages</h4>
                        <span style={{ ...styles.statNumber, color: '#ff4d4f' }}>{stats.activeOutages}</span>
                        <p style={styles.statSub}>In progress</p>
                    </div>
                    <div style={{ ...styles.card, borderLeftColor: '#52c41a' }}>
                        <h4 style={styles.cardTitle}>Resolved</h4>
                        <span style={{ ...styles.statNumber, color: '#52c41a' }}>{stats.resolvedMonth}</span>
                        <p style={styles.statSub}>Total resolved</p>
                    </div>
                    <div
                        onClick={() => setActiveTab('updates')}
                        style={{ ...styles.card, cursor: 'pointer', borderLeftColor: activeTab === 'updates' ? '#1890ff' : '#d9d9d9' }}
                    >
                        <h4 style={styles.cardTitle}>Updates Tab</h4>
                        <span style={{ ...styles.statNumber, color: '#1890ff' }}>{stats.updates}</span>
                        <p style={styles.statSub}>Click to view notifications</p>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div style={styles.grid2Col}>
                    {/* Dynamic Panel: Either Reports Table or Updates Tab content */}
                    <div style={styles.panel}>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
                            <button
                                onClick={() => setActiveTab('reports')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    color: activeTab === 'reports' ? '#1890ff' : '#595959',
                                    borderBottom: activeTab === 'reports' ? '2px solid #1890ff' : 'none',
                                    paddingBottom: '4px'
                                }}
                            >
                                My Recent Reports
                            </button>
                            <button
                                onClick={() => setActiveTab('updates')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    color: activeTab === 'updates' ? '#1890ff' : '#595959',
                                    borderBottom: activeTab === 'updates' ? '2px solid #1890ff' : 'none',
                                    paddingBottom: '4px'
                                }}
                            >
                                System Updates & Notifications
                            </button>
                        </div>

                        {activeTab === 'reports' ? (
                            <table style={styles.table}>
                                <thead>
                                <tr style={styles.tableHeaderRow}>
                                    <th style={styles.th}>Ref / ID</th>
                                    <th style={styles.th}>Title</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#8c8c8c' }}>
                                            No reports found
                                        </td>
                                    </tr>
                                ) : (
                                    reports.map((rpt) => (
                                        <tr key={rpt.id} style={styles.tableRow}>
                                            <td style={styles.td}>
                                                <strong>{rpt.referenceNumber ? `#${rpt.referenceNumber}` : `RPT-${rpt.id}`}</strong>
                                            </td>
                                            <td style={styles.td}>
                                                <strong>{rpt.title || 'Water Outage'}</strong>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {rpt.streetName ? `${rpt.streetName}, ${rpt.suburb}` : rpt.suburb || ''}
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={getStatusBadgeStyle(rpt.status)}>{rpt.status || 'REPORTED'}</span>
                                            </td>
                                            <td style={styles.td}>
                                                {rpt.createdAt ? new Date(rpt.createdAt).toLocaleDateString() : 'Recent'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                                {statusUpdates.length === 0 ? (
                                    <p style={{ textAlign: 'center', padding: '20px', color: '#8c8c8c' }}>
                                        No recent system updates or technician notes available.
                                    </p>
                                ) : (
                                    statusUpdates.map((update, index) => (
                                        <div key={update.id || index} style={styles.updateCard}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                <span style={getStatusBadgeStyle(update.status || update.newStatus)}>
                                                    {update.status || update.newStatus || 'UPDATE'}
                                                </span>
                                                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                                    {update.createdAt ? new Date(update.createdAt).toLocaleString() : 'Recent'}
                                                </span>
                                            </div>
                                            <p style={{ margin: '4px 0', fontSize: '14px', color: '#262626' }}>
                                                <strong>Report #{update.reportId || update.report?.id || 'N/A'}:</strong> {update.comment || update.message || 'Status updated by field response team.'}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Report Form */}
                    <div style={styles.panel}>
                        <h3>Report a New Outage</h3>
                        <form onSubmit={handleReportSubmit}>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="e.g. Burst Pipe on Main Street"
                                    style={styles.input}
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    rows="2"
                                    name="description"
                                    required
                                    placeholder="e.g. Large burst pipe causing flooding."
                                    style={{ ...styles.input, resize: 'vertical' }}
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={styles.grid2Row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Priority</label>
                                    <select
                                        name="priority"
                                        style={styles.input}
                                        value={formData.priority}
                                        onChange={handleChange}
                                    >
                                        <option value="LOW">LOW</option>
                                        <option value="MEDIUM">MEDIUM</option>
                                        <option value="HIGH">HIGH</option>
                                        <option value="CRITICAL">CRITICAL</option>
                                    </select>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Category ID</label>
                                    <input
                                        type="number"
                                        name="categoryId"
                                        required
                                        style={styles.input}
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div style={styles.grid2Row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Street Name</label>
                                    <input
                                        type="text"
                                        name="streetName"
                                        required
                                        placeholder="e.g. Main Street"
                                        style={styles.input}
                                        value={formData.streetName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Suburb</label>
                                    <input
                                        type="text"
                                        name="suburb"
                                        required
                                        placeholder="e.g. Soweto"
                                        style={styles.input}
                                        value={formData.suburb}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div style={styles.grid2Row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Ward Number</label>
                                    <input
                                        type="text"
                                        name="wardNumber"
                                        required
                                        placeholder="e.g. 12"
                                        style={styles.input}
                                        value={formData.wardNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Municipality</label>
                                    <input
                                        type="text"
                                        name="municipality"
                                        required
                                        placeholder="e.g. City of Johannesburg"
                                        style={styles.input}
                                        value={formData.municipality}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div style={styles.grid2Row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Province</label>
                                    <input
                                        type="text"
                                        name="province"
                                        required
                                        placeholder="e.g. Gauteng"
                                        style={styles.input}
                                        value={formData.province}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Resident ID</label>
                                    <input
                                        type="number"
                                        name="residentId"
                                        required
                                        style={styles.input}
                                        value={formData.residentId}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Photo URL</label>
                                <input
                                    type="text"
                                    name="photoUrl"
                                    placeholder="https://example.com/photo.jpg"
                                    style={styles.input}
                                    value={formData.photoUrl}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" style={styles.primaryBtn} disabled={loading}>
                                {loading ? 'Submitting...' : 'Report Outage'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#001529',
        color: '#ffffff',
        padding: '0 24px',
        height: '64px'
    },
    logo: { fontSize: '18px', fontWeight: 'bold' },
    userBadge: { backgroundColor: '#1890ff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    logoutBtn: { backgroundColor: 'transparent', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    content: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
    card: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #1890ff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    cardTitle: { margin: '0 0 8px 0', color: '#8c8c8c', fontSize: '14px' },
    statNumber: { fontSize: '28px', fontWeight: 'bold', color: '#262626' },
    statSub: { margin: '4px 0 0 0', fontSize: '12px', color: '#8c8c8c' },
    grid2Col: { display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' },
    grid2Row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    panel: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '16px' },
    tableHeaderRow: { borderBottom: '2px solid #f0f0f0', textAlign: 'left' },
    th: { padding: '12px 8px', color: '#595959', fontSize: '13px', fontWeight: 'bold' },
    tableRow: { borderBottom: '1px solid #f0f0f0' },
    td: { padding: '12px 8px', fontSize: '14px' },
    updateCard: { backgroundColor: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '6px', padding: '12px' },
    inputGroup: { marginBottom: '12px' },
    label: { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: '#434343' },
    input: { width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #d9d9d9', boxSizing: 'border-box' },
    primaryBtn: { width: '100%', padding: '12px', backgroundColor: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }
};