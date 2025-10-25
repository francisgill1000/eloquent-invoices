"use client";

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

import { Search, SlidersHorizontal, Plus } from 'lucide-react';

import { API_BASE_URL } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { parseApiError } from '@/lib/utils';

export default function InvoiceList() {

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reminderSubmitting, setReminderSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async () => {

    let config = {
      params: {
        status: status,
        search: debouncedSearch,
      }
    };

    let res = await axios.get("invoices", config);

    setInvoices(res.data.data);
  };

  // 🕒 Debounce logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // wait 500ms after typing stops

    return () => clearTimeout(timeout);
  }, [search]);

  // 🔍 Trigger API only when debouncedSearch changes
  useEffect(() => {
    fetchInvoices();
  }, [status, debouncedSearch]);


  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    console.log("Toggle filter options. Current state:", !isFilterOpen);
  };

  const handleFilters = (status) => {
    console.log("🚀 ~ handleFilters ~ status:", status)
    setStatus(status);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleReminder = async (id) => {
    console.log("🚀 ~ handleReminder ~ id:", id)
      ,
      setReminderSubmitting(true);

    try {

      // let res = await axios.get(`/invoices/reminder/` + id);

      // console.log("🚀 ~ handleReminder ~ res:", res)

      // await fetchInvoices()

    } catch (error) {
      console.log(parseApiError(error));
    } finally {
      setTimeout(() => {
        setReminderSubmitting(false);
      }, 5000);
    }

  }

  const handleMarkAsPaid = async (invoice) => {
    console.log("🚀 ~ handleMarkAsPaid ~ invoice:", invoice)
    setSubmitting(true);

    try {

      let res = await axios.get(`/mark-as-paid/` + invoice.id);

      console.log("🚀 ~ handleMarkAsPaid ~ res:", res.data.message)

      await fetchInvoices()

    } catch (error) {
      console.log(parseApiError(error));
    } finally {
      setSubmitting(false);
    }

  }

  const getStatusBorderColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'border-l-green-500';
      case 'pending':
        return 'border-l-yellow-500';
      case 'overdue':
        return 'border-l-red-500';
      default:
        return 'border-l-slate-700';
    }
  };


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
              placeholder="Search by invoice ID"
              type="text"
              value={search || ''}
              onChange={handleSearch}
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
          <div className="space-y-3 rounded-xl bg-white p-4 dark:bg-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-white">Filter by Status</h3>
            <div className="flex flex-wrap gap-2">
              {/* Filter Chip 1 */}
              <button onClick={() => { handleFilters(null) }} className={`${status == null ? 'bg-primary text-white' : 'bg-white text-slate-600'} rounded-full border border-slate-300 px-3 py-1 font-medium dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300`}>
                All
              </button>
              {/* Filter Chip 2 */}
              <button onClick={() => { handleFilters("Overdue") }} className={`${status == 'Overdue' ? 'bg-primary text-white' : 'bg-white text-slate-600'} rounded-full border border-slate-300 px-3 py-1 font-medium dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300`}>
                Overdue
              </button>
              {/* Filter Chip 3 */}
              <button onClick={() => { handleFilters("Pending") }} className={`${status == 'Pending' ? 'bg-primary text-white' : 'bg-white text-slate-600'} rounded-full border border-slate-300 px-3 py-1 font-medium dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300`}>
                Pending
              </button>
              {/* Filter Chip 4 */}
              <button onClick={() => { handleFilters("Paid") }} className={`${status == 'Paid' ? 'bg-primary text-white' : 'bg-white text-slate-600'} rounded-full border border-slate-300 px-3 py-1 font-medium dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300`}>
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
            <div
              key={invoice.id}
              className={`block rounded-xl bg-white p-4 shadow transition-shadow hover:shadow-md dark:bg-slate-800 border-l-2 ${getStatusBorderColor(invoice.status)}`}
            >
              {/* Top row: make only the number/customer clickable if you want */}
              <div className="flex items-center justify-between">
                <Link href="#" className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  # <span className="font-bold text-slate-700 dark:text-slate-300">{invoice.invoice_number}</span>
                </Link>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${invoice.status_front_class}`}>
                    {invoice.status}
                  </span>
                  {/* Arrow icon could go here */}
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

                {(invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Due: {new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                )}

              </div>

              {(invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                <div className="mt-2 flex gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Button
                    disabled={submitting}
                    onClick={() => handleMarkAsPaid(invoice)}
                    className="bg-primary w-1/2 h-8"
                  >
                    {submitting ? "Submitting..." : "Mark As Paid"}
                  </Button>
                  <Button
                    disabled={reminderSubmitting}
                    onClick={() => handleReminder(invoice.id)}
                    className="bg-blue-500 w-1/2 h-8"
                  >
                    {reminderSubmitting ? "Submitting..." : "Reminder"}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}