"use client"

import { DongHoProvider } from "@/context/dong-ho";
import { KiemDinhProvider } from "@/context/kiem-dinh";
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { LinearProgress } from "@mui/material";

export default function KiemDinhDongHoNuocLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <DongHoProvider>
        <KiemDinhProvider>
            <SnackbarProvider maxSnack={3}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                classes={{
                    containerAnchorOriginBottomCenter: 'custom-snackbar-bottom-center',
                }}>
                {children}
            </SnackbarProvider>
        </KiemDinhProvider>
    </DongHoProvider>
}