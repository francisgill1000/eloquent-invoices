"use client";

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

// Import all necessary icons from Lucide React
import {
  Search,
  SlidersHorizontal, // Used SlidersHorizontal for the filter icon
  Home,
  FileText,
  Users,
  Settings,
  ArrowRight,
  Plus,
  // Using the Dollar Sign icon (Currency icon) for better semantic clarity
  DollarSign,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/axios';

// Placeholder data for the invoice list
// const invoices = [
//   { id: 1001, client: "Innovate LLC", amount: 2500.00, status: "Overdue", date: "2024-05-01", statusClass: "text-red-500 bg-red-500/10" },
//   { id: 1002, client: "Quantum Solutions", amount: 1500.00, status: "Overdue", date: "2024-05-05", statusClass: "text-red-500 bg-red-500/10" },
//   { id: 1003, client: "Acme Corp", amount: 800.00, status: "Pending", date: "2024-06-01", statusClass: "text-amber-500 bg-amber-500/10" },
//   { id: 1004, client: "Beta Systems", amount: 1250.00, status: "Pending", date: "2024-06-15", statusClass: "text-amber-500 bg-amber-500/10" },
//   { id: 1005, client: "Apex Enterprises", amount: 920.00, status: "Paid", date: "2024-05-20", statusClass: "text-green-500 bg-green-500/10" },
//   { id: 1006, client: "Global Tech", amount: 3100.00, status: "Paid", date: "2024-04-10", statusClass: "text-green-500 bg-green-500/10" },
//   { id: 1007, client: "Zeta Group", amount: 110.00, status: "Draft", date: "2024-06-20", statusClass: "text-slate-500 bg-slate-500/10" },
// ];

export default function InvoiceList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {

      let res = await axios.get("invoices");

      setInvoices(res.data.data);
      console.log("🚀 ~ fetchInvoices ~ res.data.data:", res.data.data)
    };
    fetchInvoices();
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    console.log("Toggle filter options. Current state:", !isFilterOpen);
  };

  const handleOpenInvoiceLink = (id) => {
    const url = `${API_BASE_URL}/invoices/generate/${id}`;
    window.open(url, '_blank');
  }

  return (
    <main className="flex-grow">
      {/* Header Title Section */}
      <section className="px-4 pt-5 pb-5">
        <div className="flex items-center justify-between"> {/* Flex container for title and button */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Invoice</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1"> create and manage invoice </p>
          </div>
          <Link
            href="/invoices/create" // The path to your new screen
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
            aria-label="Create new client"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </section>


      {/* Search and Filter Button Section */}
      <section className="px-4 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Input
              className="w-full h-12 rounded-full border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
              placeholder="Search by invoice ID, client..."
              type="text"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              {/* Search Icon (Lucide) */}
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
          </div>
          {/* Filter Button */}
          <button
            onClick={toggleFilter}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${isFilterOpen
              ? 'bg-primary text-white dark:bg-primary'
              : 'bg-white text-slate-500 shadow-sm border border-slate-200 dark:bg-card-dark dark:text-slate-400 dark:border-slate-700'
              }`}
            aria-expanded={isFilterOpen}
            aria-controls="filter-options"
          >
            {/* Sliders Icon (Lucide) */}
            <SlidersHorizontal className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Options (Conditionally rendered) */}
        <div
          id="filter-options"
          className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="space-y-3 rounded-xl bg-white p-4 shadow dark:bg-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-white">Filter by Status</h3>
            <div className="flex flex-wrap gap-2">
              {/* Filter Chip 1 */}
              <button className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-white shadow-sm">
                All
              </button>
              {/* Filter Chip 2 */}
              <button className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Overdue
              </button>
              {/* Filter Chip 3 */}
              <button className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Pending
              </button>
              {/* Filter Chip 4 */}
              <button className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Paid
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice List Section */}
      <section className="px-4 pb-20"> {/* Added pb-20 for clearance above the sticky footer */}
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <Link href={"#"} key={invoice.id} className="block rounded-xl bg-white p-4 border border-slate-200 transition-shadow hover:shadow-md dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  # <span className="font-bold text-slate-700 dark:text-slate-300">{invoice.invoice_number}</span>
                </p>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${invoice.status_front_class}`}>
                    {invoice.status}
                  </span>
                  {/* Arrow Right Icon (Lucide) */}
                  <ArrowRight onClick={() => handleOpenInvoiceLink(invoice.id)} className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">
                    AED {invoice.total}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {invoice.customer.name}
                  </p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Due: {new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}