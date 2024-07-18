"use client"

// Import Layout css
import layout from "@styles/scss/layouts/home-layout.module.scss";

// Import UI
import Navbar from "@/ui/navbar";
import { UserProvider } from "@/context/user-context";


import { usePathname } from "next/navigation";

import { Suspense } from "react";
import Loading from "@/components/loading";

const routeTitles: { [key: string]: string } = {
    "/": "Trang chủ",
    "/about": "Về chng tôi",
    "/verification/watermeter/dn-bigger-than-32": "Kiểm định đồng hồ nước - DN > 32",
    "/verification/watermeter/dn-smaller-than-32": "Kiểm định đồng hồ nước - DN < 32",
    "/verification/watermeter/dn-bigger-than-32/new-process": "Thêm mẻ - DN > 32",
    "/verification/watermeter/dn-smaller-than-32/new-process": "Thêm mẻ - DN < 32",
    "/reset/password": "Đổi mật khẩu",
    "/reset/email": "Đổi email"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const pathname = usePathname();
    const title = routeTitles[pathname] || "Website Quản Lý Kiểm Định";

    return (
        <>
            <title>{title}</title>
            <UserProvider>
                <Navbar title={title} />
                <main className={layout["wraper"]}>
                    <div className={`${layout['content']} position-relative`}>
                        <Suspense fallback={<Loading/>}>
                            {children}
                        </Suspense>
                    </div>
                </main>
            </UserProvider>
        </>
    );
}
