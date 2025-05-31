import { TITLE_LUU_LUONG } from '@lib/system-constant';
import { getHieuSaiSo, getLastDayOfMonthInFuture, isDongHoDatTieuChuan } from '@lib/system-function';
import { DuLieuChayDongHo, DuLieuChayDiemLuuLuong, DuLieuMotLanChay, DuLieuCacLanChay, VChuanDongBoCacLL, DongHo } from '@lib/types';
import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';
import { useDongHoList } from './ListDongHoContext';
import dayjs from 'dayjs';

type LuuLuong = {
    isDHDienTu: boolean,
    q3Orn: { title: string; value: string } | null,
    q2Ort: { title: string; value: string } | null,
    q1Ormin: { title: string; value: string } | null
};

interface KiemDinhContextType {
    duLieuKiemDinhCacLuuLuong: DuLieuChayDongHo;
    initialDuLieuKiemDinhCacLuuLuong: DuLieuChayDongHo;
    initialFormHieuSaiSo: { hss: number | null }[];
    initialFormMf: { mf: number | null }[]
    formHieuSaiSo: { hss: number | null }[];
    setFormHieuSaiSo: (form: { hss: number | null }[]) => void;
    formMf: { mf: number | null }[];
    setFormMf: (form: { mf: number | null }[]) => void;
    ketQua: boolean | null;
    setKetQua: (ketQua: boolean | null) => void;
    lanChayMoi: DuLieuCacLanChay;
    luuLuong: LuuLuong | null;
    setLuuLuong: (luuLuong: LuuLuong) => void;
    updateLuuLuong: (q: { title: string; value: string }, duLieuChay: DuLieuCacLanChay, indexDongHo: number) => void;
    addMoreDongHo: (amount: number) => void;
    removeMoreDongHo: (amount: number) => void;
    setDuLieuKiemDinhCacLuuLuong: (duLieu: DuLieuChayDongHo) => void;
    updateSoDongHoChuan: (q: { title: string; value: string }, index: number, field: keyof DuLieuMotLanChay, value: string) => void;
    removeKiemDinh: (id: string) => void;
    getDuLieuChayCuaLuuLuong: (q: { title: string; value: string }, indexDongHo: number) => DuLieuCacLanChay;
    themLanChayCuaLuuLuong: (q: { title: string; value: string }) => void;
    xoaLanChayCuaLuuLuong: (q: { title: string; value: string }) => void;
    resetLanChay: (q: { title: string; value: string }) => DuLieuCacLanChay;
    getDuLieuKiemDinhJSON: (formHieuSaiSoProp?: { hss: number | null }[]) => string;
    vChuanDongBoCacLL: VChuanDongBoCacLL;
}

const KiemDinhContext = createContext<KiemDinhContextType | undefined>(undefined);

export const KiemDinhProvider = ({ children }: { children: ReactNode }) => {
    const { dongHoList, setDongHoList } = useDongHoList();

    const [randomT, setRandomT] = useState(parseFloat((Math.random() * (25 - 22) + 22).toFixed(1)));

    const debounceSetDHListRef = useRef<NodeJS.Timeout | null>(null)
    const formValues = {
        V1: 0,
        V2: 0,
        Vc1: 0,
        Vc2: 0,
        Vc: 0,
        Tdh: randomT,
        Tc: randomT
    };

    const lanChayMoi: DuLieuCacLanChay = {
        1: formValues,
        2: formValues,
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
        { hss: null },      // Q3-n
        { hss: null },      // Q2-t
        { hss: null },      // Q1-min
    ];

    const initialFormMf: { mf: number | null }[] = [
        { mf: null },      // Q3-n
        { mf: null },      // Q2-t
        { mf: null },      // Q1-min
    ];

    const [duLieuKiemDinhCacLuuLuong, setDuLieuKiemDinhCacLuuLuong] = useState<DuLieuChayDongHo>(initialDuLieuKiemDinhCacLuuLuong);

    // Lưu dữ liệu Q1 2 3 if isDHDienTu hoặc Qn t min
    const [luuLuong, setLuuLuong] = useState<LuuLuong | null>(null);

    // useEffect(() => {
    //     console.log("1", dongHoList);
    // }, [duLieuKiemDinhCacLuuLuong])

    const [formHieuSaiSo, setFormHieuSaiSo] = useState<{ hss: number | null }[]>(initialFormHieuSaiSo);
    const [formMf, setFormMf] = useState<{ mf: number | null }[]>(initialFormMf);
    const [ketQua, setKetQua] = useState<boolean | null>(null);
    const [vChuanDongBoCacLL, setVChuanDongBoCacLL] = useState<VChuanDongBoCacLL>({})

    const updateSoDongHoChuan = (q: { title: string; value: string }, soLan: number, field: keyof DuLieuMotLanChay, value: string) => {
        const qValue = isNaN(Number(q.value)) ? 0 : Number(q.value);
        if (q.title && qValue && soLan > 0 && field && value) {
            let key = q.title;

            setVChuanDongBoCacLL(prevState => {
                const prevVLL = prevState[key] || null;
                const prevV = prevVLL ? prevVLL[soLan] : null;
                const nextVL = prevVLL ? prevVLL[soLan + 1] : null;
                const newState: VChuanDongBoCacLL = {
                    ...prevState,
                    [key]: {
                        ...prevVLL,
                        [soLan]: prevV ? { ...prevV, [field]: value } : { [field]: value },
                        // [index + 1]: nextVL ? { ...nextVL, Vc1: value } : { Vc1: value, Vc2: "-1" },
                    }
                };
                return newState;
            });
        }
    }

    const indexMap: Record<string, number> = {
        'Q3': 0,
        'Qn': 0,
        'Q2': 1,
        'Qt': 1,
        'Q1': 2,
        'Qmin': 2
    };

    const updateLuuLuong = (q: { title: string; value: string }, duLieuChay: DuLieuCacLanChay | null = null, indexDongHo: number) => {
        const dongHo = dongHoList[indexDongHo] ?? null;

        const duLieuKiemDinhJSON = dongHo.du_lieu_kiem_dinh;
        const duLieuKiemDinh = duLieuKiemDinhJSON ?
            ((typeof duLieuKiemDinhJSON != 'string') ?
                duLieuKiemDinhJSON : JSON.parse(duLieuKiemDinhJSON)
            ) : null;

        // Cập nhật dữ liệu chạy
        const du_lieu = {
            ...duLieuKiemDinh.du_lieu,
            [q.title]: {
                value: q.value,
                lan_chay: duLieuChay
            }
        }

        // Tính hiệu sai số
        const tmpHssDH = duLieuKiemDinh.hieu_sai_so;
        const index = indexMap[q.title];
        tmpHssDH[index].hss = duLieuChay ? getHieuSaiSo(duLieuChay) : null;

        // Cập nhật dữ liệu cho Dữ liệu kiểm định
        const newDLKD = {
            du_lieu: du_lieu,
            hieu_sai_so: [...tmpHssDH],
            ket_qua: isDongHoDatTieuChuan(tmpHssDH)
        };

        // const newDHList = [...dongHoList];

        const newDHList = dongHoList.map((dh, i) => {

            const dlkdJSON = dh.du_lieu_kiem_dinh;
            const dlkd = dlkdJSON ?
                ((typeof dlkdJSON != 'string') ?
                    dlkdJSON : JSON.parse(dlkdJSON)
                ) : null;


            const oldLC = getDuLieuChayCuaLuuLuong(q, i);
            let newDLC: DuLieuCacLanChay;
            if (duLieuChay) {
                newDLC = Object.entries(duLieuChay).reduce((acc, [soLanStr, dl]) => {
                    const soLan = Number(soLanStr);
                    const old = oldLC[soLan];

                    if (old) {
                        acc[soLan] = {
                            ...old,
                            Vc1: dl.Vc1,
                            Vc2: dl.Vc2,
                            Vc: dl.Vc
                        };
                    }

                    return acc;
                }, {} as DuLieuCacLanChay);
            } else {
                newDLC = oldLC
            }
            const new_dl = {
                ...dlkd.du_lieu,
                [q.title]: {
                    value: q.value,
                    lan_chay: newDLC
                }
            }

            // Tính hiệu sai số
            const tmpHssDHList = dlkd.hieu_sai_so;
            const index = indexMap[q.title];
            tmpHssDHList[index].hss = duLieuChay ? getHieuSaiSo(newDLC) : null;

            // Cập nhật dữ liệu cho Dữ liệu kiểm định
            const newDLKDDHList = {
                du_lieu: new_dl,
                hieu_sai_so: [...tmpHssDHList],
                ket_qua: isDongHoDatTieuChuan(tmpHssDHList)
            };

            const ngayThucHien: Date = dongHo.ngay_thuc_hien ?? dayjs().toDate();
            const newInfo = {
                ...dh,
                hieu_luc_bien_ban: isDongHoDatTieuChuan(tmpHssDH) ? getLastDayOfMonthInFuture((new_dl[TITLE_LUU_LUONG.q3] != null), dongHo.ngay_thuc_hien ?? ngayThucHien) : null,
                du_lieu_kiem_dinh: JSON.stringify(newDLKDDHList)
            }
            return newInfo;
        });

        newDHList[indexDongHo] = { ...newDHList[indexDongHo], du_lieu_kiem_dinh: JSON.stringify(newDLKD) };
        if (debounceSetDHListRef.current) {
            clearTimeout(debounceSetDHListRef.current);
        }
        setDongHoList(newDHList);

    };

    const removeKiemDinh = (id: string) => {
        setDuLieuKiemDinhCacLuuLuong(prevState => {
            const newState = { ...prevState };
            delete newState[id];
            return newState;
        });
    };

    const getDuLieuChayCuaLuuLuong = (q: { title: string; value: string }, indexDongHo: number): DuLieuCacLanChay => {

        const dongHo = dongHoList[indexDongHo];

        const duLieuKiemDinhJSON = dongHo.du_lieu_kiem_dinh;
        const duLieuKiemDinh = duLieuKiemDinhJSON ?
            ((typeof duLieuKiemDinhJSON != 'string') ?
                duLieuKiemDinhJSON : JSON.parse(duLieuKiemDinhJSON)
            ) : null;

        let data: Record<number, DuLieuMotLanChay> | null = duLieuKiemDinh.du_lieu[q.title]?.lan_chay;

        if (data) {
            const newDLKD = Object.entries(data).reduce((acc: Record<number, DuLieuMotLanChay>, [key, val]) => {
                acc[Number(key)] = {
                    ...val,
                    ...(vChuanDongBoCacLL?.[q.title]?.[Number(key)] || {}),
                    // ...(vChuanDongBoCacLL?.[q.title]?.[Number(key) + 1] || {})
                };
                return acc;
            }, {})
            return newDLKD;
        }
        return {
            1: {
                V1: 0,
                V2: 0,
                Vc1: 0,
                Vc2: 0,
                Vc: 0,
                Tdh: randomT,
                Tc: randomT,
                ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
            },
            2: {
                V1: 0,
                V2: 0,
                Vc1: 0,
                Vc2: 0,
                Vc: 0,
                Tdh: randomT,
                Tc: randomT,
                ...(vChuanDongBoCacLL?.[q.title]?.[2] || {})
            },
        };
    }

    const themLanChayCuaLuuLuong = (q: { title: string; value: string }) => {
        const isQ123 = [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.q1].includes(q.title);
        const isQntmin = [TITLE_LUU_LUONG.qn, TITLE_LUU_LUONG.qt, TITLE_LUU_LUONG.qmin].includes(q.title);

        if (isQ123 || isQntmin) {
            const newDHList = dongHoList.map((dh, indexDH) => {

                const dlkdJSON = dh.du_lieu_kiem_dinh;
                const dlkd = dlkdJSON ?
                    ((typeof dlkdJSON != 'string') ?
                        dlkdJSON : JSON.parse(dlkdJSON)
                    ) : null;

                const tmpHssDH = dlkd.hieu_sai_so;

                const titles = isQ123
                    ? [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.q1]
                    : [TITLE_LUU_LUONG.qn, TITLE_LUU_LUONG.qt, TITLE_LUU_LUONG.qmin];

                const new_dl = Object.fromEntries(
                    Object.entries(dlkd.du_lieu).map(([qTitle, dlChay]) => {
                        const dl = dlChay as DuLieuChayDiemLuuLuong;
                        if (titles.includes(qTitle)) {
                            const oldLanChay = dl.lan_chay;
                            const nextKey = String(Object.keys(oldLanChay).length + 1);
                            const newLanChay = {
                                ...oldLanChay,
                                [nextKey]: formValues,
                            };


                            const index = indexMap[qTitle];
                            tmpHssDH[index].hss = newLanChay ? getHieuSaiSo(newLanChay) : null;

                            return [
                                qTitle,
                                {
                                    ...dl,
                                    lan_chay: newLanChay,
                                },
                            ];
                        }

                        return [qTitle, dlChay];
                    })
                );

                const newDLKDDHList = {
                    du_lieu: new_dl,
                    hieu_sai_so: [...tmpHssDH],
                    ket_qua: isDongHoDatTieuChuan(tmpHssDH)
                };

                return {
                    ...dh,
                    du_lieu_kiem_dinh: JSON.stringify(newDLKDDHList)
                }
            });
            setDongHoList(newDHList);
        }

    };

    const xoaLanChayCuaLuuLuong = (q: { title: string; value: string }) => {
        const isQ123 = [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.q1].includes(q.title);
        const isQntmin = [TITLE_LUU_LUONG.qn, TITLE_LUU_LUONG.qt, TITLE_LUU_LUONG.qmin].includes(q.title);

        if (isQ123 || isQntmin) {
            const newDHList = dongHoList.map((dh, indexDH) => {
                const dlkdJSON = dh.du_lieu_kiem_dinh;
                const dlkd = dlkdJSON
                    ? typeof dlkdJSON !== "string"
                        ? dlkdJSON
                        : JSON.parse(dlkdJSON)
                    : null;

                const tmpHssDH = dlkd.hieu_sai_so;

                const titles = isQ123
                    ? [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.q1]
                    : [TITLE_LUU_LUONG.qn, TITLE_LUU_LUONG.qt, TITLE_LUU_LUONG.qmin];

                const new_dl = Object.fromEntries(
                    Object.entries(dlkd.du_lieu).map(([qTitle, dlChay]) => {
                        const dl = dlChay as DuLieuChayDiemLuuLuong;
                        if (titles.includes(qTitle)) {
                            const oldLanChay = dl.lan_chay;
                            const keys = Object.keys(oldLanChay);

                            // Chỉ xóa nếu có nhiều hơn 2 lần chạy
                            if (keys.length <= 2) {
                                return [qTitle, dl];
                            }

                            const nextKey = Number(keys.length.toString()) ?? -1;
                            const { [nextKey]: _, ...remainingLanChay } = oldLanChay;

                            const index = indexMap[qTitle];
                            tmpHssDH[index].hss = getHieuSaiSo(remainingLanChay);

                            return [
                                qTitle,
                                {
                                    ...dl,
                                    lan_chay: remainingLanChay,
                                },
                            ];
                        }

                        return [qTitle, dlChay];
                    })
                );

                const newDLKDDHList = {
                    du_lieu: new_dl,
                    hieu_sai_so: [...tmpHssDH],
                    ket_qua: isDongHoDatTieuChuan(tmpHssDH)
                };

                return {
                    ...dh,
                    du_lieu_kiem_dinh: JSON.stringify(newDLKDDHList)
                };
            });

            setDongHoList(newDHList);
        }
    };

    const addMoreDongHo = (amount: number) => {
        const oldAmount = dongHoList.length;
        if (amount > 0 && oldAmount > 0) {
            const newAmount = Math.abs(oldAmount - amount)

            const newDongHoList = [...dongHoList];
            for (let i = 0; i < newAmount; i++) {
                const esistsDongHo = dongHoList[0];

                let newDLC: DuLieuChayDongHo | undefined = undefined;
                newDLC = {
                    [TITLE_LUU_LUONG.q3]: null,
                    [TITLE_LUU_LUONG.q2]: null,
                    [TITLE_LUU_LUONG.q1]: null,
                    [TITLE_LUU_LUONG.qn]: null,
                    [TITLE_LUU_LUONG.qt]: null,
                    [TITLE_LUU_LUONG.qmin]: null,
                }

                if (esistsDongHo.du_lieu_kiem_dinh) {
                    const dlkd = typeof esistsDongHo.du_lieu_kiem_dinh === 'string'
                        ? JSON.parse(esistsDongHo.du_lieu_kiem_dinh)
                        : esistsDongHo.du_lieu_kiem_dinh;
                    newDLC = Object.entries(dlkd.du_lieu).reduce((acc, [qTitle, value]) => {
                        const dlChay = value as DuLieuChayDiemLuuLuong;
                        if (dlChay && dlChay.lan_chay) {
                            const oldLanChay = dlChay.lan_chay;
                            const newLanChay = Object.entries(oldLanChay).reduce((acc, [soLanStr, dl]) => {
                                const soLan = Number(soLanStr);

                                acc[soLan] = {
                                    ...dl,
                                    V1: 0,
                                    V2: 0
                                };

                                return acc;
                            }, {} as DuLieuCacLanChay);
                            acc[qTitle] = {
                                ...dlChay,
                                lan_chay: newLanChay
                            };
                        }
                        return acc;
                    }, {} as DuLieuChayDongHo);
                }
                newDongHoList.push({
                    ...esistsDongHo,
                    index: oldAmount + i + 1,
                    du_lieu_kiem_dinh: JSON.stringify({
                        hieu_sai_so: [
                            { hss: null },
                            { hss: null },
                            { hss: null }
                        ],
                        du_lieu: newDLC,
                        ket_qua: null
                    }),
                });
            }
            setDongHoList(newDongHoList);
        }
    }

    const removeMoreDongHo = (amount: number) => {
        const newDHList = [...dongHoList];
        const newAmount = Math.abs(newDHList.length - amount);
        if (newAmount > 0) {
            newDHList.splice(newDHList.length - newAmount, newAmount);
        }
        setDongHoList(newDHList);
    }


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
                            },
                            2: {
                                V1: 0,
                                V2: 0,
                                Vc1: 0,
                                Vc2: 0,
                                Tdh: randomT,
                                Tc: randomT,
                                ...(vChuanDongBoCacLL?.[q.title]?.[2] || {})
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
                                    Vc: 0,
                                    Tdh: randomT,
                                    Tc: randomT,
                                    ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
                                },
                                2: {
                                    V1: 0,
                                    V2: 0,
                                    Vc1: 0,
                                    Vc2: 0,
                                    Vc: 0,
                                    Tdh: randomT,
                                    Tc: randomT,
                                    ...(vChuanDongBoCacLL?.[q.title]?.[2] || {})
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

    const getDuLieuKiemDinhJSON = (formHieuSaiSoProp?: { hss: number | null }[]) => {
        return JSON.stringify({
            hieu_sai_so: formHieuSaiSoProp ? formHieuSaiSoProp : formHieuSaiSo,
            mf: formMf,
            du_lieu: duLieuKiemDinhCacLuuLuong,
            ket_qua: formHieuSaiSoProp ? isDongHoDatTieuChuan(formHieuSaiSoProp) : ketQua
        });
    }

    return (
        <KiemDinhContext.Provider value={{
            duLieuKiemDinhCacLuuLuong,
            initialFormHieuSaiSo,
            initialFormMf,
            initialDuLieuKiemDinhCacLuuLuong,
            formHieuSaiSo,
            lanChayMoi,
            ketQua,
            addMoreDongHo,
            removeMoreDongHo,
            updateLuuLuong,
            removeKiemDinh,
            updateSoDongHoChuan,
            setDuLieuKiemDinhCacLuuLuong,
            setKetQua,
            themLanChayCuaLuuLuong,
            getDuLieuChayCuaLuuLuong: (q: { title: string; value: string; }, indexDongHo: number) => {
                return getDuLieuChayCuaLuuLuong(q, indexDongHo) || {
                    1: {
                        V1: 0,
                        V2: 0,
                        Vc1: 0,
                        Vc2: 0,
                        Vc: 0,
                        Tdh: randomT,
                        Tc: randomT,
                        ...(vChuanDongBoCacLL?.[q.title]?.[1] || {})
                    },
                    2: {
                        V1: 0,
                        V2: 0,
                        Vc1: 0,
                        Vc2: 0,
                        Vc: 0,
                        Tdh: randomT,
                        Tc: randomT,
                        ...(vChuanDongBoCacLL?.[q.title]?.[2] || {})
                    }
                };
            },
            luuLuong,
            setLuuLuong,
            xoaLanChayCuaLuuLuong,
            resetLanChay,
            getDuLieuKiemDinhJSON,
            setFormHieuSaiSo,
            formMf,
            setFormMf,
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