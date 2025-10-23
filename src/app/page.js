"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { ArrowRight, Eye, FileText, List } from 'lucide-react';

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
      {/* Overdue Summary Section */}
      <div className="mt-6 flex gap-4 px-4" >
        <button className="h-12 flex-1 rounded-lg bg-primary text-sm font-bold text-white">
          <Link href="/invoices/create"> Create Invoice</Link>
        </button>
        {/* <button className="h-12 flex-1 rounded-lg bg-primary/20 text-sm font-bold text-primary dark:bg-primary/30">
          Send Reminder
        </button> */}
      </div>
      <section className="px-4 pt-4">
        <div className="rounded-xl bg-red-500/10 p-4 text-red-500 dark:bg-red-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Total Overdue</h2>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-500">
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
                  Received on {invoice.recieved_date}
                </p>
              </div>
            </div>
          </div>
        ))}

      </section>
    </main>
  );
}