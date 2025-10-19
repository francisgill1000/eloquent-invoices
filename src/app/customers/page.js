"use client";

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Import necessary icons from Lucide React
import {
    Search,
    SlidersHorizontal,
    Home,
    FileText,
    Users,
    Settings,
    Plus,
    Mail,
    MoreVertical, // New icon for the "More Options" menu
} from 'lucide-react';

// Placeholder data for the client list
const clients = [
    { id: 1, name: "Innovate LLC", email: "contact@innovatellc.com", totalInvoices: 5, overdue: true, profileInitial: 'I' },
    { id: 2, name: "Quantum Solutions", email: "info@quantumsol.net", totalInvoices: 8, overdue: true, profileInitial: 'Q' },
    { id: 3, name: "Acme Corp", email: "support@acmecorp.co", totalInvoices: 12, overdue: false, profileInitial: 'A' },
    { id: 4, name: "Beta Systems", email: "hello@betasys.io", totalInvoices: 3, overdue: false, profileInitial: 'B' },
    { id: 5, name: "Apex Enterprises", email: "billing@apexent.org", totalInvoices: 6, overdue: false, profileInitial: 'A' },
    { id: 6, name: "Global Tech", email: "help@globaltech.com", totalInvoices: 10, overdue: false, profileInitial: 'G' },
];

export default function ClientList() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
        console.log("Toggle filter options. Current state:", !isFilterOpen);
    };

    // Placeholder function for the new menu action
    const handleMoreOptions = (e, clientId) => {
        // Prevents the Link from navigating when the button is clicked
        e.preventDefault();
        e.stopPropagation();
        console.log(`Open options menu for client ID: ${clientId}`);
        // Implement logic to show a dropdown or modal here
    };

    return (
        <main className="flex-grow">
            {/* Header Title Section (omitted for brevity) */}

            <section className="px-4 pt-5 pb-5">
                <div className="flex items-center justify-between"> {/* Flex container for title and button */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Clients</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1"> create and manage customers </p>
                    </div>
                    <Link
                        href="/customers/create" // The path to your new screen
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
                        aria-label="Create new client"
                    >
                        <Plus className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            {/* Search and Filter Section (omitted for brevity) */}
            <section className="px-4">
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <Input
                            className="w-full h-12 rounded-full border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
                            placeholder="Search by name, email..."
                            type="text"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        </div>
                    </div>
                    <button
                        onClick={toggleFilter}
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${isFilterOpen
                            ? 'bg-primary text-white dark:bg-primary'
                            : 'bg-white text-slate-500 shadow-sm border border-slate-200 dark:bg-card-dark dark:text-slate-400 dark:border-slate-700'
                            }`}
                        aria-expanded={isFilterOpen}
                        aria-controls="filter-options"
                    >
                        <SlidersHorizontal className="h-6 w-6" />
                    </button>
                </div>
                {/* Filter Options (omitted for brevity) */}
                <div
                    id="filter-options"
                    className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="space-y-3 rounded-xl bg-white p-4 shadow dark:bg-slate-800">
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
                </div>
            </section>

            {/* Client List Section - UPDATED CARD STRUCTURE */}
            <section className="px-4 pb-20">
                <div className="space-y-3">
                    {clients.map((client) => (
                        <Link
                            href={`/clients/${client.id}`}
                            key={client.id}
                            className="block rounded-xl bg-white p-4 border border-slate-200 transition-shadow hover:shadow-md dark:bg-slate-800 dark:border-slate-700 relative" // Added 'relative'
                        >
                            {/* New: More Options Button (Top Right)
                  Uses absolute positioning within the 'relative' Link wrapper.
                  The onClick handler stops propagation to prevent triggering the Link navigation.
                */}
                            <button
                                onClick={(e) => handleMoreOptions(e, client.id)}
                                className="absolute top-2 right-0 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 z-10 text-slate-500 dark:text-slate-400"
                                aria-label={`More options for ${client.name}`}
                            >
                                <MoreVertical className="h-5 w-5" />
                            </button>


                            {/* Main Content Row */}
                            <div className="flex items-center gap-4 pt-2 pb-1 pr-10"> {/* Added pr-10 to make room for the absolute button */}

                                {/* Avatar/Initial */}
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${client.overdue ? 'bg-red-500' : 'bg-primary'}`}>
                                    {client.profileInitial}
                                </div>

                                {/* Client Details (Name & Email) */}
                                <div className="flex-grow">
                                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                                        {client.name}
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                        <Mail className="h-4 w-4" />
                                        <p className="truncate">{client.email}</p>
                                    </div>
                                </div>

                                {/* Invoice Summary (Overdue status & count) */}
                                <div className="flex shrink-0 flex-col items-end text-right">
                                    <p className={`text-sm font-semibold ${client.overdue ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {client.overdue ? 'Overdue!' : 'Current'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {client.totalInvoices} Invoices
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}

                </div>
            </section>
        </main>
    );
}