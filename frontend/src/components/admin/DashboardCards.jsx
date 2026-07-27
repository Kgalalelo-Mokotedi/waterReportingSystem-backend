import React from "react";
import {
    ClipboardList,
    Clock3,
    Wrench,
    CheckCircle2,
    UserCheck,
    Users
} from "lucide-react";

export default function DashboardCards({ stats }) {

    const cards = [

        {
            title: "Total Reports",
            value: stats?.totalReports || 0,
            subtitle: "All reported incidents",
            icon: ClipboardList,
            color: "bg-blue-600"
        },

        {
            title: "Pending Reports",
            value: stats?.pendingReports || 0,
            subtitle: "Awaiting assignment",
            icon: Clock3,
            color: "bg-yellow-500"
        },

        {
            title: "In Progress",
            value: stats?.inProgressReports || 0,
            subtitle: "Technicians on site",
            icon: Wrench,
            color: "bg-orange-500"
        },

        {
            title: "Resolved Reports",
            value: stats?.resolvedReports || 0,
            subtitle: "Completed incidents",
            icon: CheckCircle2,
            color: "bg-green-600"
        },

        {
            title: "Available Technicians",
            value: stats?.availableTechnicians || 0,
            subtitle: "Ready for dispatch",
            icon: UserCheck,
            color: "bg-purple-600"
        },

        {
            title: "Assigned Technicians",
            value: stats?.assignedTechnicians || 0,
            subtitle: "Currently working",
            icon: Users,
            color: "bg-cyan-600"
        }

    ];

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {cards.map((card, index) => {

                const Icon = card.icon;

                return (

                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6"
                    >

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-gray-500 text-sm">

                                    {card.title}

                                </p>

                                <h2 className="text-4xl font-bold mt-2 text-gray-800">

                                    {card.value}

                                </h2>

                                <p className="text-gray-400 text-sm mt-2">

                                    {card.subtitle}

                                </p>

                            </div>

                            <div
                                className={`${card.color}
                                w-16
                                h-16
                                rounded-full
                                flex
                                items-center
                                justify-center
                                shadow-lg`}
                            >

                                <Icon
                                    size={32}
                                    className="text-white"
                                />

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}