"use client";

import { FileText, Home, Users, Bell, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the five core navigation items
const NAV_ITEMS = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Clients", href: "/customers", icon: Users },
    { name: "Templates", href: "/templates", icon: LayoutTemplate }, // Added Templates
    // { name: "Reminders", href: "/reminders", icon: Bell },         // Added Reminders
];

export default function Header() {
    const pathname = usePathname();

    // Hide header on auth routes
    if (
        pathname?.startsWith("/login") ||
        pathname?.startsWith("/signup") ||
        pathname?.startsWith("/forgot-password")
    ) {
        return null;
    }

    // Helper function to determine if a link is active
    const isActive = (href) => {
        // Handle root path
        if (href === "/") return pathname === href;
        // Handle other paths, including sub-routes
        return pathname?.startsWith(href);
    };

    return (
        <footer className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-10">
            {/* Using a grid to manage 5 equally spaced items */}
            <div className="grid grid-cols-4 px-1 pb-3 pt-2">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            className={`flex flex-col items-center justify-end gap-1 transition-colors ${
                                active
                                    ? "text-primary font-bold"
                                    : "text-slate-500 dark:text-slate-400 font-medium"
                            }`}
                            href={item.href}
                        >
                            <div className="flex h-8 items-center justify-center">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <p className="text-xs">{item.name}</p>
                        </Link>
                    );
                })}
            </div>
        </footer>
    );
}