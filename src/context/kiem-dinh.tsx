import { DuLieuChayDongHo, DuLieuChayDiemLuuLuong, DuLieuCacLanChay } from '@lib/types';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface KiemDinhContextType {
    kiemDinhList: DuLieuChayDongHo;
    setKiemDinh: (tenLuuLuong: string, data: DuLieuChayDiemLuuLuong) => void;
    removeKiemDinh: (id: string) => void;
    duLieuLanChay: DuLieuCacLanChay;
    setDuLieuCacLanChay: (data: DuLieuCacLanChay) => void;
    themLanChay: () => void;
    xoaLanChay: (id: number) => void;
    resetLanChay: () => void;
}

const KiemDinhContext = createContext<KiemDinhContextType | undefined>(undefined);

export const KiemDinhProvider = ({ children }: { children: ReactNode }) => {
    const [kiemDinhList, setKiemDinhList] = useState<DuLieuChayDongHo>({});

    const setKiemDinh = (tenLuuLuong: string, data: DuLieuChayDiemLuuLuong) => {
        setKiemDinhList(prevState => ({
            ...prevState,
            [tenLuuLuong]: data,
        }));
    };

    const removeKiemDinh = (id: string) => {
        setKiemDinhList(prevState => {
            const newState = { ...prevState };
            delete newState[id];
            return newState;
        });
    };

    // Tối thiểu 3 lần chạy
    const [duLieuLanChay, setDuLieuCacLanChay] = useState<DuLieuCacLanChay>({
        1: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 },
        2: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 },
        3: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 }
    });

    const themLanChay = () => {
        setDuLieuCacLanChay(prev => ({
            ...prev,
            // Lấy ra key ở cuối + 1
            [Object.keys(duLieuLanChay)[Object.keys(duLieuLanChay).length - 1] + 1]: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 }
        }))
    };

    const xoaLanChay = (id: number) => {
        setDuLieuCacLanChay(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    const resetLanChay = () => {
        setDuLieuCacLanChay({
            1: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 },
            2: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 },
            3: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 }
        })
    };

    return (
        <KiemDinhContext.Provider value={{ kiemDinhList, removeKiemDinh, setKiemDinh, duLieuLanChay, setDuLieuCacLanChay, themLanChay, xoaLanChay, resetLanChay }}>
            {children}
        </KiemDinhContext.Provider>
    );
};

export const useKiemDinh = () => {
    const context = useContext(KiemDinhContext);
    if (context === undefined) {
        throw new Error('useKiemDinh must be used within a KiemDinhProvider');
    }
    return context;
};