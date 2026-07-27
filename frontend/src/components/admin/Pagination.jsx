import React from "react";
import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";

export default function Pagination({

                                       currentPage,
                                       totalPages,
                                       totalElements,
                                       pageSize,
                                       onPageChange

                                   }) {

    if (totalPages <= 1) return null;

    return (

        <div className="bg-white rounded-xl shadow-md mt-6 px-6 py-4">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="text-sm text-gray-600">

                    Showing page

                    <span className="font-bold mx-2">

                        {currentPage + 1}

                    </span>

                    of

                    <span className="font-bold mx-2">

                        {totalPages}

                    </span>

                    ({totalElements} reports)

                </div>

                <div className="flex items-center gap-2">

                    <button

                        disabled={currentPage === 0}

                        onClick={() => onPageChange(currentPage - 1)}

                        className={`

                            flex items-center gap-2

                            px-4 py-2 rounded-lg

                            ${
                            currentPage === 0
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        }

                        `}

                    >

                        <ChevronLeft size={18}/>

                        Previous

                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (

                        <button

                            key={index}

                            onClick={() => onPageChange(index)}

                            className={`

                                w-10 h-10 rounded-lg

                                ${
                                currentPage === index

                                    ? "bg-blue-600 text-white"

                                    : "bg-gray-200 hover:bg-gray-300"

                            }

                            `}

                        >

                            {index + 1}

                        </button>

                    ))}

                    <button

                        disabled={currentPage === totalPages - 1}

                        onClick={() => onPageChange(currentPage + 1)}

                        className={`

                            flex items-center gap-2

                            px-4 py-2 rounded-lg

                            ${
                            currentPage === totalPages - 1

                                ? "bg-gray-200 cursor-not-allowed"

                                : "bg-blue-600 hover:bg-blue-700 text-white"

                        }

                        `}

                    >

                        Next

                        <ChevronRight size={18}/>

                    </button>

                </div>

            </div>

        </div>

    );

}