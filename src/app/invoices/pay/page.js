"use client";

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Plus, Users, LayoutTemplate, Calendar as CalendarIcon, ArrowLeft, DollarSign, Trash, CheckCircle, CheckCircle2, Check, ThumbsUp, File } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";


import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // adjust path
import { Calendar } from "@/components/ui/calendar"; // adjust path
import { Button } from '@/components/ui/button';


import { parseApiError } from '@/lib/utils';

import axios, { API_BASE_URL } from '@/lib/axios';
import { useRouter } from 'next/navigation';


export default function NewInvoiceScreen() {

    const [invoice, setInvoice] = useState(null);

    const router = useRouter();

    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [payingAmount, setPayingAmount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [prevbalance, setPrevBalance] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const data = sessionStorage.getItem('invoiceToPay');
        if (data) {
            let invoice = JSON.parse(data)
            console.log("🚀 ~ NewInvoiceScreen ~ invoice:", invoice)
            setInvoice(invoice);
            let total = parseFloat(invoice.total.replace(/,/g, '') || 0);
            setTotal(total);
            setBalance(invoice.payments_count == 0 ? total : invoice.balance);
            setPrevBalance(invoice.payments_count == 0 ? total : invoice.balance);
            setLoading(false)
        };
    }, []);


    const handleBalance = (e) => {
        setPayingAmount(e.target.value);
        setBalance(prevbalance - Number(e.target.value));
    }

    const handleOpenInvoiceLink = () => {
        const url = `${API_BASE_URL}/invoices/generate/${invoice.id}`;
        window.open(url, '_blank');
        setSuccessDialogOpen(false);
        router.push('/invoices');
    }

    const onSubmit = async () => {

        const payload = {
            id: invoice.id,
            amount: Number(payingAmount),
            balance: Number(balance),
        };

        console.log("🚀 ~ onSubmit ~ payload:", payload)
        try {

            let res = await axios.post('/invoices/pay', payload);


            console.log("🚀 ~ onSubmit ~ res:", res)

            // Simulate API delay
            setSubmitting(true);
            setTimeout(() => {
                setSubmitting(false);
                setSuccessDialogOpen(true); // open dialog after fake API success
            }, 1500);

        } catch (error) {
            console.log("🚀 ~ onSubmit ~ error:", error)
        }

    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden bg-white dark:bg-slate-900">

            {loading ? (
                <div className="flex flex-grow items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
                    </div>
                </div>

            ) : (
                <main className="flex-grow">
                    <section className="p-4">
                        <form className="space-y-8">

                            <div className="space-y-4">
                                <Link href="/invoices" className="text-slate-500 dark:text-slate-400"></Link>
                                <br />
                                <div className="flex items-center justify-between"> {/* Flex container for title and button */}
                                    <div><ArrowLeft className="h-6 w-6" /> </div>
                                    <div className="text-xl font-bold text-slate-800 dark:text-white">
                                        {invoice?.invoice_number}
                                    </div>
                                </div>
                                <div>
                                    <Input defaultValue={invoice?.customer?.name || ""} className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 pb-2" />
                                </div>

                                <div>
                                    <label
                                        htmlFor="due-date"
                                        className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1"
                                    >
                                        Due Date
                                    </label>
                                    <div>
                                        <Input defaultValue={invoice?.due_date || ""} className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 pb-2" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                                    <Input defaultValue={invoice?.status || ""} className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 pb-2" />
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Items</h3>
                                <div className="overflow-x-auto">

                                    {invoice?.items.map(item => (
                                        <div key={item.id}
                                            className="bg-card-light mb-5 dark:bg-card-dark rounded-xl border border-slate-300 dark:border-border-dark shadow-sm p-4">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1"
                                                    htmlFor="item-name-1">Item Name</label>
                                                <Input
                                                    readOnly
                                                    id="item-name-1" defaultValue={item.description || ''} type="text" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1"
                                                        htmlFor="quantity-1">Quantity</label>
                                                    <Input readOnly
                                                        id="quantity-1" type="number" min="0" defaultValue={item.qty || "0"}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1"
                                                        htmlFor="price-1">Unit Price</label>
                                                    <div className="relative">
                                                        <Input readOnly
                                                            id="price-1" min="0" step="0.01" defaultValue={item.unit_price} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Discount and Total Section */}
                            <div className="mt-8 space-y-4 border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Subtotal
                                    </span>
                                    <span className="text-slate-800 dark:text-white font-semibold">
                                        AED {invoice?.subtotal}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label htmlFor="discount" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tax Amount
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-600 dark:text-slate-400">AED</span>
                                        <Input
                                            id="discount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            defaultValue={invoice?.tax || "0"}
                                            className="w-24 text-right"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label htmlFor="discount" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Discount
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-600 dark:text-slate-400">AED</span>
                                        <Input
                                            id="discount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            defaultValue={invoice?.discount}
                                            className="w-24 text-right"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t pt-2">
                                    <span className="text-lg font-bold text-slate-800 dark:text-white">
                                        Total
                                    </span>
                                    <span className="text-lg font-bold text-primary">
                                        AED {invoice?.total}
                                    </span>
                                </div>


                                <div className="flex justify-between items-center">
                                    <label htmlFor="discount" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Paying Amount
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-600 dark:text-slate-400">AED</span>
                                        <Input
                                            id="discount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={payingAmount}
                                            onChange={handleBalance}
                                            className="w-24 text-right"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t pt-2">
                                    <span className="text-lg font-bold text-slate-800 dark:text-white">
                                        Balance
                                    </span>
                                    <span className="text-lg font-bold text-primary">
                                        AED {balance.toFixed(2)}
                                    </span>
                                </div>


                            </div>


                            {/* Submit Button */}
                            <button
                                onClick={onSubmit}
                                type="button"
                                className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-primary text-lg font-bold text-white shadow-lg shadow-primary/30"
                            >
                                {submitting ? (
                                    <>Creating...</>
                                ) : (
                                    <>
                                        Create Invoice
                                    </>
                                )}
                            </button>
                        </form>
                    </section>

                    <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-primary text-lg font-semibold flex justify-center items-center gap-2">
                                    <File /> {invoice?.invoice_number}
                                </DialogTitle>
                                <DialogDescription className="text-slate-600 dark:text-slate-300  p-5">
                                    Payment has been record.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    className="w-full"
                                    onClick={handleOpenInvoiceLink}
                                >
                                    View Invoice
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </main>
            )}

        </div>
    );
}