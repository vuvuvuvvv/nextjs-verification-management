"use client"

import { DongHoProvider } from "@/context/DongHo";
import { KiemDinhProvider } from "@/context/KiemDinh";

export default function KiemDinhDongHoNuocLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <DongHoProvider>
        <KiemDinhProvider>
            {children}
        </KiemDinhProvider>
    </DongHoProvider>
}