"use client"

import { KiemDinhProvider } from "@/context/KiemDinh";
import { DongHoListProvider } from "@/context/ListDongHo";
import { INDEXED_DB_HIEU_CHUAN_NAME } from "@lib/system-constant";

export default function HieuChuanDongHoNuocLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <KiemDinhProvider>
            <DongHoListProvider dbName={INDEXED_DB_HIEU_CHUAN_NAME}>
                {children}
            </DongHoListProvider>
    </KiemDinhProvider>
}