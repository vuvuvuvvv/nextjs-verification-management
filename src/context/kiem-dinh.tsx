import { TITLE_LUU_LUONG } from '@lib/system-constant';
import { DuLieuChayDongHo, DuLieuChayDiemLuuLuong, DuLieuMotLanChay, DuLieuCacLanChay } from '@lib/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface KiemDinhContextType {
    duLieuKiemDinhCacLuuLuong: DuLieuChayDongHo;
    lanChayMoi: DuLieuCacLanChay;
    updateLuuLuong: (q: { title: string; value: string }) => void;

    // <=> DuLieuChayDongHo = Record<string, DuLieuChayDiemLuuLuong>
    setDuLieuKiemDinh: (tenLuuLuong: string, data: DuLieuChayDiemLuuLuong | null) => void;

    removeKiemDinh: (id: string) => void;
    // duLieuLanChay: DuLieuMotLanChay;
    // setDuLieuMotLanChayCuaLuuLuong: (data: DuLieuMotLanChay) => void;
    themLanChayCuaLuuLuong: (q: { title: string; value: string }) => void;
    getDuLieuChayCuaLuuLuong: (q: { title: string; value: string }) => DuLieuCacLanChay;
    // xoaLanChayCuaLuuLuong: (q: { title: string; value: string }, id: number) => void;
    // resetLanChay: () => void;
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

    // useEffect(() => {
    //     console.log("dlkdcll: ", duLieuKiemDinhCacLuuLuong);
    // }, [duLieuKiemDinhCacLuuLuong]);


    const setDuLieuKiemDinh = (tenLuuLuong: string, data: DuLieuChayDiemLuuLuong | null) => {
        setDuLieuKiemDinhCacLuuLuong(prevState => ({
            ...prevState,
            [tenLuuLuong]: data,
        }));
    };

    const updateLuuLuong = (q: { title: string; value: string }) => {
        const value = isNaN(Number(q.value)) ? 0 : Number(q.value);
        const keyOfLuuLuongDHDienTu = [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.q1];
        if (q.title) {
            let key = q.title;
            const isDHDienTu = keyOfLuuLuongDHDienTu.includes(q.title);
            setDuLieuKiemDinhCacLuuLuong(prevState => {
                const existingData = prevState[key] || { value: 0, lanChay: lanChayMoi };
                return {
                    ...prevState,
                    [key]: {
                        ...existingData,
                        value: value,
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
        return duLieuKiemDinhCacLuuLuong[q.title]?.lanChay || null;
    }

    const themLanChayCuaLuuLuong = (q: { title: string; value: string }) => {

        if (q.title) {
            let key = q.title;
            let data = duLieuKiemDinhCacLuuLuong[key]?.lanChay;

            if (data) {
                setDuLieuKiemDinhCacLuuLuong(prevState => {
                    const existingData = prevState[key] || { value: 0, lanChay: lanChayMoi };
                    return {
                        ...prevState,
                        [key]: {
                            ...existingData,
                            lanChay: {
                                ...data,
                                [Number(Object.keys(data)[Object.entries(data).length - 1]) + 1]: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 }
                            }
                        }
                    }
                });
                updateLuuLuong(q);
            }
        }

    };

    // TODO: 
    // const xoaLanChayCuaLuuLuong = (q: { title: string; value: string }, id: number) => {
    //     setDuLieuMotLanChayCuaLuuLuong(prev => {
    //         const newState = { ...prev };
    //         delete newState[id];
    //         return newState;
    //     });

    //     setDuLieuKiemDinhCacLuuLuong(prevState => {
    //         const key = [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.q1].includes(q.title)
    //             ? q.title
    //             : TITLE_LUU_LUONG[q.title as keyof typeof TITLE_LUU_LUONG];

    //         if (prevState[key]) {
    //             const newData = { ...prevState[key] };
    //             delete newData.lanChay[id];
    //             return {
    //                 ...prevState,
    //                 [key]: newData,
    //             };
    //         }
    //         return prevState;
    //     });
    // };

    // TODO:
    // const resetLanChay = () => {
    //     setDuLieuMotLanChayCuaLuuLuong({
    //         1: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 },
    //         2: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 },
    //         3: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 }
    //     })
    // };

    return (
        <KiemDinhContext.Provider value={{
            duLieuKiemDinhCacLuuLuong,
            lanChayMoi,
            updateLuuLuong,
            removeKiemDinh,
            setDuLieuKiemDinh,
            themLanChayCuaLuuLuong,
            getDuLieuChayCuaLuuLuong: (q: { title: string; value: string; }) => {
                return getDuLieuChayCuaLuuLuong(q) || lanChayMoi;
            },
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