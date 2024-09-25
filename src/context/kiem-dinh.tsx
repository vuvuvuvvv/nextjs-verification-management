import { TITLE_LUU_LUONG } from '@lib/system-constant';
import { isDongHoDatTieuChuan } from '@lib/system-function';
import { DuLieuChayDongHo, DuLieuChayDiemLuuLuong, DuLieuMotLanChay, DuLieuCacLanChay } from '@lib/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface KiemDinhContextType {
    duLieuKiemDinhCacLuuLuong: DuLieuChayDongHo;
    formHieuSaiSo: { hss: number | null }[];
    setFormHieuSaiSo: (form: { hss: number | null }[]) => void;
    ketQua: boolean | null;
    setKetQua: (ketQua: boolean | null) => void;
    lanChayMoi: DuLieuCacLanChay;
    updateLuuLuong: (q: { title: string; value: string }, duLieuChay: DuLieuCacLanChay) => void;

    setDuLieuKiemDinh: (tenLuuLuong: string, data: DuLieuChayDiemLuuLuong | null) => void;

    removeKiemDinh: (id: string) => void;
    getDuLieuChayCuaLuuLuong: (q: { title: string; value: string }) => DuLieuCacLanChay;
    themLanChayCuaLuuLuong: (q: { title: string; value: string }) => DuLieuCacLanChay;
    xoaLanChayCuaLuuLuong: (q: { title: string; value: string }, id: number | string) => DuLieuCacLanChay;
    resetLanChay: (q: { title: string; value: string }) => DuLieuCacLanChay;
    getDuLieuKiemDinhJSON: () => string;
}

const KiemDinhContext = createContext<KiemDinhContextType | undefined>(undefined);

export const KiemDinhProvider = ({ children }: { children: ReactNode }) => {
    const lanChayMoi = {
        1: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 },
        2: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 },
        3: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 }
    };

    const initialDuLieuKiemDinhCacLuuLuong: DuLieuChayDongHo = {
        [TITLE_LUU_LUONG.q3]: null,
        [TITLE_LUU_LUONG.q2]: null,
        [TITLE_LUU_LUONG.q1]: null,
        [TITLE_LUU_LUONG.qn]: null,
        [TITLE_LUU_LUONG.qt]: null,
        [TITLE_LUU_LUONG.qmin]: null,
    };

    const [duLieuKiemDinhCacLuuLuong, setDuLieuKiemDinhCacLuuLuong] = useState<DuLieuChayDongHo>(initialDuLieuKiemDinhCacLuuLuong);
    const [formHieuSaiSo, setFormHieuSaiSo] = useState<{ hss: number | null }[]>([
        { hss: null },
        { hss: null },
        { hss: null },
    ]);
    const [ketQua, setKetQua] = useState<boolean | null>(null);

    // useEffect(() => {
    //     console.log("dlkdcll: ", duLieuKiemDinhCacLuuLuong);
    // }, [duLieuKiemDinhCacLuuLuong]);


    const setDuLieuKiemDinh = (tenLuuLuong: string, data: DuLieuChayDiemLuuLuong | null) => {
        setDuLieuKiemDinhCacLuuLuong(prevState => ({
            ...prevState,
            [tenLuuLuong]: data,
        }));
    };

    const updateLuuLuong = (q: { title: string; value: string }, duLieuChay: DuLieuCacLanChay) => {
        const value = isNaN(Number(q.value)) ? 0 : Number(q.value);
        const keyOfLuuLuongDHDienTu = [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.q1];
        if (q.title) {
            let key = q.title;
            const isDHDienTu = keyOfLuuLuongDHDienTu.includes(q.title);
            setDuLieuKiemDinhCacLuuLuong(prevState => {
                return {
                    ...prevState,
                    [key]: {
                        value: value,
                        lan_chay: duLieuChay
                    },
                    [!isDHDienTu ? TITLE_LUU_LUONG.q3 : TITLE_LUU_LUONG.qn]: null,
                    [!isDHDienTu ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt]: null,
                    [!isDHDienTu ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin]: null,
                }
            })
        };
    };


    const removeKiemDinh = (id: string) => {
        setDuLieuKiemDinhCacLuuLuong(prevState => {
            const newState = { ...prevState };
            delete newState[id];
            return newState;
        });
    };

    const getDuLieuChayCuaLuuLuong = (q: { title: string; value: string }) => {
        return duLieuKiemDinhCacLuuLuong[q.title]?.lan_chay || null;
    }

    const themLanChayCuaLuuLuong = (q: { title: string; value: string }) => {
        let updatedData: DuLieuChayDongHo = duLieuKiemDinhCacLuuLuong;
        if (q.title) {
            let key = q.title;
            let data = duLieuKiemDinhCacLuuLuong[key]?.lan_chay;

            if (data) {
                setDuLieuKiemDinhCacLuuLuong(prevState => {
                    const existingData = prevState[key] || { value: 0, lan_chay: lanChayMoi };
                    updatedData = {
                        ...prevState,
                        [key]: {
                            ...existingData,
                            lan_chay: {
                                ...data,
                                [Number(Object.keys(data)[Object.entries(data).length - 1]) + 1]: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 }
                            }
                        }
                    }
                    return updatedData;
                });
            }
        }
        return updatedData[q.title]?.lan_chay as DuLieuCacLanChay;
    };

    const xoaLanChayCuaLuuLuong = (q: { title: string; value: string }, id: number | string) => {
        let updatedData: DuLieuChayDongHo = duLieuKiemDinhCacLuuLuong;
        const getId = typeof id === 'string' ? parseInt(id) : id;
        if (q.title) {
            let key = q.title;
            let data = duLieuKiemDinhCacLuuLuong[key]?.lan_chay;


            if (data) {
                setDuLieuKiemDinhCacLuuLuong(prevState => {
                    const existingData = prevState[key] || { value: 0, lanChay: lanChayMoi };
                    let existingLanChay = prevState[key]?.lan_chay || lanChayMoi;

                    if ((existingLanChay as Record<number, DuLieuMotLanChay>)[getId]) {
                        delete (existingLanChay as Record<number, DuLieuMotLanChay>)[getId];
                    }

                    let updatedData = {
                        ...prevState,
                        [key]: {
                            ...existingData,
                            lan_chay: {
                                ...existingLanChay,
                            }
                        }
                    };

                    return updatedData;
                });
            }
        }
        return updatedData[q.title]?.lan_chay as DuLieuCacLanChay;
    };

    const resetLanChay = (q: { title: string; value: string }) => {
        let updatedData: DuLieuChayDongHo = duLieuKiemDinhCacLuuLuong;
        if (q.title) {
            let key = q.title;
            let data = duLieuKiemDinhCacLuuLuong[key]?.lan_chay;

            if (data) {
                setDuLieuKiemDinhCacLuuLuong(prevState => {
                    const existingData = prevState[key] || { value: 0, lan_chay: lanChayMoi };

                    updatedData = {
                        ...prevState,
                        [key]: {
                            ...existingData,
                            lan_chay: lanChayMoi
                        }
                    }

                    return updatedData;
                });
            }
        }
        return updatedData[q.title]?.lan_chay as DuLieuCacLanChay;
    };

    const getDuLieuKiemDinhJSON = () => {
        return JSON.stringify({
            hieu_sai_so: formHieuSaiSo,
            du_lieu: duLieuKiemDinhCacLuuLuong,
            ket_qua: ketQua
        });
    }

    return (
        <KiemDinhContext.Provider value={{
            duLieuKiemDinhCacLuuLuong,
            formHieuSaiSo,
            lanChayMoi,
            ketQua,
            updateLuuLuong,
            removeKiemDinh,
            setDuLieuKiemDinh, 
            setKetQua,
            themLanChayCuaLuuLuong,
            getDuLieuChayCuaLuuLuong: (q: { title: string; value: string; }) => {
                return getDuLieuChayCuaLuuLuong(q) || lanChayMoi;
            },
            xoaLanChayCuaLuuLuong,
            resetLanChay,
            getDuLieuKiemDinhJSON,
            setFormHieuSaiSo, // Added to context value
        }}>
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