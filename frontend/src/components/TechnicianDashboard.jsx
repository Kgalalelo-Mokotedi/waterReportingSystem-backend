import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TechnicianDashboard({ onLogout }) {
    const navigate = useNavigate();
    const technicianId = localStorage.getItem('technicianId') || 1;

    const [assignments, setAssignments] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({ status: 'IN_PROGRESS', comment: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [availability, setAvailability] = useState('AVAILABLE');
    const [workloadCount, setWorkloadCount] = useState(0);
    const [dashboardStats, setDashboardStats] = useState({ totalReports: 0, activeOutages: 0 });
    const [statusHistory, setStatusHistory] = useState([]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    };

    const parseStatusString = (statusValue) => {
        if (!statusValue) return 'OPEN';
        if (typeof statusValue === 'string') return statusValue;
        if (typeof statusValue === 'object') {
            return statusValue.status || statusValue.name || statusValue.message || 'OPEN';
        }
        return String(statusValue);
    };

    const getStatusBadgeStyle = (rawStatus) => {
        const status = parseStatusString(rawStatus).toUpperCase();
        const baseStyle = {
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'inline-block'
        };

        switch (status) {
            case 'ASSIGNED':
            case 'OPEN':
            case 'PENDING':
                return { ...baseStyle, backgroundColor: '#fffbe6', color: '#faad14', border: '1px solid #ffe58f' };
            case 'IN_PROGRESS':
            case 'ON_SITE':
                return { ...baseStyle, backgroundColor: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff' };
            case 'WAITING_PARTS':
                return { ...baseStyle, backgroundColor: '#fff2e8', color: '#fa541c', border: '1px solid #ffbb96' };
            case 'RESOLVED':
            case 'COMPLETED':
            case 'CLOSED':
                return { ...baseStyle, backgroundColor: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f' };
            case 'CANCELLED':
                return { ...baseStyle, backgroundColor: '#fff1f0', color: '#f5222d', border: '1px solid #ffa39e' };
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

    const fetchMetrics = async () => {
        try {
            const statsRes = await axios.get('http://localhost:8081/api/dashboard/stats', getAuthHeaders());
            const data = statsRes.data?.data || statsRes.data || {};
            setDashboardStats({
                totalReports: typeof data.totalReports === 'number' ? data.totalReports : 0,
                activeOutages: typeof data.activeOutages === 'number' ? data.activeOutages : 0
            });
        } catch {
            setDashboardStats({ totalReports: 0, activeOutages: 0 });
        }

        try {
            const workloadRes = await axios.get(`http://localhost:8081/api/assignments/technician/${technicianId}/workload`, getAuthHeaders());
            const count = workloadRes.data?.data?.count ?? workloadRes.data?.count ?? workloadRes.data;
            setWorkloadCount(typeof count === 'number' ? count : 0);
        } catch {
            setWorkloadCount(0);
        }
    };

    const fetchAssignments = async () => {
        setIsLoading(true);
        try {
            // Uses standard GET /api/reports endpoint natively available on your backend
            const res = await axios.get('http://localhost:8081/api/reports', getAuthHeaders());
            const reportList = extractArrayData(res?.data);

            setAssignments(reportList);
            if (reportList.length > 0) {
                setSelectedJob(reportList[0]);
            } else {
                setSelectedJob(null);
            }
        } catch (error) {
            console.error('Failed to fetch reports from database:', error);
            setAssignments([]);
            setSelectedJob(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStatusHistory = async (reportId) => {
        if (!reportId) return;
        try {
            const res = await axios.get(`http://localhost:8081/api/status-updates/report/${reportId}`, getAuthHeaders());
            const history = extractArrayData(res?.data);
            setStatusHistory(history);
        } catch {
            setStatusHistory([]);
        }
    };

    useEffect(() => {
        fetchMetrics();
        fetchAssignments();
    }, []);

    useEffect(() => {
        if (selectedJob) {
            const reportId = selectedJob.reportId || selectedJob.report?.id || selectedJob.id;
            fetchStatusHistory(reportId);
        }
    }, [selectedJob]);

    const handleToggleAvailability = async () => {
        const nextStatus = availability === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
        try {
            await axios.patch(`http://localhost:8081/api/technicians/${technicianId}/availability?status=${nextStatus}`, {}, getAuthHeaders());
            setAvailability(nextStatus);
        } catch (error) {
            console.error('Failed to update availability on server:', error);
        }
    };

    const handleAssignmentAction = async (newStatusLabel) => {
        if (!selectedJob) return;
        const targetReportId = selectedJob.reportId || selectedJob.report?.id || selectedJob.id;

        try {
            // Uses standard PUT /api/reports/{id} update endpoint matching backend WaterReportRequest payload
            await axios.put(`http://localhost:8081/api/reports/${targetReportId}`, {
                title: selectedJob.title || selectedJob.report?.title || 'Updated Outage Report',
                description: selectedJob.description || selectedJob.report?.description || 'Status update modification',
                municipality: selectedJob.municipality || selectedJob.report?.municipality || 'Default Municipality',
                suburb: selectedJob.suburb || selectedJob.report?.suburb || 'Default Suburb',
                priority: selectedJob.priority || selectedJob.report?.priority || 'MEDIUM',
                status: newStatusLabel
            }, getAuthHeaders());

            alert(`Job status successfully updated to ${newStatusLabel}!`);
            await fetchAssignments();
            await fetchStatusHistory(targetReportId);
            await fetchMetrics();
        } catch (error) {
            console.error('Failed to update assignment status:', error);
            alert('Error updating assignment on the server.');
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!selectedJob) return;

        const targetReportId = selectedJob.reportId || selectedJob.report?.id || selectedJob.id;

        try {
            await axios.post('http://localhost:8081/api/status-updates', {
                reportId: Number(targetReportId),
                technicianId: Number(technicianId),
                newStatus: statusUpdate.status,
                comment: statusUpdate.comment
            }, getAuthHeaders());

            alert('Job status updated successfully!');
            setStatusUpdate({ status: statusUpdate.status, comment: '' });

            await fetchAssignments();
            await fetchStatusHistory(targetReportId);
            await fetchMetrics();
        } catch (error) {
            console.error('Failed to post status update:', error);
            alert('Failed to save status update to the database.');
        }
    };

    return (
        <div style={styles.container}>
            <header style={{ ...styles.header, backgroundColor: '#5e35b1' }}>
                <div style={styles.logo}>🔧 Field Technician Portal - Active Reports</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={handleToggleAvailability}
                        style={{
                            ...styles.availBtn,
                            backgroundColor: availability === 'AVAILABLE' ? '#4caf50' : '#f44336'
                        }}
                    >
                        Status: {availability}
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            <div style={styles.content}>
                <div style={styles.statsRow}>
                    <div style={styles.card}>
                        <h4 style={styles.cardTitle}>My Workload</h4>
                        <span style={{ ...styles.statNumber, color: '#5e35b1' }}>{workloadCount || assignments.length}</span>
                    </div>
                    <div style={styles.card}>
                        <h4 style={styles.cardTitle}>Total Reports</h4>
                        <span style={styles.statNumber}>{dashboardStats.totalReports}</span>
                    </div>
                    <div style={styles.card}>
                        <h4 style={styles.cardTitle}>Active Outages</h4>
                        <span style={{ ...styles.statNumber, color: '#f44336' }}>{dashboardStats.activeOutages}</span>
                    </div>
                </div>

                <div style={styles.grid2Col}>
                    <div style={styles.panel}>
                        <h3>System Reports</h3>
                        <div style={styles.jobList}>
                            {isLoading ? (
                                <p style={{ color: '#8c8c8c', padding: '10px 0' }}>Loading reports...</p>
                            ) : assignments.length === 0 ? (
                                <p style={{ color: '#8c8c8c', padding: '10px 0' }}>No reports found in database.</p>
                            ) : (
                                assignments.map((job) => {
                                    const jobStatusStr = parseStatusString(job?.status);
                                    return (
                                        <div
                                            key={job?.id || Math.random()}
                                            onClick={() => setSelectedJob(job)}
                                            style={{
                                                ...styles.jobCard,
                                                borderLeft: selectedJob?.id === job?.id ? '4px solid #5e35b1' : '1px solid #e0e0e0',
                                                backgroundColor: selectedJob?.id === job?.id ? '#f7f4fc' : '#ffffff'
                                            }}
                                        >
                                            <strong>RPT-{job?.reportId || job?.report?.id || job?.id}</strong>
                                            <p style={{ margin: '4px 0', fontSize: '13px', color: '#434343' }}>
                                                {typeof job?.title === 'string' ? job.title : (job?.report?.title || job?.address || 'Site Location')}
                                            </p>
                                            <span style={getStatusBadgeStyle(jobStatusStr)}>
                                                {jobStatusStr}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div style={styles.panel}>
                        {selectedJob ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0 }}>
                                        Report Details: RPT-{selectedJob?.reportId || selectedJob?.report?.id || selectedJob?.id}
                                    </h3>
                                    <span style={getStatusBadgeStyle(selectedJob?.status)}>
                                        {parseStatusString(selectedJob?.status)}
                                    </span>
                                </div>

                                <div style={{ marginTop: '16px' }}>
                                    <p style={styles.detailRow}>
                                        <strong>Location/Address:</strong> {typeof selectedJob?.address === 'string' ? selectedJob.address : (selectedJob?.report?.address || `${selectedJob?.streetName || ''}, ${selectedJob?.suburb || 'N/A'}`)}
                                    </p>
                                    <p style={styles.detailRow}>
                                        <strong>Issue Title:</strong> {typeof selectedJob?.title === 'string' ? selectedJob.title : (selectedJob?.report?.title || 'N/A')}
                                    </p>
                                    <p style={styles.detailRow}>
                                        <strong>Description:</strong> {typeof selectedJob?.description === 'string' ? selectedJob.description : (selectedJob?.report?.description || 'No additional description provided.')}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleAssignmentAction('IN_PROGRESS')}
                                        style={styles.actionStartBtn}
                                    >
                                        ▶ Start Job
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAssignmentAction('RESOLVED')}
                                        style={styles.actionCompleteBtn}
                                    >
                                        ✔ Complete Job
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAssignmentAction('CANCELLED')}
                                        style={styles.actionCancelBtn}
                                    >
                                        ✖ Cancel
                                    </button>
                                </div>

                                <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

                                <h4>Update Work Progress</h4>
                                <form onSubmit={handleUpdateStatus}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Update Status</label>
                                        <select
                                            style={styles.input}
                                            value={statusUpdate.status}
                                            onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                                        >
                                            <option value="ASSIGNED">Assigned</option>
                                            <option value="IN_PROGRESS">In Progress / On Site</option>
                                            <option value="WAITING_PARTS">Waiting for Parts</option>
                                            <option value="RESOLVED">Resolved / Work Done</option>
                                        </select>
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Work Notes / Comments</label>
                                        <textarea
                                            rows="3"
                                            style={{ ...styles.input, resize: 'vertical' }}
                                            placeholder="Write technician notes here..."
                                            value={statusUpdate.comment}
                                            onChange={(e) => setStatusUpdate({ ...statusUpdate, comment: e.target.value })}
                                        />
                                    </div>

                                    <button type="submit" style={{ ...styles.primaryBtn, backgroundColor: '#5e35b1' }}>
                                        Save Status Update
                                    </button>
                                </form>

                                <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

                                <h4>Activity History Logs</h4>
                                <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                    {statusHistory.length === 0 ? (
                                        <p style={{ color: '#8c8c8c', fontSize: '13px' }}>No field updates logged yet for this report.</p>
                                    ) : (
                                        statusHistory.map((log, index) => {
                                            const logStatusStr = parseStatusString(log?.status || log?.newStatus);
                                            return (
                                                <div key={index} style={styles.historyCard}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12px' }}>
                                                        <span>{logStatusStr}</span>
                                                        <span style={{ color: '#8c8c8c', fontWeight: 'normal' }}>
                                                            {log?.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'Recent'}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '13px', marginTop: '4px', color: '#434343' }}>
                                                        {typeof log?.comment === 'string' ? log.comment : 'No description notes provided.'}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </>
                        ) : (
                            <p style={{ color: '#8c8c8c' }}>Select a report from the left panel to view details and post updates.</p>
                        )}
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
        color: '#ffffff',
        padding: '0 24px',
        height: '64px'
    },
    logo: { fontSize: '18px', fontWeight: 'bold' },
    availBtn: {
        color: '#ffffff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '12px'
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        color: '#ffffff',
        border: '1px solid #ffffff',
        padding: '6px 16px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    content: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    cardTitle: { margin: '0 0 6px 0', color: '#8c8c8c', fontSize: '13px' },
    statNumber: { fontSize: '26px', fontWeight: 'bold', color: '#262626' },
    grid2Col: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' },
    panel: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    jobList: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' },
    jobCard: {
        padding: '14px',
        borderRadius: '6px',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease'
    },
    detailRow: { margin: '8px 0', fontSize: '14px', color: '#262626' },
    inputGroup: { marginBottom: '16px' },
    label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: '#434343' },
    input: { width: '100%', padding: '8px 12px', fontSize: '14px', borderRadius: '4px', border: '1px solid #d9d9d9', boxSizing: 'border-box' },
    primaryBtn: { width: '100%', padding: '10px', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
    actionStartBtn: { backgroundColor: '#1890ff', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
    actionCompleteBtn: { backgroundColor: '#52c41a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
    actionCancelBtn: { backgroundColor: '#ff4d4f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
    historyCard: { backgroundColor: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '4px', padding: '10px', marginBottom: '8px' }
};