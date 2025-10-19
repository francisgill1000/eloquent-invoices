'use client';

import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Assuming you have a file at /public/assets/images/logo-icon-2.png
// and that 'primary' is a color configured in your Tailwind setup.

export default function ForgotPasswordPage() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle logic to send password reset email here
        console.log('Password reset request submitted');
        alert('If an account exists, a password reset link has been sent to your email.');
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light px-4 py-8 dark:bg-background-dark">
            <div className="w-full max-w-md">
                <div className="text-center">
                    {/* Logo Section (Identical to Login Page) */}
                    <div style={{ width: '250px', height: '80px', margin: '0 auto' }}>
                        <Image
                            src="/logo-icon-2.png" // Use your actual logo path
                            alt="Eloquent Logo"
                            width={250}
                            height={80}
                            priority
                        />
                    </div>
                    <br />
                    <br />
                    
                    {/* Updated Heading and Sub-text */}
                    <h1 className="pt-10 text-3xl font-bold text-slate-800 dark:text-white">
                        Forgot Your Password?
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>
                
                {/* Forgot Password Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
                            Email address
                        </label>
                        <div className="relative mt-2">
                            <Mail
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                            />
                            <Input
                                id="email"
                                placeholder="your@example.com"
                                type="email"
                                required
                                className="w-full h-12 rounded-lg bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
                            />
                        </div>
                    </div>
                    
                    {/* Submit Button */}
                    <button
                        className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                        type="submit"
                    >
                        Send Reset Link
                    </button>
                </form>
                
                {/* Back to Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Remember your password?&nbsp;
                        <Link className="font-medium text-primary hover:underline" href="/login">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}