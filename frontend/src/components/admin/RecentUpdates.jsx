import React from "react";
import {
    Clock,
    UserPlus,
    CheckCircle,
    AlertTriangle,
    Wrench,
    FileText
} from "lucide-react";

export default function RecentUpdates({ updates = [], reports = [], loading }) {

    const getIcon = (type) => {
        switch (type) {
            case "ASSIGNED":
            case "ASSIGN":
                return <UserPlus className="text-blue-600" size={20} />;
            case "RESOLVED":
            case "CLOSED":
                return <CheckCircle className="text-green-600" size={20} />;
            case "IN_PROGRESS":
                return <Wrench className="text-orange-500" size={20} />;
            case "REPORTED":
            case "PENDING":
                return <FileText className="text-purple-600" size={20} />;
            default:
                return <AlertTriangle className="text-red-600" size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                <p className="text-gray-500">Loading updates...</p>
            </div>
        );
    }

    // Fallback: If dedicated updates list is empty, derive recent activities from the loaded reports array
    const displayUpdates = updates && updates.length > 0
        ? updates
        : (reports || []).slice(0, 5).map(report => ({
            id: report.id,
            type: report.status,
            title: `Report #${report.referenceNumber || report.id} - ${report.municipality || "Municipal Incident"}`,
            description: `Incident status is currently recorded as ${report.status || "REPORTED"}. Priority: ${report.priority || "NORMAL"}.`,
            time: report.createdAt || report.reportedDate || new Date().toISOString()
        }));

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Recent Activity</h2>

            {displayUpdates.length === 0 && (
                <p className="text-gray-500">No recent activity found.</p>
            )}

            <div className="space-y-5">
                {displayUpdates.map((update, index) => {
                    const rawDate = update.createdAt || update.timestamp || update.time;
                    const formattedTime = rawDate ? new Date(rawDate).toLocaleString() : "Recently";

                    return (
                        <div
                            key={update.id || index}
                            className="flex items-start gap-4 border-b pb-4 last:border-none last:pb-0"
                        >
                            <div className="mt-1">
                                {getIcon(update.type || update.status || update.newStatus)}
                            </div>

                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">
                                    {update.title || update.action || `Report Status Update`}
                                </h4>

                                <p className="text-gray-600 text-sm mt-1">
                                    {update.description || update.comment || `Status updated successfully.`}
                                </p>

                                <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                                    <Clock size={14} />
                                    {formattedTime}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}