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

        if (!storedUser || !token) {
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
        <header className="flex justify-between items-center p-4 z-10 border-b sticky top-0">
            <div className="flex items-center space-x-4">
                <Image
                    alt="Logo"
                    className="h-10 w-10 rounded-full object-cover"
                    src="/logo-white.png"
                    width={40}
                    height={40}
                />

                <span className="text-xl font-semibold">Eloquent Invoice</span>
            </div>
            <div className="flex items-center space-x-4">
                {/* Text: text-emerald-400 (Instead of text-neon-green) */}
                {/* <span className="flex items-center text-emerald-400 text-sm font-medium pr-4 border-r border-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5"></span> ALL OK
                </span> */}
                {/* Button Background: bg-emerald-500 (Instead of bg-neon-green) */}
                <button className="px-4 py-1 text-sm font-medium text-white bg-emerald-500 rounded-md hover:opacity-80 transition">
                    Upgrade
                </button>
                {/* Accent Color: bg-blue-500 (Instead of bg-neon-blue) */}
                {/* <Image
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full object-cover cursor-pointer"
                    src="/avatar.png"
                    width={40}
                    height={40}
                /> */}
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">F</div>
            </div>
        </header>

        // <header className="relative bg-white px-4 pb-4 pt-6 border-b border-gray-100 shadow-sm">
        //     <div className="relative z-10 flex items-start justify-between">
        //         <div className="flex items-center gap-3">
        //             <Image
        //                 alt="Logo"
        //                 className="h-10 w-10 rounded-full object-cover"
        //                 src="/logo-white.png"
        //                 width={40}
        //                 height={40}
        //             />
        //             <div>
        //                 <p className="text-sm font-medium text-slate-500">Welcome back,</p>
        //                 <p className="text-xl font-bold text-slate-800">{user?.name}</p>
        //             </div>
        //         </div>

        //         {/* Profile and Logout Section */}
        //         <div className="flex items-center gap-3">
        //             {/* Dropdown Menu */}
        //             <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        //                 <DropdownMenuTrigger asChild>
        //                     <Image
        //                         alt="User Avatar"
        //                         className="h-10 w-10 rounded-full object-cover cursor-pointer"
        //                         src="/avatar.png"
        //                         width={40}
        //                         height={40}
        //                     />
        //                 </DropdownMenuTrigger>

        //                 <DropdownMenuContent
        //                     align="end"
        //                     className="w-44 bg-white rounded-lg shadow-lg border border-gray-200 p-1"
        //                 >
        //                     {/* <DropdownMenuItem asChild>
        //                         <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100">
        //                             <Settings size={16} /> Settings
        //                         </Link>
        //                     </DropdownMenuItem> */}


        //                     <DropdownMenuItem
        //                         onClick={handleLogout}
        //                         className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
        //                     >
        //                         <LogOut size={16} /> Logout
        //                     </DropdownMenuItem>
        //                 </DropdownMenuContent>
        //             </DropdownMenu>

        //         </div>
        //     </div>
        // </header>
    );
}
