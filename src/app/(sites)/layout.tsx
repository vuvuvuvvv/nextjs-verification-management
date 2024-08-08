"use client"

// Import Layout css
import layout from "@styles/scss/layouts/home-layout.module.scss";

// Import UI
import Navbar from "@/ui/navbar";
import { AppProvider  } from "@/context/app-context";


import { usePathname } from "next/navigation";

import { Suspense } from "react";
import Loading from "@/components/loading";

const routeTitles: { [key: string]: string } = {
    "/": "Trang chủ",
    "/about": "Về chng tôi",
    "/verification/watermeter/dn-bigger-than-15": "Kiểm định đồng hồ nước - DN > 15 m³/h",
    "/verification/watermeter/dn-smaller-than-15": "Kiểm định đồng hồ nước - DN < 15 m³/h",
    "/verification/watermeter/dn-bigger-than-15/new-process": "Thêm mới - DN > 15 m³/h",
    "/verification/watermeter/dn-smaller-than-15/new-process": "Thêm nhóm - DN < 15 m³/h",
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
                        <Suspense fallback={<Loading/>}>
                            {children}
                        </Suspense>
                    </div>
                </main>
            </AppProvider >
        </>
    );
}
