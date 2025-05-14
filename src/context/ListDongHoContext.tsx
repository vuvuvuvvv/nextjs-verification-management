import { createDongHo, updateDongHo } from '@/app/api/dongho/route';
import { DEFAULT_LOCATION, INDEXED_DB_HIEU_CHUAN_NAME, TITLE_LUU_LUONG } from '@lib/system-constant';
import { DongHo, GeneralInfoDongHo } from '@lib/types';

import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { useUser } from './AppContext';
import { deleteDongHoDataFromIndexedDB, saveDongHoDataExistsToIndexedDB } from '@lib/system-function';

interface DongHoListContextType {
    isHieuChuan: boolean,
    dongHoList: DongHo[];
    setDongHoList: (listDongHo: DongHo[]) => void;
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    amount: number;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
    addToListDongHo: (dongHo: DongHo) => void;
    updateListDongHo: (updatedDongHo: DongHo, index: number) => void;
    // updateDongHoFieldsInList: (index: number, fields: Partial<DongHo>) => void;
    deleteDongHoInList: (index: number) => void;
    getDongHoChuaKiemDinh: (dongHoList: DongHo[]) => DongHo[];
    getDongHoDaKiemDinh: (dongHoList: DongHo[]) => DongHo[];
    createListDongHo: (listDongHo: DongHo[]) => Promise<boolean>;
    savedDongHoList: DongHo[];
    // deleteOldData: () => void;
    generalInfoDongHo: GeneralInfoDongHo;
    setSavedDongHoList: React.Dispatch<React.SetStateAction<DongHo[]>>;
}

interface DongHoListProviderProps {
    dbName: string;
    children: React.ReactNode;
}

const DongHoListContext = createContext<DongHoListContextType | undefined>(undefined);

export const DongHoListProvider = ({ dbName, children }: DongHoListProviderProps) => {
    const isHieuChuan = useRef<boolean>(dbName == INDEXED_DB_HIEU_CHUAN_NAME)
    const { user } = useUser();
    const [isEditing, setEditing] = useState<boolean>(false);
    const [isInitialization, setInitialization] = useState(true);

    const [amount, setAmount] = useState<number>(1)

    const initDongHoList: DongHo[] = Array.from({ length: amount }, (_, i) => ({
        id: null,
        ten_phuong_tien_do: "",

        is_hieu_chuan: isHieuChuan.current,
        index: i + 1,

        group_id: "",

        transitor: "",
        sensor: "",
        serial: "",

        co_so_san_xuat: "",
        nam_san_xuat: null,

        dn: "",
        d: "",
        ccx: null,
        q3: "",
        r: "",
        qn: "",
        k_factor: "",
        so_qd_pdm: "",

        so_giay_chung_nhan: "",
        so_tem: "",

        co_so_su_dung: "",
        phuong_phap_thuc_hien: "ĐLVN 17 : 2017",
        chuan_thiet_bi_su_dung: "Đồng hồ chuẩn đo nước và Bình chuẩn",
        nguoi_thuc_hien: "",
        ngay_thuc_hien: new Date(),

        dia_diem_thuc_hien: "",

        ket_qua_check_vo_ngoai: false,
        ket_qua_check_do_kin: false,
        ket_qua_check_do_on_dinh_chi_so: false,

        noi_su_dung: DEFAULT_LOCATION,
        ten_khach_hang: "",
        // vi_tri: "",
        // nhiet_do: "",
        // do_am: "",

        du_lieu_kiem_dinh: JSON.stringify({
            hieu_sai_so: [
                { hss: null },
                { hss: null },
                { hss: null }
            ],
            du_lieu: {
                [TITLE_LUU_LUONG.q3]: null,
                [TITLE_LUU_LUONG.q2]: null,
                [TITLE_LUU_LUONG.q1]: null,
                [TITLE_LUU_LUONG.qn]: null,
                [TITLE_LUU_LUONG.qt]: null,
                [TITLE_LUU_LUONG.qmin]: null,
            },
            ket_qua: null
        }),
        nguoi_soat_lai: "",

        hieu_luc_bien_ban: null,
    }));

    const [dongHoList, setDongHoList] = useState<DongHo[]>();

    useEffect(() => {
        setDongHoList(() => {
            // Khởi tạo danh sách với số lượng dongHo
            return Array.from({ length: amount }, (_, i) => ({
                id: null,
                ten_phuong_tien_do: "",

                is_hieu_chuan: isHieuChuan.current,
                index: i + 1,

                group_id: "",

                transitor: "",
                sensor: "",
                serial: "",

                co_so_san_xuat: "",
                nam_san_xuat: null,

                dn: "",
                d: "",
                ccx: null,
                q3: "",
                r: "",
                qn: "",
                k_factor: "",
                so_qd_pdm: "",

                so_giay_chung_nhan: "",
                so_tem: "",

                co_so_su_dung: "",
                phuong_phap_thuc_hien: "ĐLVN 17 : 2017",
                chuan_thiet_bi_su_dung: "Đồng hồ chuẩn đo nước và Bình chuẩn",
                nguoi_thuc_hien: "",
                ngay_thuc_hien: new Date(),

                dia_diem_thuc_hien: "",

                ket_qua_check_vo_ngoai: false,
                ket_qua_check_do_kin: false,
                ket_qua_check_do_on_dinh_chi_so: false,

                noi_su_dung: DEFAULT_LOCATION,
                ten_khach_hang: "",
                // vi_tri: "",
                // nhiet_do: "",
                // do_am: "",

                du_lieu_kiem_dinh: JSON.stringify({
                    hieu_sai_so: [
                        { hss: null },
                        { hss: null },
                        { hss: null }
                    ],
                    du_lieu: {
                        [TITLE_LUU_LUONG.q3]: null,
                        [TITLE_LUU_LUONG.q2]: null,
                        [TITLE_LUU_LUONG.q1]: null,
                        [TITLE_LUU_LUONG.qn]: null,
                        [TITLE_LUU_LUONG.qt]: null,
                        [TITLE_LUU_LUONG.qmin]: null,
                    },
                    ket_qua: null
                }),
                nguoi_soat_lai: "",

                hieu_luc_bien_ban: null,
            }));
        })
    }, [amount])

    const [savedDongHoList, setSavedDongHoList] = useState<DongHo[]>([]);

    useEffect(() => {
        if (dongHoList && dongHoList.length > 0) {
            if (savedDongHoList.length == dongHoList.length && user && user.username && !isEditing) {
                deleteDongHoDataFromIndexedDB(dbName, user.username);
            } else {
                if (user && user.username && !isInitialization && !isEditing) {
                    saveDongHoDataExistsToIndexedDB(dbName, user.username, dongHoList, savedDongHoList);
                }
            }
        }
    }, [savedDongHoList]);

    useEffect(() => {
        // console.log(dongHoList);
    }, [dongHoList]);

    const getGeneralInfo = (dongHo: DongHo): GeneralInfoDongHo => {
        return {
            group_id: dongHo.group_id,
            ten_phuong_tien_do: dongHo.ten_phuong_tien_do,

            co_so_san_xuat: dongHo.co_so_san_xuat,

            nam_san_xuat: dongHo.nam_san_xuat,
            dn: dongHo.dn,
            d: dongHo.d,

            ccx: dongHo.ccx,
            q3: dongHo.q3,
            r: dongHo.r,

            qn: dongHo.qn,
            so_qd_pdm: dongHo.so_qd_pdm,
            co_so_su_dung: dongHo.co_so_su_dung,
            phuong_phap_thuc_hien: dongHo.phuong_phap_thuc_hien,

            chuan_thiet_bi_su_dung: dongHo.chuan_thiet_bi_su_dung,
            nguoi_thuc_hien: dongHo.nguoi_thuc_hien,
            ngay_thuc_hien: dongHo.ngay_thuc_hien,

            // vi_tri: dongHo.vi_tri,
            // nhiet_do: dongHo.nhiet_do,
            // do_am: dongHo.do_am,
            noi_su_dung: dongHo.noi_su_dung,
            ten_khach_hang: dongHo.ten_khach_hang,

            nguoi_soat_lai: dongHo.nguoi_soat_lai,
            dia_diem_thuc_hien: dongHo.dia_diem_thuc_hien,

        }
    }
    const [generalInfoDongHo, setGeneralInfoDongHo] = useState<GeneralInfoDongHo>(getGeneralInfo(initDongHoList[0]));

    const handler = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (dongHoList && dongHoList.length > 0
            && user && user.username
            && !isInitialization
            && savedDongHoList.length != dongHoList.length
            && !isEditing) {
            if (handler.current) {
                clearTimeout(handler.current);
            }

            handler.current = setTimeout(() => {
                saveDongHoDataExistsToIndexedDB(dbName, user.username, dongHoList, savedDongHoList);
            }, 1500);

            return () => {
                if (handler.current) {
                    clearTimeout(handler.current);
                }
            };
        }
    }, [dongHoList]);

    const updateListDongHo = (updatedDongHo: DongHo, index: number) => {
        setInitialization(false);
        setDongHoList(prevList => {
            const prev = prevList ? prevList : [];
            const generalInfo = getGeneralInfo(updatedDongHo);
            setGeneralInfoDongHo(generalInfo);

            const newDHList = prev.map(dongHo => ({
                ...dongHo,
                ...generalInfo,
                id: dongHo.id
            }));

            if (newDHList[index] && newDHList[index].du_lieu_kiem_dinh) {
                newDHList[index].du_lieu_kiem_dinh = updatedDongHo.du_lieu_kiem_dinh;
            }
            return newDHList;
        });
    };

    const addToListDongHo = (dongHo: DongHo) => {
        setDongHoList(prevList => [...prevList ?? [], dongHo]);
    };

    const deleteDongHoInList = (index: number) => {
        setDongHoList(prevList => (prevList ?? []).filter((_, i) => i !== index));
    };

    const createListDongHo = async (listDongHo: DongHo[]): Promise<boolean> => {
        if (!dongHoList) {
            return Swal.fire({
                title: 'Lỗi',
                html: "Có lỗi đã xảy ra. Hãy thử lại sau.",
                icon: 'error',
            }).then((result) => {
                return errorMessages.length === 0;
            });
        }

        let successMessages: string[] = [];
        let errorMessages: string[] = [];

        for (let i = 0; i < listDongHo.length; i++) {
            const dongHo = listDongHo[i];
            try {
                const res = !isEditing ? await createDongHo(dongHo) : await updateDongHo(dongHo);
                if (res.status === 201 || res.status === 200) {
                    successMessages.push(`ĐH${(dongHoList.indexOf(dongHo)) + 1}: Lưu thành công`);
                    setSavedDongHoList(prevList => [...prevList, dongHo]);
                } else {
                    errorMessages.push(`ĐH${(dongHoList.indexOf(dongHo)) + 1}: Lỗi - ${res.msg || "Chưa thể khởi tạo"}`);
                }
            } catch (error: any) {
                errorMessages.push(`ĐH${(dongHoList.indexOf(dongHo)) + 1}: Lỗi - ${error.message || "Chưa thể khởi tạo"}`);
            }

            Swal.update({
                html: `Đang lưu ${i + 1}/${listDongHo.length} đồng hồ...`,
            });
        }

        // Close Swal and show results
        Swal.close();
        const resultMessages = [...errorMessages];
        return Swal.fire({
            title: 'Kết quả lưu đồng hồ',
            html: errorMessages.length > 0 ? resultMessages.join('<br>') : "Lưu thành công!",
            icon: errorMessages.length > 0 ? 'error' : 'success',
        }).then((result) => {
            return errorMessages.length === 0;
        });
    }

    const isDHSaved = (dongHoSelected: DongHo) => {
        for (const dongHo of savedDongHoList) {
            if (dongHo.serial == dongHoSelected.serial || (dongHo.sensor == dongHoSelected.sensor && dongHo.transitor == dongHoSelected.transitor)) {
                return true;
            }
        }
        return false;
    };

    const getDongHoChuaKiemDinh = (dongHoList: DongHo[]) => {
        const combinedList = [...dongHoList, ...savedDongHoList];

        return combinedList.filter(dongHo => {
            try {

                const duLieuKiemDinh = dongHo?.du_lieu_kiem_dinh ?
                    ((isEditing && typeof dongHo?.du_lieu_kiem_dinh != 'string') ?
                        dongHo?.du_lieu_kiem_dinh : JSON.parse(dongHo?.du_lieu_kiem_dinh)
                    ) : null;
                return duLieuKiemDinh.ket_qua === null;
            } catch {
                return true; // Consider as incomplete if parsing fails
            }
        });
    }

    const getDongHoDaKiemDinh = (dongHoList: DongHo[]) => {
        const combinedList = [...dongHoList];

        return combinedList.filter(dongHo => {
            if (!isDHSaved(dongHo)) {
                try {
                    const duLieuKiemDinh = JSON.parse(dongHo?.du_lieu_kiem_dinh || "{}");
                    return duLieuKiemDinh.ket_qua !== null;
                } catch {
                    return true; // Consider as incomplete if parsing fails
                }
            }
        });
    }

    return (
        <DongHoListContext.Provider value={{
            isHieuChuan: isHieuChuan.current,
            dongHoList: dongHoList ?? [],
            generalInfoDongHo,
            setEditing,
            setDongHoList: (list: DongHo[]) => setDongHoList(list ?? []),
            amount,
            setAmount,
            addToListDongHo,
            // updateDongHoFieldsInList,
            updateListDongHo,
            deleteDongHoInList,
            getDongHoChuaKiemDinh,
            getDongHoDaKiemDinh,
            createListDongHo,
            // deleteOldData,
            savedDongHoList,
            setSavedDongHoList
        }}>
            {children}
        </DongHoListContext.Provider>
    );
};

export const useDongHoList = () => {
    const context = useContext(DongHoListContext);
    if (context === undefined) {
        throw new Error('useDongHoList must be used within a DongHoListProvider');
    }
    return context;
};