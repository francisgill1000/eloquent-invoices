"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, FileText, Users, Settings } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const dynamicWidth = collapsed ? "w-20" : "w-64";

    return (
        <aside
            className={`${dynamicWidth} min-h-screen border-r border-desktop-border bg-desktop-bg text-white flex flex-col py-4 transition-all duration-300`}
        >
            <nav className="flex-1 space-y-2">
                <SidebarLink href="/" icon={<Home size={20} />} text="Dashboard" collapsed={collapsed} />
                <SidebarLink href="/invoices" icon={<FileText size={20} />} text="Invoices" collapsed={collapsed} />
                <SidebarLink href="/customers" icon={<Users size={20} />} text="Clients" collapsed={collapsed} />
                <SidebarLink href="/settings" icon={<Settings size={20} />} text="Settings" collapsed={collapsed} />
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
            className={`block p-2 rounded-lg  hover:bg-slate-800 transition flex items-center gap-3  p-2 mx-5 rounded-lg hover:bg-[#4a1c53] transition ${collapsed ? "justify-center" : ""
                }`}
        >
            {icon}
            {!collapsed && <span>{text}</span>}
        </Link>
    );
}
