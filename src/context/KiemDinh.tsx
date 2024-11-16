import { TITLE_LUU_LUONG } from '@lib/system-constant';
import { DuLieuChayDongHo, DuLieuChayDiemLuuLuong, DuLieuMotLanChay, DuLieuCacLanChay, VChuanDongBoCacLL } from '@lib/types';
import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';

interface KiemDinhContextType {
    duLieuKiemDinhCacLuuLuong: DuLieuChayDongHo;
    initialDuLieuKiemDinhCacLuuLuong: DuLieuChayDongHo;
    initialFormHieuSaiSo: { hss: number | null }[];
    formHieuSaiSo: { hss: number | null }[];
    setFormHieuSaiSo: (form: { hss: number | null }[]) => void;
    ketQua: boolean | null;
    setKetQua: (ketQua: boolean | null) => void;
    lanChayMoi: DuLieuCacLanChay;
    updateLuuLuong: (q: { title: string; value: string }, duLieuChay: DuLieuCacLanChay) => void;

    setDuLieuKiemDinhChoMotLuuLuong: (tenLuuLuong: string, data: DuLieuChayDiemLuuLuong | null) => void;
    setDuLieuKiemDinhCacLuuLuong: (duLieu: DuLieuChayDongHo) => void;
    updateSoDongHoChuan: (q: { title: string; value: string }, index: number, field: keyof DuLieuMotLanChay, value: string) => void;
    removeKiemDinh: (id: string) => void;
    getDuLieuChayCuaLuuLuong: (q: { title: string; value: string }) => DuLieuCacLanChay;
    themLanChayCuaLuuLuong: (q: { title: string; value: string }) => DuLieuCacLanChay;
    xoaLanChayCuaLuuLuong: (q: { title: string; value: string }, id: number | string) => DuLieuCacLanChay;
    resetLanChay: (q: { title: string; value: string }) => DuLieuCacLanChay;
    getDuLieuKiemDinhJSON: () => string;
    vChuanDongBoCacLL: VChuanDongBoCacLL;
}

const KiemDinhContext = createContext<KiemDinhContextType | undefined>(undefined);

export const KiemDinhProvider = ({ children }: { children: ReactNode }) => {
    const randomT = parseFloat((Math.random() * (27 - 22) + 22).toFixed(1));

    const lanChayMoi: DuLieuCacLanChay = {
        1: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: randomT, Tc: randomT, },
    };

    const initialDuLieuKiemDinhCacLuuLuong: DuLieuChayDongHo = {
        [TITLE_LUU_LUONG.q3]: null,
        [TITLE_LUU_LUONG.q2]: null,
        [TITLE_LUU_LUONG.q1]: null,
        [TITLE_LUU_LUONG.qn]: null,
        [TITLE_LUU_LUONG.qt]: null,
        [TITLE_LUU_LUONG.qmin]: null,
    };

    const initialFormHieuSaiSo: { hss: number | null }[] = [
        { hss: null },
        { hss: null },
        { hss: null },
    ];

    const [duLieuKiemDinhCacLuuLuong, setDuLieuKiemDinhCacLuuLuong] = useState<DuLieuChayDongHo>(initialDuLieuKiemDinhCacLuuLuong);
    const previousDuLieuRef = useRef<DuLieuChayDongHo>(duLieuKiemDinhCacLuuLuong);

    const [formHieuSaiSo, setFormHieuSaiSo] = useState<{ hss: number | null }[]>(initialFormHieuSaiSo);
    const [ketQua, setKetQua] = useState<boolean | null>(null);
    const [vChuanDongBoCacLL, setVChuanDongBoCacLL] = useState<VChuanDongBoCacLL>({})

    useEffect(() => {
        console.log("vchuan: ", vChuanDongBoCacLL);
    }, [vChuanDongBoCacLL]);

    // useEffect(() => {
    //     console.log("dlkdcll: ", duLieuKiemDinhCacLuuLuong);
    // }, [duLieuKiemDinhCacLuuLuong]);

    const setDuLieuKiemDinhChoMotLuuLuong = (tenLuuLuong: string, data: DuLieuChayDiemLuuLuong | null) => {
        if (previousDuLieuRef.current[tenLuuLuong] !== data) {
            setDuLieuKiemDinhCacLuuLuong(prevState => ({
                ...prevState,
                [tenLuuLuong]: data,
            }));
            previousDuLieuRef.current = {
                ...previousDuLieuRef.current,
                [tenLuuLuong]: data,
            };
        }
    };

    const updateSoDongHoChuan = (q: { title: string; value: string }, index: number, field: keyof DuLieuMotLanChay, value: string) => {
        const qValue = isNaN(Number(q.value)) ? 0 : Number(q.value);
        if (q.title && qValue && index > 0 && field && value) {
            let key = q.title;

            setVChuanDongBoCacLL(prevState => {
                const prevVLL = prevState[key] || null;
                const prevV = prevVLL ? prevVLL[index] : null;
                const newState: VChuanDongBoCacLL = {
                    ...prevState,
                    [key]: {
                        ...prevVLL,
                        [index]: prevV ? { ...prevV, [field]: parseFloat(value) } : { Vc1: 0, Vc2: 0, [field]: parseFloat(value) },
                    }
                };
                return newState;
            });
        }
    }

    const updateLuuLuong = (q: { title: string; value: string }, duLieuChay: DuLieuCacLanChay) => {
        const value = isNaN(Number(q.value)) ? 0 : Number(q.value);
        const keyOfLuuLuongDHDienTu = [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.q1];
        if (q.title) {
            let key = q.title;
            const isDHDienTu = keyOfLuuLuongDHDienTu.includes(q.title);

            setDuLieuKiemDinhCacLuuLuong(prevState => {
                const newState = {
                    ...prevState,
                    [key]: {
                        value: value,
                        lan_chay: {
                            ...duLieuChay
                        }
                    },
                    [!isDHDienTu ? TITLE_LUU_LUONG.q3 : TITLE_LUU_LUONG.qn]: null,
                    [!isDHDienTu ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt]: null,
                    [!isDHDienTu ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin]: null,
                };

                // Check if the new state is different from the previous state
                if (previousDuLieuRef.current != newState) {
                    previousDuLieuRef.current = newState;
                    return newState;
                }
                return prevState;
            });
        }
    };


    const removeKiemDinh = (id: string) => {
        setDuLieuKiemDinhCacLuuLuong(prevState => {
            const newState = { ...prevState };
            delete newState[id];
            return newState;
        });
    };

    // TODO: Update vchuan here
    const getDuLieuChayCuaLuuLuong = (q: { title: string; value: string }) => {
        let data = duLieuKiemDinhCacLuuLuong[q.title]?.lan_chay;

        if (data) {
            const newDLKD = Object.entries(data).reduce((acc: Record<number, DuLieuMotLanChay>, [key, val]) => {
                acc[Number(key)] = {
                    ...val,
                    ...(vChuanDongBoCacLL?.[q.title]?.[Number(key)] || {})
                };
                return acc;
            }, {})
            // console.log("newDLKD: ", newDLKD);
            return newDLKD;
        }

        return {
            1: {
                V1: 0,
                V2: 0,
                Vc1: 0,
                Vc2: 0,
                Tdh: randomT,
                Tc: randomT,
                ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
            }
        };
    }

    const themLanChayCuaLuuLuong = (q: { title: string; value: string }) => {
        let updatedData: DuLieuChayDongHo = duLieuKiemDinhCacLuuLuong;
        if (q.title) {
            let key = q.title;
            let data = duLieuKiemDinhCacLuuLuong[key]?.lan_chay;
            if (data) {
                let latest_data = data[Number(Object.keys(data)[Object.entries(data).length - 1])].V2
                const newIndexOfLanChay = Number(Object.keys(data)[Object.entries(data).length - 1]) + 1;
                setDuLieuKiemDinhCacLuuLuong(prevState => {
                    const existingData = prevState[key] || {
                        value: 0, lan_chay: {
                            1: {
                                V1: 0,
                                V2: 0,
                                Vc1: 0,
                                Vc2: 0,
                                Tdh: randomT,
                                Tc: randomT,
                                ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
                            }
                        }
                    };
                    updatedData = {
                        ...prevState,
                        [key]: {
                            ...existingData,
                            lan_chay: {
                                ...data,
                                [newIndexOfLanChay]: {
                                    V1: latest_data || 0,
                                    V2: 0,
                                    Vc1: 0,
                                    Vc2: 0,
                                    Tdh: randomT,
                                    Tc: randomT,
                                    ...(vChuanDongBoCacLL?.[q.title]?.[newIndexOfLanChay] || {})
                                }
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
                    const existingData = prevState[key] || {
                        value: 0, lanChay: {
                            1: {
                                V1: 0,
                                V2: 0,
                                Vc1: 0,
                                Vc2: 0,
                                Tdh: randomT,
                                Tc: randomT,
                                ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
                            }
                        }
                    };
                    let existingLanChay = prevState[key]?.lan_chay || {
                        1: {
                            V1: 0,
                            V2: 0,
                            Vc1: 0,
                            Vc2: 0,
                            Tdh: randomT,
                            Tc: randomT,
                            ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
                        }
                    };

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
        return updatedData[q.title]?.lan_chay as DuLieuCacLanChay || {
            1: {
                V1: 0,
                V2: 0,
                Vc1: 0,
                Vc2: 0,
                Tdh: randomT,
                Tc: randomT,
                ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
            }
        };
    };

    const resetLanChay = (q: { title: string; value: string }) => {
        let updatedData: DuLieuChayDongHo = duLieuKiemDinhCacLuuLuong;
        if (q.title) {
            let key = q.title;
            let data = duLieuKiemDinhCacLuuLuong[key]?.lan_chay;

            if (data) {
                setDuLieuKiemDinhCacLuuLuong(prevState => {
                    const existingData = prevState[key] || {
                        value: 0, lan_chay: {
                            1: {
                                V1: 0,
                                V2: 0,
                                Vc1: 0,
                                Vc2: 0,
                                Tdh: randomT,
                                Tc: randomT,
                                ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
                            }
                        }
                    };

                    updatedData = {
                        ...prevState,
                        [key]: {
                            ...existingData,
                            lan_chay: {
                                1: {
                                    V1: 0,
                                    V2: 0,
                                    Vc1: 0,
                                    Vc2: 0,
                                    Tdh: randomT,
                                    Tc: randomT,
                                    ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
                                }
                            }
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
            initialFormHieuSaiSo,
            initialDuLieuKiemDinhCacLuuLuong,
            formHieuSaiSo,
            lanChayMoi,
            ketQua,
            updateLuuLuong,
            removeKiemDinh,
            setDuLieuKiemDinhChoMotLuuLuong,
            updateSoDongHoChuan,
            setDuLieuKiemDinhCacLuuLuong,
            setKetQua,
            themLanChayCuaLuuLuong,
            getDuLieuChayCuaLuuLuong: (q: { title: string; value: string; }) => {
                return getDuLieuChayCuaLuuLuong(q) || {
                    1: {
                        V1: 0,
                        V2: 0,
                        Vc1: 0,
                        Vc2: 0,
                        Tdh: randomT,
                        Tc: randomT,
                        ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
                    }
                };
            },
            xoaLanChayCuaLuuLuong,
            resetLanChay,
            getDuLieuKiemDinhJSON,
            setFormHieuSaiSo, // Added to context value
            vChuanDongBoCacLL
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