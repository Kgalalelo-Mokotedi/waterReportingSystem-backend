import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

export default function CreateAdminReport() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        residentId: "",
        title: "",
        description: "",
        categoryId: "",
        priority: "MEDIUM",
        municipality: "",
        suburb: "",
        streetName: "",
        wardNumber: "",
        province: "Gauteng",
        photoUrl: "",
        status: "REPORTED"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, categoriesRes] = await Promise.all([
                    api.get("/api/users").catch(() => api.get("/api/auth/users")),
                    api.get("/api/categories").catch(() => ({ data: [] }))
                ]);

                const userData = usersRes.data.data ?? usersRes.data?.content ?? usersRes.data;
                const catData = categoriesRes.data.data ?? categoriesRes.data?.content ?? categoriesRes.data;

                setUsers(Array.isArray(userData) ? userData : []);
                setCategories(Array.isArray(catData) ? catData : []);
            } catch (err) {
                console.error("Failed to fetch initial form data:", err);
                setError("Could not load users or categories from the database.");
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.residentId) {
            setError("Resident ID is required. Please select a registered resident.");
            return;
        }

        if (!formData.wardNumber) {
            setError("Ward number is required.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            // Explicitly map formData.residentId to both residentId and resident_id
            // to ensure backend compatibility regardless of expected naming convention.
            const payload = {
                ...formData,
                residentId: Number(formData.residentId),
                resident_id: Number(formData.residentId),
                status: "REPORTED"
            };

            await api.post("/api/reports", payload);
            navigate("/admin/reports");
        } catch (err) {
            console.error("Failed to submit report:", err);
            setError(err.response?.data?.message || "Failed to submit report. Please check all fields.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation Bar */}
            <TopNavbar />

            <div className="flex flex-1">
                {/* Sidebar Component */}
                <Sidebar />

                {/* Main Content Form Area */}
                <main className="flex-1 p-8 max-w-4xl mx-auto space-y-6 pb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/admin/reports")}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-lg border shadow-sm transition"
                        >
                            <ArrowLeft size={18} /> Back to Reports
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Report Incident on Behalf of User</h1>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6 border border-gray-100">
                        {/* Select Resident Dropdown mapping u.id to residentId */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Registered Resident <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="residentId"
                                value={formData.residentId}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">-- Choose a registered user by name --</option>
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
                                    placeholder="e.g. Burst Water Pipe"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    placeholder="e.g. 12"
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
                                    placeholder="e.g. City of PTA"
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
                                    placeholder="e.g. Kempton Park"
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
                                    placeholder="e.g. Main Street"
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
                                    placeholder="e.g. Gauteng"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Photo URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Photo URL (Optional)</label>
                                <input
                                    type="text"
                                    name="photoUrl"
                                    value={formData.photoUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Provide details about the municipal incident..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            ></textarea>
                        </div>

                        {/* Submit Action */}
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
                                <Send size={18} /> {submitting ? "Submitting..." : "Submit Incident"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}