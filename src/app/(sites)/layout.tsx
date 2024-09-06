"use client"

// Import Layout css
import layout from "@styles/scss/layouts/home-layout.module.scss";

// Import UI
import Navbar from "@/components/ui/navbar";
import { AppProvider, useUser } from "@/context/app-context";

import { usePathname } from "next/navigation";
import BackToTopButton from "@/components/ui/BackToTopButton";

const routeTitles: { [key: string]: string } = {
    "/": "Trang chủ",
    "/about": "Về chng tôi",
    "/kiem-dinh/dong-ho-nuoc/dn-bigger-than-15": "Kiểm định đồng hồ nước - DN > 15 m³/h",
    "/kiem-dinh/dong-ho-nuoc/dn-smaller-than-15": "Kiểm định đồng hồ nước - DN < 15 m³/h",
    "/kiem-dinh/dong-ho-nuoc/dn-bigger-than-15/them-moi": "Thêm mới - DN > 15 m³/h",
    "/kiem-dinh/dong-ho-nuoc/dn-smaller-than-15/them-moi": "Thêm nhóm - DN < 15 m³/h",
    "/change/password": "Đổi mật khẩu",
    "/change/email": "Đổi email"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const pathname = usePathname();
    const title = routeTitles[pathname] || "Website Quản Lý Kiểm Định";
    return (
        <>
            <title>{title}</title>
            <AppProvider >
                <Navbar title={title} />
                <main className={layout["wraper"]}>
                    <div className={`${layout['content']} position-relative p-0 pb-4`}>
                        {children}
                    </div>
                </main>
                <BackToTopButton />
            </AppProvider >
        </>
    );
}
