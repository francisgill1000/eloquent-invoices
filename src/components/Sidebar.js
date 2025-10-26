"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, FileText, Users, Settings } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`min-h-screen bg-[#37053e] text-white flex flex-col py-6 transition-all duration-300 ${collapsed ? "w-20" : "w-80"
                }`}
        >
            {/* Header Section */}
            <div className="flex items-center justify-between px-4 mb-6">
                <div className="flex items-center gap-3">
                    <Image onClick={() => setCollapsed(!collapsed)}
                        alt="Logo"
                        className="h-10 w-10 rounded-full object-cover"
                        src="/logo-white.png"
                        width={40}
                        height={40}
                    />
                    {!collapsed &&
                        <div className="text-xl">
                            Eloquent Invoices
                        </div>
                    }

                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 space-y-2">
                <SidebarLink href="/" icon={<Home size={25} />} text="Dashboard" collapsed={collapsed} />
                <SidebarLink href="/invoices" icon={<FileText size={25} />} text="Invoices" collapsed={collapsed} />
                <SidebarLink href="/customers" icon={<Users size={25} />} text="Clients" collapsed={collapsed} />
                <SidebarLink href="/settings" icon={<Settings size={25} />} text="Settings" collapsed={collapsed} />
            </nav>
        </aside>
    );
}

/**
 * Small reusable link component
 */
function SidebarLink({ href, icon, text, collapsed }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 text-xl p-2 mx-5 rounded-lg hover:bg-[#4a1c53] transition ${collapsed ? "justify-center" : ""
                }`}
        >
            {icon}
            {!collapsed && <span>{text}</span>}
        </Link>
    );
}
