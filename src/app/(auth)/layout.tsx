"use client"

import { ACCESS_LINKS } from '@/lib/system-constant';
import layout from '@styles/scss/layouts/auth-layout.module.scss'
import { usePathname } from "next/navigation";

const routeTitles: { [key: string]: string } = {
    ...Object.fromEntries(
        Object.entries(ACCESS_LINKS).map(([key, val]) => {
            return [`${val.src}`, val.title]; 
        })
    )
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const title = routeTitles[pathname] || "Website Quản Lý Kiểm Định";
    return (
        <>
            <title>{title}</title>
            <div className={`container-fluid ${layout['wrap-container']}`}>
                <div className={`row m-0 p-0 d-flex justify-content-center`}>
                    <div className={`col-12 col-sm-10 col-lg-7 col-xl-6 ${layout.wrapper}`}>
                        <div className={`${layout['box-form']} p-4 p-sm-5 w-100`}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}