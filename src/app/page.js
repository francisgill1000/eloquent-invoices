"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Key } from 'lucide-react';
import { set } from 'date-fns';
// Assuming you have Lucide icons available or using the inline SVGs as provided.
// For a production app, you'd typically import specific icons like:
// import { Search, Sliders, AlertTriangle, Home, FileText, Users, Settings, Plus } from 'lucide-react';
// We'll keep the SVGs inline for this conversion to be fully self-contained.

export default function DashboardHome() {

  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [paidInvoices, setPaidInvoices] = useState([]);
  const [dueInvoices, setDueInvoices] = useState([]);
  const [dueInvoicesSum, setDueInvoicesSum] = useState([]);



  useEffect(() => {
    const fetchInvoices = async () => {

      let res = await axios.get("invoices");

      let invoices = res.data.data;


      let paidInvoices = invoices.filter(inv => inv.status === 'Paid');

      let pendingInvoices = invoices.filter(inv => inv.status === 'Pending' && inv.remaining_days_count > 0);

      let dueInvoices = invoices.filter(inv => inv.status === 'Overdue');

      console.log(dueInvoices.map(e => e.total));
      

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
    <main className="flex-grow">


      {/* Search and Filter Button Section */}
      <section className="px-4 pb-4 pt-5">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Input
              className="w-full h-12 rounded-full border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
              placeholder="Search invoices, clients..." type="text"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              {/* Search Icon SVG */}
              <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z">
                </path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Overdue Summary Section */}
      <section className="px-4 pt-4">
        <div className="rounded-xl bg-red-500/10 p-4 text-red-500 dark:bg-red-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Total Overdue</h2>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-500">
              {/* Alert Triangle Icon SVG */}
              <svg className="lucide lucide-alert-triangle" fill="none" height="28" stroke="currentColor"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="28"
                xmlns="http://www.w3.org/2000/svg">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <path d="M12 9v4"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </div>
          </div>
          <p className="mt-1 text-3xl font-bold">{dueInvoicesSum}</p>
          <div className="mt-4 space-y-3">
            {/* Overdue details... */}
            {dueInvoices.map((invoice, i) => (
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{invoice.customer.name}</p>
                <p className="font-semibold text-slate-800 dark:text-white">AED {invoice.total}</p>
              </div>
            ))
            }
          </div>
        </div>
      </section>

      {/* Outstanding and Recent Payments Sections */}
      <section className="px-4 pt-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
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
          <div key={invoice.id || i} className="mt-2 flex items-center gap-4 rounded-xl bg-white p-4 border border-slate-200">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {/* Currency Icon SVG */}
              <Image alt='aed-symbol' height={30} width={30} src="/aed-symbol.png" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                AED {invoice.total}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Due in {invoice.remaining_days_count} days
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Recent Payments
        </h2>


        {paidInvoices.map((invoice, i) => (
          <div key={invoice.id || i} className="mt-2 space-y-3">
            <div className="flex items-center gap-4 rounded-xl bg-white p-4 border border-slate-200">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {/* Currency Icon SVG (Reused) */}
                <Image alt="aed-symbol" height={30} width={30} src="/aed-symbol.png" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  AED {invoice.total}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Received on {invoice.date_only}
                </p>
              </div>
            </div>
          </div>
        ))}

      </section>

      {/* Action Buttons Section */}
      < div className="my-6 flex gap-4 px-4" >
        <button className="h-12 flex-1 rounded-lg bg-primary text-sm font-bold text-white">
          <Link href="/invoices/create">Create Invoice</Link>
        </button>
        <button className="h-12 flex-1 rounded-lg bg-primary/20 text-sm font-bold text-primary dark:bg-primary/30">
          Send Reminder
        </button>
      </div >
    </main >
  );
}