"use client"

import { KiemDinhProvider } from "@/context/KiemDinhContext";
import { DongHoListProvider } from "@/context/ListDongHoContext";
import { INDEXED_DB_KIEM_DINH_NAME } from "@/lib/system-constant";

export default function KiemDinhDongHoNuocLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <DongHoListProvider dbName={INDEXED_DB_KIEM_DINH_NAME}> 
    <KiemDinhProvider>
        {children}
    </KiemDinhProvider>
    </DongHoListProvider>
}