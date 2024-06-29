// Import Layout css
import layout from "@styles/scss/layouts/home-layout.module.scss";

// Import UI
import Navbar from "@/ui/navbar";
import Sidebar from "@/ui/sidebar";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faKey,
    faMailBulk,
    faSignOut,
    faUser
}
    from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";

import { UserProvider } from "@/context/user-context";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <UserProvider>
            <Navbar />
            <main className={layout["wraper"]}>
                <div className={layout['content']}>
                    {children}
                </div>
            </main>
        </UserProvider>
    );
}
