"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait until auth state finishes loading
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Checking authentication...</p>
            </div>
        );
    }

    if (!user) {
        // Prevent rendering the protected content before redirect
        return null;
    }

    return children;
}
