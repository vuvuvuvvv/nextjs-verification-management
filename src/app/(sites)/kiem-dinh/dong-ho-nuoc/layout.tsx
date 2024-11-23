"use client"

import { DongHoProvider } from "@/context/DongHo";
import { KiemDinhProvider } from "@/context/KiemDinh";
import { DongHoListProvider } from "@/context/ListDongHo";

export default function KiemDinhDongHoNuocLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <KiemDinhProvider>
        <DongHoProvider>
            <DongHoListProvider>
                {children}
            </DongHoListProvider>
        </DongHoProvider>
    </KiemDinhProvider>
}