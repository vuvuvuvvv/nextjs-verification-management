"use client"

import { DongHoProvider } from "@/context/dong-ho";
import { KiemDinhProvider } from "@/context/kiem-dinh";


export default function KiemDinhDongHoNuocLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <DongHoProvider>
        <KiemDinhProvider>
            {children}
        </KiemDinhProvider>
    </DongHoProvider>
}