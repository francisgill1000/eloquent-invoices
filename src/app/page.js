"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { ArrowRight, Banknote, BanknoteArrowDown, BanknoteArrowDownIcon, BanknoteArrowUp, BanknoteArrowUpIcon, CircleUserRound, Currency, CurrencyIcon, Eye, FileText, List, Plus } from 'lucide-react';
import Dashboard from '@/components/Dashboard';

export default function DashboardHome() {

  const [invoices, setInvoices] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [paidInvoices, setPaidInvoices] = useState([]);
  const [dueInvoices, setDueInvoices] = useState([]);
  const [dueInvoicesSum, setDueInvoicesSum] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {

      let config = {
        parmas: {
          order_by: "updated_at",
          order: "desc",
        }
      };

      let res = await axios.get("invoices", config);

      let invoices = res.data.data;

      setInvoices(invoices)

      let paidInvoices = invoices.filter(inv => inv.status === 'Paid');

      let pendingInvoices = invoices.filter(inv => inv.status === 'Pending' && inv.remaining_days_count > 0);

      let dueInvoices = invoices.filter(inv => inv.status === 'Overdue');

      const dueInvoicesSum = dueInvoices.reduce((acc, cur) => acc + parseFloat(cur.total.replace(/,/g, '')), 0);

      // Format as UAE Dirham
      let formatted = new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED'
      }).format(dueInvoicesSum);


      setDueInvoicesSum(formatted);

      setPendingInvoices(pendingInvoices);
      setPaidInvoices(paidInvoices);
      setDueInvoices(dueInvoices);
      console.log("🚀 ~ fetchInvoices ~ dueInvoices:", dueInvoices)

    };
    fetchInvoices();
  }, []);

  // Placeholder functions for actions
  const toggleFilter = () => {
    // Implement logic to show/hide the filter section (id="filter-options")
    console.log("Toggle filter options");
  };

  // Note: The original HTML had IDs, which are not used in this example but would be needed
  // for actual filter functionality or client-side interactions.

  return (

    <>

      <div className='hidden md:block'>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Invoice Dashboard</h1>
          <div className="flex justify-start sm:justify-end space-x-3">
            <Link href="/invoices/create">
              <button className="flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-desktop-border hover:bg-slate-700 transition">
                <Plus className="h-4 w-4 mr-1" /> Invoice
              </button></Link>

          </div>
        </div>

        {/* Usage Section */}
        <div className="mb-10">
          <h2 className="text-sm sm:text-base font-medium text-gray-300 mb-4">
            Usage since Oct 1, 2025
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-desktop-border shadow-md bg-[#1e1e1e]">
              <p className="text-sm text-gray-400 mb-1">Total</p>
              <p className="text-3xl font-bold text-white">{invoices.length}</p>
            </div>

            <div className="p-5 rounded-xl border border-desktop-border shadow-md bg-[#1e1e1e]">
              <p className="text-sm text-gray-400 mb-1">Total Paid</p>
              <p className="text-3xl font-bold text-white">{paidInvoices.length}</p>
            </div>

            <div className="p-5 rounded-xl border border-desktop-border shadow-md bg-[#1e1e1e]">
              <p className="text-sm text-gray-400 mb-1">Total Pending</p>
              <p className="text-3xl font-bold text-white">{pendingInvoices.length}</p>
            </div>

            <div className="p-5 rounded-xl border border-desktop-border shadow-md bg-[#1e1e1e]">
              <p className="text-sm text-gray-400 mb-1">Total Overdue</p>
              <p className="text-3xl font-bold text-white">{pendingInvoices.length}</p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-4">
            Metrics may be delayed up to one hour.{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Learn more here.
            </a>
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Monitoring */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Monitoring</h2>
              <a href="#" className="text-sm text-blue-500 hover:underline font-medium">View all metrics</a>
            </div>
            <div className=" p-5 rounded-xl border border-desktop-border shadow-lg">
              {/* Controls Row */}


              {/* Graph Placeholder */}
              <div className="flex flex-col items-center justify-center h-[200px] text-  rounded-lg p-4">
                {/* Placeholder icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p>There is no data to display at the moment.</p>
              </div>
            </div>
          </div>

          {/* Right Panel: Branch Details & Project Settings */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">1 Branch</h2>
              <a href="#" className="text-sm text-blue-500 hover:underline font-medium">View all</a>
            </div>
            <div className=" p-5 rounded-xl border border-desktop-border shadow-lg">

              {/* Branch Table Header */}
              <div className="grid grid-cols-4 gap-4 pb-2 border-b border-desktop-border mb-4 text-xs uppercase text- font-semibold">
                <span>Name</span>
                <span className="col-span-2">Primary compute</span>
                <span>Created by</span>
              </div>
              {/* Branch Row */}
              <div className="grid grid-cols-4 gap-4 items-center text-sm mb-6">
                <span className="flex items-center font-medium">
                  <span className="text-white">main</span>
                  <span className="text-xs uppercase text- ml-1">default</span>
                  <span className="ml-2 text-xs px-1 py-[1px] rounded bg-slate-700 text-white">i</span>
                </span>
                <span className="col-span-2 flex items-center">
                  <span className="font-bold text-white mr-1">.25 CU</span>
                  <span className="text-emerald-400">• ACTIVE</span>
                </span>
                <span className="text-emerald-400">👤</span>
              </div>

              {/* Preview Workflow Banner */}
              <div className="p-4  rounded-xl border border-desktop-border relative mb-6">
                <p className="text-xs uppercase text-emerald-400 font-bold mb-2 tracking-wider">PREVIEW WORKFLOW</p>
                <button className="absolute top-4 right-4 text- hover:text-white transition text-lg leading-none">×</button>
                <p className="text-sm text- mb-3">You don't have any preview branches yet. Improve your workflow by adding database branching to your development previews.</p>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:opacity-80 transition">
                  Install an integration
                </button>
              </div>

              {/* Project Settings */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold">Project settings</h3>
                  <a href="#" className="text-sm text-blue-500 hover:underline font-medium">Manage</a>
                </div>
                <div className="text-sm space-y-3">
                  <div className="flex justify-between">
                    <span className="text-">Region</span>
                    <span className="font-medium">AWS US East 2 (Ohio)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-">Default compute size</span>
                    <span className="font-medium">1 ↔ 2 CU</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-">History retention</span>
                    <span className="font-medium">1 day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-">Postgres version</span>
                    <span className="font-medium">17</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="px-4 pt-4">
        <div className="rounded-xl p-4 border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Total Overdue</h2>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full">
              {/* Alert Triangle Icon SVG */}
              <Link
                href="/invoices"
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
          <p className="mt-1 text-3xl font-bold">{dueInvoicesSum}</p>
        </div>
      </section>

      {/* Outstanding and Recent Payments Sections */}
      <section className="px-4 pt-6">
        <h2 className="text-xl font-bold">
          Outstanding
        </h2>
        {pendingInvoices.length === 0 &&
          <div className="mt-2 flex items-center gap-4 rounded-xl bg-white p-4 border border-slate-200">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {/* Currency Icon SVG */}
              <Image alt='aed-symbol' height={30} width={30} src="/aed-symbol.png" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                No Pending invoices
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You have no pending invoices.
              </p>
            </div>
          </div>
        }

        {pendingInvoices.map((invoice, i) => (
          <div key={invoice.id || i} className="mt-2 flex items-center gap-4 rounded-xl p-4 border">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full">
              {/* Currency Icon SVG */}
              <BanknoteArrowDownIcon />
            </div>
            <div>
              <p className="text-2xl font-bold">
                AED {invoice.total}
              </p>
              <p className="text-sm">
                Due in {invoice.remaining_days_count} days
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-xl font-bold">
          Recent Payments
        </h2>

        {paidInvoices.map((invoice, i) => (
          <div key={invoice.id || i} className="mt-2 space-y-3">
            <div className="flex items-center gap-4 rounded-xl  p-4 border">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full">
                {/* Currency Icon SVG (Reused) */}
                {/* <Image alt="aed-symbol" height={30} width={30} src="/aed-symbol.png" /> */}
                <BanknoteArrowUpIcon />
              </div>
              <div>
                <p className="font-semibold">
                  AED {invoice.total}
                </p>
                <p className="text-sm ">
                  Received on {invoice.recieved_date}
                </p>
              </div>
            </div>
          </div>
        ))}

      </section>
    </>
  );
}