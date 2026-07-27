import React from "react";
import {
    Search,
    RotateCcw,
    Download
} from "lucide-react";

export default function SearchFilters({

                                          search,
                                          setSearch,

                                          status,
                                          setStatus,

                                          priority,
                                          setPriority,

                                          category,
                                          setCategory,

                                          municipality,
                                          setMunicipality,

                                          suburb,
                                          setSuburb,

                                          categories,

                                          onReset,
                                          onExport

                                      }) {

    return (

        <div className="bg-white rounded-xl shadow-md p-6 mt-8">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-xl font-bold text-gray-700">

                    Search & Filters

                </h2>

                <div className="flex gap-3">

                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                    >
                        <RotateCcw size={18}/>
                        Reset
                    </button>

                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                    >
                        <Download size={18}/>
                        Export
                    </button>

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

                {/* Search */}

                <div>

                    <label className="block text-sm mb-2 font-semibold">

                        Search

                    </label>

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Title..."
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                            className="pl-10 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                </div>

                {/* Status */}

                <div>

                    <label className="block text-sm mb-2 font-semibold">

                        Status

                    </label>

                    <select
                        value={status}
                        onChange={(e)=>setStatus(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    >

                        <option value="">All</option>

                        <option>REPORTED</option>

                        <option>ASSIGNED</option>

                        <option>IN_PROGRESS</option>

                        <option>RESOLVED</option>

                    </select>

                </div>

                {/* Priority */}

                <div>

                    <label className="block text-sm mb-2 font-semibold">

                        Priority

                    </label>

                    <select
                        value={priority}
                        onChange={(e)=>setPriority(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    >

                        <option value="">All</option>

                        <option>LOW</option>

                        <option>MEDIUM</option>

                        <option>HIGH</option>

                        <option>CRITICAL</option>

                    </select>

                </div>

                {/* Category */}

                <div>

                    <label className="block text-sm mb-2 font-semibold">

                        Category

                    </label>

                    <select
                        value={category}
                        onChange={(e)=>setCategory(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    >

                        <option value="">All</option>

                        {categories.map(cat=>(

                            <option
                                key={cat.id}
                                value={cat.name}
                            >

                                {cat.name}

                            </option>

                        ))}

                    </select>

                </div>

                {/* Municipality */}

                <div>

                    <label className="block text-sm mb-2 font-semibold">

                        Municipality

                    </label>

                    <input
                        value={municipality}
                        onChange={(e)=>setMunicipality(e.target.value)}
                        placeholder="Municipality"
                        className="w-full border rounded-lg px-4 py-2"
                    />

                </div>

                {/* Suburb */}

                <div>

                    <label className="block text-sm mb-2 font-semibold">

                        Suburb

                    </label>

                    <input
                        value={suburb}
                        onChange={(e)=>setSuburb(e.target.value)}
                        placeholder="Suburb"
                        className="w-full border rounded-lg px-4 py-2"
                    />

                </div>

            </div>

        </div>

    );

}