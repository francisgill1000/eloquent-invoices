"use client";

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Plus, Home, FileText, Users, LayoutTemplate, Bell, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseApiError } from '@/lib/utils';


export default function NewClientScreen() {

    const router = useRouter();

    const [customer, setCustomer] = useState({ name: "", whatsapp: "", email: "", phone: "" });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage('');
        setLoading(true);

        try {

            await axios.post(`/customers`, customer);

            setCustomer({ name: "", whatsapp: "", email: "", phone: "" })

            router.push('/invoices/create');

        } catch (error) {
            setError(parseApiError(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden bg-white dark:bg-slate-900">
            <main className="flex-grow">

                {/* Form Content */}
                <section className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Client Details Group */}
                        <div className="space-y-4">
                            <Link href="/customers" className="text-slate-500 dark:text-slate-400">
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                            <br />
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Client Information</h2>
                            <div>
                                <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                    Company/Contact Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g., Apex Enterprises"
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    required
                                    value={customer.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="whatsapp" className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                    Whatsapp Number
                                </label>
                                <Input
                                    id="whatsapp"
                                    name="whatsapp"
                                    type="tel"
                                    placeholder="(555) 123-4567"
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    value={customer.whatsapp}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="e.g., billing@apex.com"
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    required
                                    value={customer.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                    Phone Number (Optional)
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="(555) 123-4567"
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    value={customer.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 mt-5 border border-red-500 bg-red-50 text-red-700 rounded-lg" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-primary text-lg font-bold text-white shadow-lg shadow-primary/30 mt-8"
                        >


                            {loading
                                ? 'Submitting...' :
                                <> <Plus className="h-5 w-5" /> Create Client </>
                            }
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
}