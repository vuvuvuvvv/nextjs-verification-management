"use client"

// Import Layout css
import layout from "@styles/scss/layouts/home-layout.module.scss";

// Import UI
import Navbar from "@/ui/navbar";
import { UserProvider } from "@/context/user-context";


import { usePathname } from "next/navigation";
import Head from "next/head";

const routeTitles: { [key: string]: string } = {
    "/": "Trang chủ",
    "/about": "Về chng tôi",
    "/contact": "Liên hệ",
    "/kiem-dinh/dong-ho-nuoc": "Kiểm định đồng hồ nước",
    "/reset/password": "Đổi mật khẩu",
    "/reset/email": "Đổi email"
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const pathname = usePathname();
    const title = routeTitles[pathname] || "Trang kiểm định";

    return (
        <>
            <title>{title}</title>
            <UserProvider>
                <Navbar title={title} />
                <main className={layout["wraper"]}>
                    <div className={`${layout['content']}`}>
                        {children}
                    </div>
                </main>
            </UserProvider>
        </>
    );
}
