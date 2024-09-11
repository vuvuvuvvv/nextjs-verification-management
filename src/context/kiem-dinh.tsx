import { TITLE_LUU_LUONG } from '@lib/system-constant';
import { DuLieuChayDongHo, DuLieuChayDiemLuuLuong, DuLieuCacLanChay } from '@lib/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface KiemDinhContextType {
    duLieuKiemDinhCacLuuLuong: DuLieuChayDongHo;

    updateLuuLuong: (q: { title: string; value: string }) => void;

    // <=> DuLieuChayDongHo = Record<string, DuLieuChayDiemLuuLuong>
    setDuLieuKiemDinh: (tenLuuLuong: string, data: DuLieuChayDiemLuuLuong | null) => void;

    removeKiemDinh: (id: string) => void;
    duLieuLanChay: DuLieuCacLanChay;
    setDuLieuCacLanChay: (data: DuLieuCacLanChay) => void;
    themLanChay: (q: { title: string; value: string }) => void;
    xoaLanChay: (q: { title: string; value: string }, id: number) => void;
    resetLanChay: () => void;
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

    useEffect(() => {
        console.log("init: ", initialDuLieuKiemDinhCacLuuLuong);
        console.log("dlkdcll: ", duLieuKiemDinhCacLuuLuong);
    }, [duLieuKiemDinhCacLuuLuong]);


    const setDuLieuKiemDinh = (tenLuuLuong: string, data: DuLieuChayDiemLuuLuong | null) => {
        setDuLieuKiemDinhCacLuuLuong(prevState => ({
            ...prevState,
            [tenLuuLuong]: data,
        }));
    };

    const updateLuuLuong = (q: { title: string; value: string }) => {
        const value = isNaN(Number(q.value)) ? 0 : Number(q.value);
        const newData = { value: value, lanchay: lanChayMoi };

        console.log("updatee q: ", q);

        let key: string;
        if ([TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.q1].includes(q.title)) {
            key = q.title;
        } else {
            key = TITLE_LUU_LUONG[q.title as keyof typeof TITLE_LUU_LUONG];
        }

        // TODO: CHECK: TỰ NHIÊN CHÈN THÊM UNDEFINED - CHECKED
        setDuLieuKiemDinhCacLuuLuong(prevState => ({
            ...prevState,
            [key]: {
                value: value,
                lanChay: lanChayMoi,
            },
        }));

    };

    const removeKiemDinh = (id: string) => {
        setDuLieuKiemDinhCacLuuLuong(prevState => {
            const newState = { ...prevState };
            delete newState[id];
            return newState;
        });
    };

    // Tối thiểu 3 lần chạy
    const [duLieuLanChay, setDuLieuCacLanChay] = useState<DuLieuCacLanChay>(lanChayMoi);


    const themLanChay = (q: { title: string; value: string }) => {

        if (!Object.values(TITLE_LUU_LUONG).includes(q.title)) {
            console.log("Err")
            return;

        }
        console.log(duLieuKiemDinhCacLuuLuong);

 
        // TODO: Add lanCHay
        // setDuLieuCacLanChay(prev => {

        //     const newKey = Math.max(...Object.keys(prev).map(Number)) + 1;

        //     return {

        //         ...prev,
        //         [newKey]: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 }
        //     };
        // });

        // setDuLieuKiemDinhCacLuuLuong(prevState => {
        //     const key = q.title;


        //     const existingData = prevState[key] || { value: 0, lanChay: {} };
        //     const newKey = Math.max(...Object.keys(existingData.lanChay).map(Number)) + 1;
        //     const newData = { ...existingData, lanChay: { ...existingData.lanChay, [newKey]: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 } } };


        //     console.log("exdt: ",key,prevState);
        //     return {
        //         ...prevState,
        //         [key]: newData,
        //     };
        // });

    };


    const xoaLanChay = (q: { title: string; value: string }, id: number) => {
        setDuLieuCacLanChay(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });

        setDuLieuKiemDinhCacLuuLuong(prevState => {
            const key = [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.q1].includes(q.title)
                ? q.title
                : TITLE_LUU_LUONG[q.title as keyof typeof TITLE_LUU_LUONG];

            if (prevState[key]) {
                const newData = { ...prevState[key] };
                delete newData.lanChay[id];
                return {
                    ...prevState,
                    [key]: newData,
                };
            }
            return prevState;
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
        <KiemDinhContext.Provider value={{
            duLieuKiemDinhCacLuuLuong,
            updateLuuLuong,
            removeKiemDinh,
            setDuLieuKiemDinh,
            duLieuLanChay,
            setDuLieuCacLanChay,
            themLanChay,
            xoaLanChay,
            resetLanChay
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