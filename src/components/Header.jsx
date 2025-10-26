"use client";

import { LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import axiosInstance from "@/lib/axios";

if (typeof window !== "undefined" && !window.axios) {
    window.axios = axiosInstance;
}


export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [user, setUser] = useState(null);


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || ! token) {
            return router.push("/login");
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Hide header on auth routes
    if (
        pathname?.startsWith("/login") ||
        pathname?.startsWith("/signup") ||
        pathname?.startsWith("/forgot-password")
    ) {
        return null;
    }
    // Logout function
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return router.push("/login");

            await axiosInstance.post(`logout`);

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };


    return (
        <header className="relative bg-white px-4 pb-4 pt-6 border-b border-gray-100 shadow-sm">
            <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Image
                        alt="Logo"
                        className="h-10 w-10 rounded-full object-cover"
                        src="/logo-white.png"
                        width={40}
                        height={40}
                    />
                    <div>
                        <p className="text-sm font-medium text-slate-500">Welcome back,</p>
                        <p className="text-xl font-bold text-slate-800">{user?.name}</p>
                    </div>
                </div>

                {/* Profile and Logout Section */}
                <div className="flex items-center gap-3">
                    {/* Dropdown Menu */}
                    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <Image
                                alt="User Avatar"
                                className="h-10 w-10 rounded-full object-cover cursor-pointer"
                                src="/avatar.png"
                                width={40}
                                height={40}
                            />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-44 bg-white rounded-lg shadow-lg border border-gray-200 p-1"
                        >
                            {/* <DropdownMenuItem asChild>
                                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100">
                                    <Settings size={16} /> Settings
                                </Link>
                            </DropdownMenuItem> */}


                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
                            >
                                <LogOut size={16} /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </header>
    );
}
