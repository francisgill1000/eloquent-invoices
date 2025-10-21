'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { LockIcon, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');
        setLoading(true);

        try {
            
            const response = await axios.post(`/login`, form);

            const token = response.data.token;
            const user = response.data.user;

            // ✅ Save to localStorage (same as register)
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setMessage('Login successful!');
            router.push('/'); // redirect to your dashboard or home
        } catch (error) {
            console.error(error);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light px-4 py-8 dark:bg-background-dark">
            <div className="w-full max-w-md">
                <div className="text-center">
                    <div style={{ width: '250px', height: '80px', margin: '0 auto' }}>
                        <Image
                            src="/logo-icon-2.png"
                            alt="Eloquent Logo"
                            width={250}
                            height={80}
                            priority
                        />
                    </div>

                    <h1 className="pt-10 text-3xl font-bold text-slate-800 dark:text-white">
                        Welcome back!
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Manage your invoices with ease.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            htmlFor="email"
                        >
                            Email address
                        </label>
                        <div className="relative mt-2">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="your@example.com"
                                type="email"
                                required
                                className="w-full h-12 rounded-lg bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative mt-2">
                            <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                type="password"
                                required
                                className="w-full h-12 rounded-lg bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
                            )}
                        </div>
                    </div>

                    {message && (
                        <p
                            className={`text-center text-sm ${
                                message.includes('success') ? 'text-green-500' : 'text-red-500'
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Not Registered Yet?&nbsp;
                        <Link className="font-medium text-primary hover:underline" href="/signup">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
