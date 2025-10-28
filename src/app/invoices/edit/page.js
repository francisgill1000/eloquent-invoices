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

    const [tax, setTax] = useState(0);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [open, setOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [customerId, setCustomerId] = useState(customers[0]?.id || 0);
    const [invoiceStatus, setInvoiceStatus] = useState('Draft');

    const [insertedInvoice, setInsertedInvoice] = useState(null); //

    const [items, setItems] = useState([
        { id: 1, description: '', qty: 1, unit_price: 0 },
    ]);

    const [discount, setDiscount] = useState(0);

    const [payingAmount, setPayingAmount] = useState(0);



    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0);

    const total = Math.max((subtotal + Number(tax)) - Number(discount), 0);

    useEffect(() => {
        const data = sessionStorage.getItem('invoiceToPay');
        if (data) {
            const { customer, ...invoice } = JSON.parse(data);
            console.log("🚀 ~ NewInvoiceScreen ~ invoice:", invoice)
            setInvoice(invoice);
            setCustomerId(invoice.customer_id);
            setDueDate(invoice.due_date);
            setItems(invoice.items);
            setTax(invoice.tax);
            setDiscount(invoice.discount);
        };
    }, []);


    const fetchCustomers = async () => {

        setLoading(true);

        try {
            let config = {
                params: {
                    search: debouncedSearch || undefined,
                }
            };

            let response = await axios.get(`/customers`, config);

            setCustomers(response.data.data);

        } catch (error) {
            console.log(parseApiError(error));
        } finally {
            setLoading(false);
        }
    };

    // 1️⃣ Update debouncedSearch 500ms after the user stops typing
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000); // Adjust delay as needed (e.g. 300ms, 800ms)

        return () => {
            clearTimeout(handler); // Cleanup on next keystroke
        };
    }, [search]);


    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [debouncedSearch]);


    const addItem = () => {
        const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
        setItems([...items, { id: nextId, description: '', qty: 1, unit_price: 0 }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id, key, value) => {
        setItems(items.map(i => i.id === id ? { ...i, [key]: value } : i));
    };

    const handleSelect = (date) => {
        setDueDate(date);
        // close the popover manually after selection (optional)
        setOpen(false);
    };

    const onSubmit = async () => {

        const payload = {
            customer_id: customerId,
            due_date: dueDate,
            status: invoiceStatus,
            items: items.map(i => ({
                description: i.description,
                qty: Number(i.qty),
                unit_price: Number(i.unit_price),
            })),
            subtotal,
            tax: Number(tax),
            discount: Number(discount),
            total,
        };

        try {

            let response = await axios.post('/invoices', payload);

            setInsertedInvoice(response?.data?.invoice);

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

    const handleOpenInvoiceLink = () => {
        if (insertedInvoice && insertedInvoice.id) {
            const url = `${API_BASE_URL}/invoices/generate/${insertedInvoice.id}`;
            window.open(url, '_blank');
            setSuccessDialogOpen(false);
            router.push('/invoices');
        }
    }

    const balance = total - payingAmount;

    if (!invoice) return <p>Loading...</p>;

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
                                <Link href="/invoices" className="text-slate-500 dark:text-slate-400">

                                </Link>
                                <br />
                                <div className="flex items-center justify-between"> {/* Flex container for title and button */}
                                    <div><ArrowLeft className="h-6 w-6" /> </div>
                                    <div className="text-xl font-bold text-slate-800 dark:text-white">
                                        {invoice.invoice_number}
                                    </div>
                                    {/* <p className="text-sm text-slate-500 dark:text-slate-400 mt-1"> create and manage invoices </p> */}


                                </div>
                                <div>
                                    <Select
                                        value={customerId.toString()}
                                        onValueChange={(value) => setCustomerId(Number(value))}
                                    >
                                        <SelectTrigger className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 pb-2">
                                            <SelectValue placeholder="Select a customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Search input */}
                                            <div className="p-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Search..."
                                                    className="w-full px-2 py-1 border rounded-md dark:bg-slate-700 dark:text-white"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                />
                                            </div>

                                            {/* Customer items */}
                                            {customers.map((c) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="due-date"
                                        className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1"
                                    >
                                        Due Date
                                    </label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger readOnly asChild>
                                            <Button

                                                variant="outline"
                                                className="w-full justify-between items-center text-left flex"
                                            >
                                                {dueDate}
                                                <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-300 ml-2" />
                                            </Button>
                                        </PopoverTrigger>

                                        {/* <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dueDate}
                                                onSelect={handleSelect}
                                                className="w-[300px] rounded-md border"
                                            />
                                        </PopoverContent> */}
                                    </Popover>
                                </div>

                                <div>
                                    <label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Status</label>

                                    <Select
                                        value={invoiceStatus}
                                        onValueChange={(value) => setInvoiceStatus((value))}
                                    >
                                        <SelectTrigger className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2">
                                            <SelectValue placeholder="Select a customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Draft'>Draft</SelectItem>
                                            <SelectItem value='Paid'>Paid</SelectItem>
                                            <SelectItem value='Overdue'>Overdue</SelectItem>
                                            <SelectItem value='Pending'>Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Items</h3>
                                <div className="overflow-x-auto">

                                    {items.map(item => (
                                        <div key={item.id}
                                            className="bg-card-light mb-5 dark:bg-card-dark rounded-xl border border-slate-300 dark:border-border-dark shadow-sm p-4">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1"
                                                    htmlFor="item-name-1">Item Name</label>
                                                <Input readOnly
                                                    id="item-name-1" value={item.description || ''} onChange={(e) => updateItem(item.id, 'description', e.target.value)} type="text" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1"
                                                        htmlFor="quantity-1">Quantity</label>
                                                    <Input readOnly
                                                        id="quantity-1" type="number" min="0" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1"
                                                        htmlFor="price-1">Unit Price</label>
                                                    <div className="relative">
                                                        <Input readOnly
                                                            id="price-1" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateItem(item.id, 'unit_price', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="flex justify-end">
                                                <Button type="button" onClick={() => removeItem(item.id)} className="p-2 bg-white rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500">
                                                    <span className="material-icons text-base">
                                                        <Trash className="h-4 w-4" />
                                                    </span>
                                                </Button>
                                            </div> */}
                                        </div>
                                    ))}

                                </div>

                                {/* <div className="flex gap-2">
                                    <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg bg-white border px-3 py-2 text-sm">
                                        <Plus className="h-4 w-4" /> Add Item
                                    </button>
                                </div> */}
                            </div>


                            {/* Discount and Total Section */}
                            <div className="mt-8 space-y-4 border-t pt-4">


                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Subtotal
                                    </span>
                                    <span className="text-slate-800 dark:text-white font-semibold">
                                        AED {subtotal.toFixed(2)}
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
                                            value={tax}
                                            onChange={(e) => setTax(e.target.value)}
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
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            className="w-24 text-right"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t pt-2">
                                    <span className="text-lg font-bold text-slate-800 dark:text-white">
                                        Total
                                    </span>
                                    <span className="text-lg font-bold text-primary">
                                        AED {total.toFixed(2)}
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
                                            onChange={(e) => setPayingAmount(e.target.value)}
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
                                    <File /> {insertedInvoice ? insertedInvoice?.invoice_number : ''}
                                </DialogTitle>
                                <DialogDescription className="text-slate-600 dark:text-slate-300  p-5">
                                    Your new invoice has been created successfully.
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