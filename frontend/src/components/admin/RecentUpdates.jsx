import React from "react";
import {
    Clock,
    UserPlus,
    CheckCircle,
    AlertTriangle,
    Wrench
} from "lucide-react";

export default function RecentUpdates({ updates = [], loading }) {

    const getIcon = (type) => {

        switch (type) {

            case "ASSIGNED":
                return <UserPlus className="text-blue-600" size={20} />;

            case "RESOLVED":
                return <CheckCircle className="text-green-600" size={20} />;

            case "IN_PROGRESS":
                return <Wrench className="text-orange-500" size={20} />;

            default:
                return <AlertTriangle className="text-red-600" size={20} />;
        }

    };

    if (loading) {

        return (

            <div className="bg-white rounded-xl shadow-md p-6">

                <h2 className="text-xl font-bold mb-6">

                    Recent Activity

                </h2>

                <p className="text-gray-500">

                    Loading updates...

                </p>

            </div>

        );

    }

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-xl font-bold text-gray-700 mb-6">

                Recent Activity

            </h2>

            {updates.length === 0 && (

                <p className="text-gray-500">

                    No recent activity.

                </p>

            )}

            <div className="space-y-5">

                {updates.map((update) => (

                    <div
                        key={update.id}
                        className="flex items-start gap-4 border-b pb-4"
                    >

                        <div className="mt-1">

                            {getIcon(update.type)}

                        </div>

                        <div className="flex-1">

                            <h4 className="font-semibold">

                                {update.title}

                            </h4>

                            <p className="text-gray-600 text-sm mt-1">

                                {update.description}

                            </p>

                            <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">

                                <Clock size={14} />

                                {update.time}

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}