import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function TechnicianManagement() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form fields mapped precisely to AuthPortal registration payload structure
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "Technician Address",
        specialty: "",
        availabilityStatus: "AVAILABLE"
    });

    const token = localStorage.getItem("token");
    const api = axios.create({
        baseURL: "http://localhost:8081",
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        loadTechnicians();
    }, []);

    const loadTechnicians = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/technicians");
            setTechnicians(response.data.data ?? response.data);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load technicians");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditMode(false);
        setCurrentId(null);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phoneNumber: "",
            address: "Technician Address",
            specialty: "",
            availabilityStatus: "AVAILABLE"
        });
        setShowModal(true);
    };

    const handleOpenEdit = (tech) => {
        setEditMode(true);
        setCurrentId(tech.id);
        const nameParts = (tech.name || tech.fullName || "").split(" ");
        setFormData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: tech.email || "",
            password: "",
            phoneNumber: tech.phone || "",
            address: "Technician Address",
            specialty: tech.specialty || "",
            availabilityStatus: tech.availabilityStatus || "AVAILABLE"
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();

            if (editMode) {
                const updatePayload = {
                    name: fullName,
                    email: formData.email,
                    phone: formData.phoneNumber,
                    specialty: formData.specialty,
                    availabilityStatus: formData.availabilityStatus
                };
                await api.put(`/api/technicians/${currentId}`, updatePayload);
                setMessage("Technician updated successfully");
            } else {
                // Step 1: Register the user account (matches AuthPortal implementation)
                const registerPayload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address
                };

                await api.post("http://localhost:8081/api/auth/register", registerPayload, {
                    headers: { 'Content-Type': 'application/json' }
                });

                setMessage("User registered successfully. Waiting for database sync to retrieve latest record...");

                // Step 2: Wait 15 seconds to allow DB auto-increment ID generation
                await new Promise((resolve) => setTimeout(resolve, 15000));

                // Step 3: Fetch all users, sort/find the last record (highest ID) in the database
                let newUserId = null;
                try {
                    const usersResponse = await api.get("/api/users");
                    const allUsers = usersResponse.data.data ?? usersResponse.data;

                    if (Array.isArray(allUsers) && allUsers.length > 0) {
                        // Sort by ID descending to get the last record inserted into the database
                        const sortedUsers = [...allUsers].sort((a, b) => b.id - a.id);
                        const latestUser = sortedUsers[0];
                        newUserId = latestUser?.id;
                    }
                } catch (err) {
                    console.warn("Could not fetch users list to determine the last record:", err);
                }

                if (!newUserId) {
                    throw new Error("User was registered, but could not determine the last record's ID from the database.");
                }

                // Step 4: Assign Role 3 to the latest user ID (updating role_id in user_roles join table)
                try {
                    await api.post(`/api/users/${newUserId}/roles`, { roleId: 3 });
                } catch (roleError) {
                    console.warn("Role assignment notice:", roleError);
                }

                // Step 5: Create the technician profile linked to the latest user ID
                const technicianPayload = {
                    name: fullName,
                    email: formData.email,
                    phone: formData.phoneNumber,
                    specialty: formData.specialty,
                    userId: newUserId,
                    availabilityStatus: formData.availabilityStatus
                };

                await api.post("/api/technicians", technicianPayload);
                setMessage("Last database record retrieved, role 3 assigned, and technician profile created successfully!");
            }

            setShowModal(false);
            loadTechnicians();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this technician?")) return;
        try {
            await api.delete(`/api/technicians/${id}`);
            setMessage("Technician deleted successfully");
            loadTechnicians();
        } catch (error) {
            console.error(error);
            alert("Failed to delete technician");
        }
    };

    const toggleAvailability = async (tech) => {
        const nextStatus = tech.availabilityStatus === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
        try {
            await api.patch(`/api/technicians/${tech.id}/availability?status=${nextStatus}`);
            loadTechnicians();
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar user={user} />
            <div className="flex-1 flex flex-col">
                <TopNavbar user={user} />
                <main className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Technician Management</h1>
                            <p className="text-gray-600">Register and manage field technicians.</p>
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow"
                        >
                            + Add Technician
                        </button>
                    </div>

                    {message && (
                        <div className="p-4 bg-green-100 text-green-700 rounded-md">
                            {message}
                        </div>
                    )}

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-6">Loading technicians...</td></tr>
                            ) : technicians.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-6 text-gray-500">No technicians found.</td></tr>
                            ) : (
                                technicians.map((tech) => (
                                    <tr key={tech.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{tech.name || tech.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{tech.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{tech.phone || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{tech.specialty || "General"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleAvailability(tech)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    tech.availabilityStatus === "AVAILABLE"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {tech.availabilityStatus}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                            <button onClick={() => handleOpenEdit(tech)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                                            <button onClick={() => handleDelete(tech.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Technician" : "Register New Technician"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {!editMode && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 mb-2">
                                    Creating this technician will register a user account, retrieve the last database entry, and assign the <strong>Technician Role (3)</strong> sequentially.
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded p-2 mt-1"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded p-2 mt-1"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address (Login Username)</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border rounded p-2 mt-1"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {!editMode && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Account Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full border rounded p-2 mt-1"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Set temporary password"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full border rounded p-2 mt-1"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="+27123456789"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Specialty</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2 mt-1"
                                    value={formData.specialty}
                                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                    placeholder="e.g. Pipe Repairs"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save Technician
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}