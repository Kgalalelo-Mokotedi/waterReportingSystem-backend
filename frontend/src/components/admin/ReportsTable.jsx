import React from "react";
import {
    Eye,
    UserPlus,
    CheckCircle
} from "lucide-react";

export default function ReportsTable({

                                         reports,

                                         loading,

                                         onView,

                                         onAssign,

                                         onStatus

                                     }) {

    if (loading) {

        return (

            <div className="bg-white rounded-xl shadow-md p-8 mt-8">

                <h2 className="text-xl font-bold mb-6">

                    Recent Reports

                </h2>

                <div className="text-center">

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

                        <th className="px-5 py-4 text-left">

                            Reference

                        </th>

                        <th className="px-5 py-4 text-left">

                            Resident

                        </th>

                        <th className="px-5 py-4 text-left">

                            Category

                        </th>

                        <th className="px-5 py-4 text-left">

                            Municipality

                        </th>

                        <th className="px-5 py-4 text-left">

                            Priority

                        </th>

                        <th className="px-5 py-4 text-left">

                            Status

                        </th>

                        <th className="px-5 py-4 text-left">

                            Technician

                        </th>

                        <th className="px-5 py-4 text-left">

                            Date

                        </th>

                        <th className="px-5 py-4 text-center">

                            Actions

                        </th>

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

                    {reports.map((report) => (

                        <tr
                            key={report.id}
                            className="border-b hover:bg-gray-50"
                        >

                            <td className="px-5 py-4">

                                {report.referenceNumber}

                            </td>

                            <td className="px-5 py-4">

                                {report.residentName}

                            </td>

                            <td className="px-5 py-4">

                                {report.categoryName}

                            </td>

                            <td className="px-5 py-4">

                                {report.municipality}

                            </td>

                            <td className="px-5 py-4">

                                <span
                                    className={`
                                    px-3 py-1 rounded-full text-white text-sm

                                    ${
                                        report.priority === "HIGH"
                                            ? "bg-red-600"

                                            : report.priority === "MEDIUM"
                                                ? "bg-yellow-500"

                                                : "bg-green-600"
                                    }
                                `}
                                >

                                    {report.priority}

                                </span>

                            </td>

                            <td className="px-5 py-4">

                                {report.status}

                            </td>

                            <td className="px-5 py-4">

                                {report.technicianName || "-"}

                            </td>

                            <td className="px-5 py-4">

                                {report.reportedDate}

                            </td>

                            <td className="px-5 py-4">

                                <div className="flex justify-center gap-2">

                                    <button

                                        onClick={() => onView(report)}

                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"

                                    >

                                        <Eye size={18}/>

                                    </button>

                                    <button

                                        onClick={() => onAssign(report)}

                                        className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded"

                                    >

                                        <UserPlus size={18}/>

                                    </button>

                                    <button

                                        onClick={() => onStatus(report)}

                                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"

                                    >

                                        <CheckCircle size={18}/>

                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}