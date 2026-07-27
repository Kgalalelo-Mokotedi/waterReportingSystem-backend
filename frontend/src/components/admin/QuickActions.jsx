import React from "react";
import {
    ClipboardList,
    UserPlus,
    Users,
    Tags,
    BarChart3,
    PlusCircle
} from "lucide-react";

export default function QuickActions({

                                         onManageReports,
                                         onAssignTechnician,
                                         onManageTechnicians,
                                         onManageCategories,
                                         onStatistics,
                                         onNewReport

                                     }) {

    const actions = [

        {
            title: "Manage Reports",
            description: "View and update reported incidents",
            icon: ClipboardList,
            color: "bg-blue-600",
            action: onManageReports
        },

        {
            title: "Assign Technician",
            description: "Assign technicians to incidents",
            icon: UserPlus,
            color: "bg-orange-500",
            action: onAssignTechnician
        },

        {
            title: "Manage Technicians",
            description: "Add, edit and remove technicians",
            icon: Users,
            color: "bg-green-600",
            action: onManageTechnicians
        },

        {
            title: "Categories",
            description: "Manage water outage categories",
            icon: Tags,
            color: "bg-purple-600",
            action: onManageCategories
        },

        {
            title: "Statistics",
            description: "View municipality analytics",
            icon: BarChart3,
            color: "bg-cyan-600",
            action: onStatistics
        },

        {
            title: "Create Report",
            description: "Capture a new outage report",
            icon: PlusCircle,
            color: "bg-red-600",
            action: onNewReport
        }

    ];

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-xl font-bold text-gray-700 mb-6">

                Quick Actions

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {actions.map((item, index) => {

                    const Icon = item.icon;

                    return (

                        <button

                            key={index}

                            onClick={item.action}

                            className="border rounded-xl p-5 hover:shadow-lg hover:scale-105 transition text-left"

                        >

                            <div className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center mb-4`}>

                                <Icon
                                    size={28}
                                    className="text-white"
                                />

                            </div>

                            <h3 className="font-bold text-lg">

                                {item.title}

                            </h3>

                            <p className="text-gray-500 mt-2">

                                {item.description}

                            </p>

                        </button>

                    );

                })}

            </div>

        </div>

    );

}