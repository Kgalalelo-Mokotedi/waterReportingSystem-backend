import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function UpdateStatus() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState('IN_PROGRESS');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [alert, setAlert] = useState({ type: '', text: '' });
    const [reportTitle, setReportTitle] = useState('');
    const [statusHistory, setStatusHistory] = useState([]);
    const [technicianId, setTechnicianId] = useState('');

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const api = axios.create({
        baseURL: 'http://localhost:8081',
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch report data
                const response = await api.get(`/api/reports/${id}`);
                const data = response.data.data ?? response.data;
                if (data) {
                    setReportTitle(data.title || `Report #${id}`);
                    if (data.status) setStatus(data.status);
                }

                // Fetch technician profile linked to the logged-in user to get the correct technician ID (not userId)
                try {
                    const techRes = await api.get(`/api/technicians`);
                    const techList = techRes.data.data ?? techRes.data;
                    if (Array.isArray(techList)) {
                        const matchedTech = techList.find(t =>
                            String(t.userId) === String(userId) ||
                            String(t.user?.id) === String(userId) ||
                            String(t.id) === String(userId)
                        );
                        if (matchedTech) {
                            setTechnicianId(matchedTech.id);
                        } else if (techList.length > 0) {
                            // Fallback to first available technician if exact match isn't found
                            setTechnicianId(techList[0].id);
                        }
                    }
                } catch (techErr) {
                    console.log("Could not fetch technicians list, falling back to userId");
                    setTechnicianId(userId || 1);
                }

                // Fetch status updates history matching backend endpoint /api/status-updates/report/{reportId}
                try {
                    const historyRes = await api.get(`/api/status-updates/report/${id}`);
                    const historyData = historyRes.data.data ?? historyRes.data;
                    if (Array.isArray(historyData)) {
                        setStatusHistory(historyData);
                    }
                } catch (histErr) {
                    console.log("Status history endpoint fetch failed or empty");
                }

            } catch (err) {
                console.error("Failed to fetch details:", err);
            } finally {
                setFetching(false);
            }
        };
        fetchDetails();
    }, [id, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: '', text: '' });

        // Payload matches backend StatusUpdateRequest fields using the resolved technician profile ID
        const payload = {
            reportId: Number(id),
            technicianId: technicianId ? Number(technicianId) : Number(userId) || 1,
            newStatus: status,
            comment: comment
        };

        try {
            await api.post('/api/status-updates', payload);

            setAlert({ type: 'success', text: 'Status update logged successfully!' });
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (err) {
            console.error("Failed to update status:", err);
            setAlert({
                type: 'error',
                text: err.response?.data?.message || 'Failed to log status update. Please check backend API mapping.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-6 text-gray-500">Loading update form...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-lg border shadow-sm transition"
            >
                <ArrowLeft size={16} /> Back
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Update Incident Status</h1>
                    <p className="text-sm text-gray-500 mt-1">{reportTitle}</p>
                </div>

                {alert.text && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
                        alert.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {alert.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="ASSIGNED">Assigned</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Comment / Field Notes</label>
                        <textarea
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Describe work completed, meter conditions, or reason for rejection..."
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition disabled:opacity-50"
                        >
                            <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {statusHistory.length > 0 && (
                    <div className="pt-6 border-t mt-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Status Update History</h3>
                        <div className="space-y-3">
                            {statusHistory.map((item, idx) => (
                                <div key={item.id || idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-blue-600">{item.newStatus || item.new_status}</span>
                                        <span className="text-xs text-gray-400">{item.createdAt?.substring(0, 16) || item.created_at?.substring(0, 16) || "N/A"}</span>
                                    </div>
                                    <p className="text-gray-700">{item.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}