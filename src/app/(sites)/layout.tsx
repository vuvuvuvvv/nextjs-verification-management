"use client"

// Import Layout css
import layout from "@styles/scss/layouts/home-layout.module.scss";

import Loading from "@/components/Loading";

// const Navbar = dynamic(() => import('@/components/ui/navbar'));

const BackToTopButton = dynamic(() => import('@/components/ui/BackToTopButton'), {
    ssr: false,
});

const AppProvider = dynamic(() => import("@/context/AppContext").then(mod => mod.AppProvider), {
    ssr: false,
    loading: () => <Loading />,
});

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { ACCESS_LINKS } from "@lib/system-constant";

const routeTitles: { [key: string]: string } = {
    ...Object.fromEntries(
        Object.entries(ACCESS_LINKS).map(([key, val]) => {
            return [`${val.src}`, val.title]; 
        })
    )
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
