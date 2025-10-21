'use client';

import { Input } from '@/components/ui/input';
import { User, LockIcon, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');
        setLoading(true);

        try {

            await axios.post(`/register`, form);

            setMessage('Account created successfully!');

            router.push('/login'); // redirect to login page
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

                    <h1 className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">
                        Create your account
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Manage your invoices with ease.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* ✅ Name Field */}
                    <div>
                        <label
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <div className="relative mt-2">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full h-12 rounded-lg bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* ✅ Email Field */}
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
                                id="email"
                                name="email"
                                placeholder="your@example.com"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full h-12 rounded-lg bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* ✅ Password Field */}
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
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full h-12 rounded-lg bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* ✅ Confirm Password Field */}
                    <div>
                        <label
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            htmlFor="password_confirmation"
                        >
                            Confirm Password
                        </label>
                        <div className="relative mt-2">
                            <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                placeholder="••••••••"
                                type="password"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                required
                                className="w-full h-12 rounded-lg bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">{errors.password_confirmation[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* ✅ Submit Button */}
                    <button
                        disabled={loading}
                        className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                        type="submit"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>

                    {message && (
                        <p className="text-center text-sm mt-2 text-slate-600 dark:text-slate-300">
                            {message}
                        </p>
                    )}
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?&nbsp;
                        <Link className="font-medium text-primary hover:underline" href="/login">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
