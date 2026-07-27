import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle, Send, ArrowLeft, Upload, X } from "lucide-react";

export default function CreateReport() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        photoUrl: "", // Stores image data or URL
        priority: "HIGH",
        status: "REPORTED",
        streetName: "",
        suburb: "",
        wardNumber: "",
        municipality: "",
        province: "",
        categoryId: ""
    });

    const token = localStorage.getItem("token");
    const residentId = localStorage.getItem("userId");

    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/api/categories");
                const data = response.data.data ?? response.data?.content ?? response.data;
                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load categories:", err);
                setCategories([
                    { id: 1, name: "Burst Pipe" },
                    { id: 2, name: "No Water Supply" },
                    { id: 3, name: "Low Water Pressure" },
                    { id: 4, name: "Water Leakage" }
                ]);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle optional image file upload and convert to base64 preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Optional: limit file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, photoUrl: reader.result }));
            setImagePreview(reader.result);
            setError("");
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, photoUrl: "" }));
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!residentId) {
            setError("User session ID not found. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            await api.post("/api/reports", {
                title: formData.title,
                description: formData.description,
                photoUrl: formData.photoUrl || null, // Optional image field
                priority: formData.priority,
                status: formData.status,
                streetName: formData.streetName,
                suburb: formData.suburb,
                wardNumber: formData.wardNumber,
                municipality: formData.municipality,
                province: formData.province,
                residentId: Number(residentId),
                categoryId: formData.categoryId ? Number(formData.categoryId) : null
            });
            navigate("/resident");
        } catch (err) {
            console.error("Failed to submit report:", err);
            setError(err.response?.data?.message || "Failed to submit report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Report a Water Issue</h2>
                    <p className="text-sm text-gray-500 mt-1">Provide complete details about the water outage or leak in your area.</p>
                </div>
                <button
                    onClick={() => navigate("/resident")}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-950 font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title *</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Burst Pipe on Main Street"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select
                            name="categoryId"
                            required
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level *</label>
                        <select
                            name="priority"
                            required
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Name *</label>
                        <input
                            type="text"
                            name="streetName"
                            required
                            value={formData.streetName}
                            onChange={handleChange}
                            placeholder="e.g., Main Street"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Suburb *</label>
                        <input
                            type="text"
                            name="suburb"
                            required
                            value={formData.suburb}
                            onChange={handleChange}
                            placeholder="e.g., Soweto"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number *</label>
                        <input
                            type="text"
                            name="wardNumber"
                            required
                            value={formData.wardNumber}
                            onChange={handleChange}
                            placeholder="e.g., 12"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Municipality *</label>
                        <input
                            type="text"
                            name="municipality"
                            required
                            value={formData.municipality}
                            onChange={handleChange}
                            placeholder="e.g., City of PTA"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                        <input
                            type="text"
                            name="province"
                            required
                            value={formData.province}
                            onChange={handleChange}
                            placeholder="e.g., Gauteng"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Optional Image Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo (Optional)</label>
                    {!imagePreview ? (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 bg-gray-50 transition">
                            <Upload className="text-gray-400 mb-2" size={24} />
                            <span className="text-sm font-medium text-gray-600">Click to upload image</span>
                            <span className="text-xs text-gray-400 mt-1">PNG, JPG, or WEBP (max 5MB)</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        <div className="relative inline-block mt-2">
                            <img
                                src={imagePreview}
                                alt="Upload Preview"
                                className="h-32 w-auto rounded-lg border shadow-sm object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition"
                                title="Remove image"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description *</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the leak, flow rate, or extent of the outage..."
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => navigate("/resident")}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-sm transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md transition disabled:opacity-50"
                    >
                        <Send size={16} /> {loading ? "Submitting..." : "Submit Report"}
                    </button>
                </div>
            </form>
        </div>
    );
}