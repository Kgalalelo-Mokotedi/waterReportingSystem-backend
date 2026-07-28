import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

export default function EditAdminReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        residentId: "",
        title: "",
        description: "",
        categoryId: "",
        priority: "MEDIUM",
        status: "REPORTED",
        municipality: "",
        suburb: "",
        streetName: "",
        wardNumber: "",
        province: "Gauteng",
        photoUrl: ""
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [reportRes, usersRes, categoriesRes] = await Promise.all([
                    api.get(`/api/reports/${id}`),
                    api.get("/api/users").catch(() => api.get("/api/auth/users")),
                    api.get("/api/categories").catch(() => ({ data: [] }))
                ]);

                const reportData = reportRes.data.data ?? reportRes.data;
                const userData = usersRes.data.data ?? usersRes.data?.content ?? usersRes.data;
                const catData = categoriesRes.data.data ?? categoriesRes.data?.content ?? categoriesRes.data;

                setUsers(Array.isArray(userData) ? userData : []);
                setCategories(Array.isArray(catData) ? catData : []);

                // Extract the resident ID from the existing report (checking various naming conventions)
                const existingResidentId = reportData.residentId || reportData.resident_id || reportData.user?.id || "";

                setFormData({
                    residentId: existingResidentId,
                    title: reportData.title || "",
                    description: reportData.description || "",
                    categoryId: reportData.categoryId || reportData.category?.id || "",
                    priority: reportData.priority || "MEDIUM",
                    status: reportData.status || "REPORTED",
                    municipality: reportData.municipality || "",
                    suburb: reportData.suburb || "",
                    streetName: reportData.streetName || "",
                    wardNumber: reportData.wardNumber || "",
                    province: reportData.province || "Gauteng",
                    photoUrl: reportData.photoUrl || ""
                });
            } catch (err) {
                console.error("Failed to fetch report details or users:", err);
                setError("Could not load report details from the database.");
            } finally {
                setLoading(false);
                setLoadingUsers(false);
            }
        };

        if (id) {
            fetchInitialData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.residentId) {
            setError("Resident ID is required. Please select who logged this report.");
            return;
        }

        if (!formData.title || !formData.description || !formData.wardNumber) {
            setError("Title, description, and ward number are required.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const payload = {
                ...formData,
                residentId: Number(formData.residentId),
                resident_id: Number(formData.residentId) // ensures compatibility with both snake_case and camelCase backend expectations
            };

            await api.put(`/api/reports/${id}`, payload);
            navigate("/admin/reports");
        } catch (err) {
            console.error("Failed to update report:", err);
            setError(err.response?.data?.message || "Failed to update report. Please check all fields.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 font-medium">Loading report details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopNavbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 p-8 max-w-4xl mx-auto space-y-6 pb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/admin/reports")}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-lg border shadow-sm transition"
                        >
                            <ArrowLeft size={18} /> Back to Reports
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Edit Incident Report #{id}</h1>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6 border border-gray-100">
                        {/* Select Resident / Person Who Logged Report */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Person Who Logged Report (Resident) <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="residentId"
                                value={formData.residentId}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">-- Choose a registered user --</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.firstName} {u.lastName} ({u.email || `ID: ${u.id}`})
                                    </option>
                                ))}
                            </select>
                            {loadingUsers && <p className="text-xs text-gray-400 mt-1">Loading users...</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Incident Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="REPORTED">Reported</option>
                                    <option value="ASSIGNED">Assigned</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                </select>
                            </div>

                            {/* Ward Number */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ward Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="wardNumber"
                                    value={formData.wardNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Municipality */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Municipality</label>
                                <input
                                    type="text"
                                    name="municipality"
                                    value={formData.municipality}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Suburb */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Suburb</label>
                                <input
                                    type="text"
                                    name="suburb"
                                    value={formData.suburb}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Street Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Street Name</label>
                                <input
                                    type="text"
                                    name="streetName"
                                    value={formData.streetName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Province */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Province</label>
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Photo URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Photo URL</label>
                                <input
                                    type="text"
                                    name="photoUrl"
                                    value={formData.photoUrl}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description & Details <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            ></textarea>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/reports")}
                                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow transition disabled:opacity-50"
                            >
                                <Save size={18} /> {submitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}