import React from "react";
import {
    Eye,
    UserPlus,
    CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReportsTable({
                                         reports,
                                         loading,
                                         onView,
                                         onAssign,
                                         onStatus
                                     }) {

    const navigate = useNavigate();

    // Fallback lookup map matching your issue_categories database table
    const categoryMap = {
        1: "Water Leakage",
        2: "Burst",
        3: "Renew Water Meter"
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 mt-8">
                <h2 className="text-xl font-bold mb-6">
                    Recent Reports
                </h2>
                <div className="text-center text-gray-500">
                    Loading reports...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md mt-8">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold">
                    Recent Reports
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-5 py-4 text-left">Reference</th>
                        <th className="px-5 py-4 text-left">Resident</th>
                        <th className="px-5 py-4 text-left">Category</th>
                        <th className="px-5 py-4 text-left">Municipality</th>
                        <th className="px-5 py-4 text-left">Priority</th>
                        <th className="px-5 py-4 text-left">Status</th>
                        <th className="px-5 py-4 text-left">Technician</th>
                        <th className="px-5 py-4 text-left">Date</th>
                        <th className="px-5 py-4 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports.length === 0 && (
                        <tr>
                            <td
                                colSpan="9"
                                className="text-center py-10 text-gray-500"
                            >
                                No reports found.
                            </td>
                        </tr>
                    )}

                    {reports.map((report) => {
                        // Resolve category name safely across different possible data shapes/IDs
                        const catId = report.categoryId || report.category_id || report.category?.id;
                        const resolvedCategoryName =
                            report.categoryName ||
                            report.category?.name ||
                            categoryMap[catId] ||
                            (typeof report.category === 'string' ? report.category : null) ||
                            "General";

                        return (
                            <tr
                                key={report.id}
                                className="border-b hover:bg-gray-50 text-sm"
                            >
                                <td className="px-5 py-4 font-medium text-gray-800">
                                    {report.referenceNumber || `#RPT-${report.id}`}
                                </td>

                                <td className="px-5 py-4 text-gray-700">
                                    {report.residentName || "Resident"}
                                </td>

                                <td className="px-5 py-4 text-gray-700 font-medium">
                                    {resolvedCategoryName}
                                </td>

                                <td className="px-5 py-4 text-gray-600">
                                    {report.municipality || "-"}
                                </td>

                                <td className="px-5 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-white text-xs font-semibold
                                            ${
                                                report.priority === "HIGH" || report.priority === "CRITICAL"
                                                    ? "bg-red-600"
                                                    : report.priority === "MEDIUM"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-600"
                                            }`}
                                        >
                                            {report.priority || "LOW"}
                                        </span>
                                </td>

                                <td className="px-5 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {report.status || "REPORTED"}
                                        </span>
                                </td>

                                <td className="px-5 py-4 text-gray-600">
                                    {report.technicianName || "-"}
                                </td>

                                <td className="px-5 py-4 text-gray-500">
                                    {report.reportedDate || report.createdAt ? new Date(report.reportedDate || report.createdAt).toLocaleDateString() : "-"}
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/reports/${report.id}`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                                            title="View Report"
                                        >
                                            <Eye size={18}/>
                                        </button>

                                        <button
                                            onClick={() => onAssign(report)}
                                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded transition"
                                            title="Assign Technician"
                                        >
                                            <UserPlus size={18}/>
                                        </button>

                                        <button
                                            onClick={() => onStatus(report)}
                                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition"
                                            title="Update Status"
                                        >
                                            <CheckCircle size={18}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}