"use client"

import { KiemDinhProvider } from "@/context/KiemDinh";
import { DongHoListProvider } from "@/context/ListDongHo";
import { INDEXED_DB_KIEM_DINH_NAME } from "@lib/system-constant";

export default function KiemDinhDongHoNuocLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <KiemDinhProvider>
            <DongHoListProvider dbName={INDEXED_DB_KIEM_DINH_NAME}>
                {children}
            </DongHoListProvider>
    </KiemDinhProvider>
}