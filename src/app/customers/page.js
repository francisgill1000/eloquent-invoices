"use client";

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

import {
    Search,
    SlidersHorizontal,
    Plus,
    Phone,
    ChevronDown,
    ChevronUp,
    Mail,
    FileText,
    CalculatorIcon,
    PhoneCall,
    PhoneCallIcon,
} from 'lucide-react';

export default function ClientList() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [records, setRecords] = useState([]);
    const [expandedId, setExpandedId] = useState(null); // 🔹 Track expanded client

    const [search, setSearch] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState(search);


    const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // 🕒 Debounce logic
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500); // wait 500ms after typing stops

        return () => clearTimeout(timeout);
    }, [search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };


    useEffect(() => {

        const fetchRecords = async () => {

            let config = {
                params: {
                    status: status,
                    search: debouncedSearch,
                }
            };

            let res = await axios.get("customers", config);

            setRecords(res.data.data);

            console.log("🚀 ~ fetchRecords ~ res.data.data:", res.data.data)
        };
        fetchRecords();
    }, [debouncedSearch]);

    return (
        <main className="flex-grow">
            {/* Header */}
            <section className="px-4 pt-5 pb-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Clients</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Create and manage customers
                        </p>
                    </div>
                    <Link
                        href="/customers/create"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
                        aria-label="Create new client"
                    >
                        <Plus className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            {/* Search + Filter */}
            <section className="px-4">
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <Input
                            className="w-full h-12 rounded-full border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
                            placeholder="Search by customer..."
                            type="text"
                            value={search || ''}
                            onChange={handleSearch}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        </div>
                    </div>

                    {/* <button
                        onClick={toggleFilter}
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${isFilterOpen
                            ? 'bg-primary text-white dark:bg-primary'
                            : 'bg-white text-slate-500 shadow-sm border border-slate-200 dark:bg-card-dark dark:text-slate-400 dark:border-slate-700'
                            }`}
                        aria-expanded={isFilterOpen}
                    >
                        <SlidersHorizontal className="h-6 w-6" />
                    </button> */}
                </div>

                {isFilterOpen && (
                    <div className="mt-4 space-y-3 rounded-xl bg-white p-4 shadow dark:bg-slate-800 transition-all duration-300">
                        <h3 className="font-semibold text-slate-800 dark:text-white">Sort & Filter</h3>
                        <div className="flex flex-wrap gap-2">
                            <button className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-white shadow-sm">
                                Name (A-Z)
                            </button>
                            <button className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                Overdue Only
                            </button>
                            <button className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                Total Invoices
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Client List */}
            <section className="px-4 pb-20 pt-5">
                <div className="space-y-3">
                    {records.map((client) => (
                        <div
                            key={client.id}
                            className="block rounded-xl bg-white p-4 border border-slate-200 transition-shadow hover:shadow-md dark:bg-slate-800 dark:border-slate-700 relative"
                        >
                            <button
                                onClick={() => toggleExpand(client.id)}
                                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 z-10 text-slate-500 dark:text-slate-400"
                                aria-label={`Toggle details for ${client.name}`}
                            >
                                {expandedId === client.id ? (
                                    <ChevronUp className="h-5 w-5" />
                                ) : (
                                    <ChevronDown className="h-5 w-5" />
                                )}
                            </button>

                            {/* Main Info */}
                            <div
                                className="flex items-center gap-4 pt-2 pb-1 pr-10 cursor-pointer"
                                onClick={() => toggleExpand(client.id)}
                            >
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${client.overdue ? 'bg-red-500' : 'bg-primary'
                                        }`}
                                >
                                    {client.name.charAt(0)}
                                </div>

                                <div className="flex-grow">
                                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                                        {client.name}
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">

                                        Total Invoices: <b>{client.invoices_count || 0}</b>
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Section */}
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedId === client.id
                                    ? 'max-h-60 opacity-100 mt-3'
                                    : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3 text-sm">
                                    {/* Email */}
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <Mail className="h-4 w-4 text-primary/70" />
                                        <span>{client.email || <span className="italic text-slate-400">No email provided</span>}</span>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <PhoneCallIcon className="h-4 w-4 text-primary/70" />
                                        <span>{client.phone || <span className="italic text-slate-400">No phone provided</span>}</span>
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <Phone className="h-4 w-4 text-primary/70" />
                                        <span>{client.whatsapp || <span className="italic text-slate-400">No WhatsApp provided</span>}</span>
                                    </div>

                                    {/* Total Invoices */}
                                    <div className="flex border-t border-slate-200 items-center justify-between text-slate-700 dark:text-slate-300  dark:bg-slate-700/40 p-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary/70" />
                                            <span>Total Invoices Amount</span>
                                        </div>
                                        <span className="font-semibold text-primary">
                                            {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(client.invoices_sum_total || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
