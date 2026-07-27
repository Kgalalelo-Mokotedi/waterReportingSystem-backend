import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function CategoriesManagement() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get("/api/categories");
            setCategories(response.data.data ?? response.data);
        } catch (error) {
            console.error(error);
            setMessage("Failed to fetch issue categories");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name,
                description,
                active: true
            };
            if (editId) {
                await api.put(`/api/categories/${editId}`, payload);
                setMessage("Category updated successfully");
            } else {
                await api.post("/api/categories", payload);
                setMessage("Category created successfully");
            }
            setName("");
            setDescription("");
            setEditId(null);
            loadCategories();
        } catch (error) {
            console.error("Full error response:", error.response?.data);
            const errorMsg = error.response?.data?.message || error.message;
            alert(`Operation failed: ${errorMsg}`);
        }
    };

    const handleEdit = (cat) => {
        setEditId(cat.id);
        setName(cat.name);
        setDescription(cat.description || "");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/api/categories/${id}`);
            loadCategories();
        } catch (error) {
            console.error(error);
            alert("Failed to delete category");
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar user={user} />
            <div className="flex-1 flex flex-col">
                <TopNavbar user={user} />
                <main className="p-8 space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800">Issue Categories Management</h1>

                    {message && <div className="p-3 bg-green-100 text-green-700 rounded">{message}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Form Column */}
                        <div className="bg-white p-6 shadow rounded-lg h-fit">
                            <h2 className="text-xl font-semibold mb-4">{editId ? "Edit Category" : "Add New Category"}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded p-2 mt-1"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Pipe Leak"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        className="w-full border rounded p-2 mt-1"
                                        rows="3"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Details..."
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                        {editId ? "Update" : "Create"}
                                    </button>
                                    {editId && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditId(null); setName(""); setDescription(""); }}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Table Column */}
                        <div className="md:col-span-2 bg-white shadow rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {categories.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center py-6 text-gray-500">No categories found.</td></tr>
                                ) : (
                                    categories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{cat.description || "N/A"}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(cat)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}