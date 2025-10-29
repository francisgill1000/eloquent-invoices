"use client";

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Plus, AlertCircle, Wallet, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseApiError } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

export default function InvoiceList() {

  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reminderSubmitting, setReminderSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);

  // 👉 New states for reminder modal
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const fetchInvoices = async () => {
    try {
      let config = { params: { status, search: debouncedSearch } };
      let res = await axios.get("invoices", config);
      setInvoices(res.data.data);
    } catch (error) {
      console.log(parseApiError(error));
    }
  };

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    fetchInvoices();
  }, [status, debouncedSearch]);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const handleFilters = (status) => setStatus(status);
  const handleSearch = (e) => setSearch(e.target.value);

  const handlPayment = async (invoice) => {
    try {
      // Store the invoice for the payment page
      sessionStorage.setItem('invoiceToPay', JSON.stringify(invoice));
      router.push('/invoices/pay');
    } catch (error) {
      console.log(error);
    }
  };


  const handlPaymentOLD = async (invoice) => {
    const router = useRouter();

    // setSubmitting(true);
    // try {
    //   let res = await axios.get(`/mark-as-paid/${invoice.id}`);
    //   console.log(res.data.message);
    //   await fetchInvoices();
    // } catch (error) {
    //   console.log(parseApiError(error));
    // } finally {
    //   setSubmitting(false);
    // }
  };

  const handleReminderClick = (invoice) => {
    setSelectedInvoice(invoice);
    setReminderModalOpen(true);
  };

  const handlePaymentHistory = (invoice) => {
    console.log("🚀 ~ handlePaymentHistory ~ invoice:", invoice)
    setSelectedInvoice(invoice)
    setPayments(invoice.payments);
    setPaymentsModalOpen(true);

  };

  const sendReminder = async () => {
    if (!selectedInvoice || !selectedMethod) return;
    setReminderSubmitting(true);
    try {

      let config = { params: { method: selectedMethod } };
      const res = await axios.get(`/invoices/reminder/${selectedInvoice.id}`, config);
      console.log("Reminder sent:", res.data.message);
      setReminderModalOpen(false);
      setSelectedInvoice(null);
      setSelectedMethod(null);
    } catch (error) {
      console.log(parseApiError(error));
    } finally {
      setReminderSubmitting(false);
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'border-l-green-500';
      case 'pending': return 'border-l-yellow-500';
      case 'overdue': return 'border-l-red-500';
      default: return 'border-l-slate-700';
    }
  };

  return (
    <main className="flex-grow">
      {/* Header Title */}
      <section className="px-4 pt-5 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Invoice</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create and manage invoices</p>
          </div>
          <Link
            href="/invoices/create"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:scale-105"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="px-4 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Input
              placeholder="Search by invoice ID"
              type="text"
              value={search || ''}
              onChange={handleSearch}
              className="w-full h-12 rounded-full pl-12"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
          </div>

          <button
            onClick={toggleFilter}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isFilterOpen
              ? 'bg-primary text-white'
              : 'bg-white text-slate-500 border border-slate-200'
              }`}
          >
            <SlidersHorizontal className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Options */}
        {isFilterOpen && (
          <div className="mt-4 rounded-xl bg-white p-4 dark:bg-slate-800 space-y-3">
            <h3 className="font-semibold text-slate-800 dark:text-white">Filter by Status</h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'Overdue', 'Pending', 'Paid'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleFilters(s === 'All' ? null : s)}
                  className={`${status === (s === 'All' ? null : s)
                    ? 'bg-primary text-white'
                    : 'bg-white text-slate-600'
                    } rounded-full border border-slate-300 px-3 py-1`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Invoice List */}
      <section className="px-4 pb-20">
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`block rounded-xl bg-white p-4 shadow border-l-2 ${getStatusBorderColor(invoice.status)}`}
            >
              <div className="flex items-center justify-between">
                <Link href="#" className="text-sm font-semibold text-slate-500">
                  # <span className="font-bold text-slate-700">{invoice.invoice_number}</span>
                </Link>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${invoice.status_front_class}`}>
                  {invoice.status}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-800">AED {invoice.total}</p>
                  <p className="text-sm text-slate-500">{invoice.customer.name}</p>
                </div>
                {(invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                  <p className="text-sm text-slate-500">
                    Due: {new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>

              {(invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                <div className="mt-2 flex justify-between gap-2">
                  <div>
                    <Clock className="text-primary-500 h-8" onClick={() => handlePaymentHistory(invoice)} />
                  </div>
                  <div>
                    <div className='flex'>
                      <Bell className="text-primary h-8" onClick={() => handleReminderClick(invoice)} />
                      &nbsp;
                      <Wallet className="text-primary h-8" onClick={() => handlPayment(invoice)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Dialog open={reminderModalOpen} onOpenChange={setReminderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Reminder</DialogTitle>
            <DialogDescription>
              Choose how you want to send the reminder for invoice <strong>#{selectedInvoice?.invoice_number}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4">
            {['Whatsapp', 'Email', 'SMS'].map((method) => (
              <Button
                key={method}
                variant={selectedMethod === method ? "default" : "outline"}
                onClick={() => setSelectedMethod(method)}
              >
                {method}
              </Button>
            ))}
          </div>

          <DialogFooter className="mt-6">
            <Button
              disabled={!selectedMethod || reminderSubmitting}
              onClick={sendReminder}
              className="w-full bg-blue-600"
            >
              {reminderSubmitting ? "Sending..." : `Send via ${selectedMethod || '...'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentsModalOpen} onOpenChange={setPaymentsModalOpen}>
        <DialogContent className="max-w-md w-[90vw] rounded-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Payment History
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Your payment history for{" "}
              <strong className="text-foreground">
                #{selectedInvoice?.invoice_number}
              </strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 relative border-border px-1">
            {payments.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-6 border rounded-lg bg-muted/30">
                No payments found.
              </div>
            ) : (
              payments.map((payment, index) => (
                <div
                  key={payment.id}
                  className="relative pb-6 pl-2"
                >
                  {/* Timeline dot */}
                  <span className="absolute -left-[7px] top-3 w-3 h-3 bg-primary rounded-full ring-4 ring-background" />

                  {/* Payment info */}
                  <div className="rounded-lg bg-muted/40 hover:bg-muted/60 transition p-3 sm:p-4 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-600 text-base">
                        AED {parseFloat(payment.amount).toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                      <div>
                        <span className="font-medium text-foreground">Mode:</span>{" "}
                        {payment.mode}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Ref #:</span>{" "}
                        {String(payment.id).padStart(6, "0")}
                      </div>
                    </div>
                  </div>

                  {/* Connector line (hidden for last item) */}
                  {index !== payments.length - 1 && (
                    <span className="absolute left-[-1px] top-5 h-[calc(100%-0.75rem)] w-px bg-border" />
                  )}
                </div>
              ))
            )}
          </div>

        </DialogContent>
      </Dialog>

    </main>
  );
}
