"use client"

import { logout } from "@/app/api/auth/logout/route";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface ButtonProps {
    className?: string,
    children?: React.ReactNode
}

export default function LogoutButton({ className, children }: ButtonProps) {
    const router = useRouter();

    const handleLogout = useCallback(async () => {
        logout();
        router.push("/login");
    }, [router]);

    return (
        <button
            onClick={handleLogout}
            className={`btn ${(className) ? className : ""}`}
        >
            {children}
        </button>
    );
}
