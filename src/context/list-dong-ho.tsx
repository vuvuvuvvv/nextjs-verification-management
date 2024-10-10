import { TITLE_LUU_LUONG } from '@lib/system-constant';
import { DongHo } from '@lib/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface DongHoListContextType {
    dongHoList: DongHo[];
    dongHoSelected: DongHo | null;
    setDongHoSelected: React.Dispatch<React.SetStateAction<DongHo | null>>;
    setDongHoList: React.Dispatch<React.SetStateAction<DongHo[]>>;
    addToListDongHo: (dongHo: DongHo) => void;
    updateListDongHo: (index: number, updatedDongHo: DongHo) => void;
    updateSerialDongHoInList: (index: number, newSerial: string) => void;
    deleteDongHoInList: (index: number) => void;
    getDongHoChuaKiemDinh: (dongHoList: DongHo[]) => DongHo[];
}

const DongHoListContext = createContext<DongHoListContextType | undefined>(undefined);

export const DongHoListProvider = ({ children, serialNumbers = [] }: { children: ReactNode, serialNumbers: string[] }) => {

    const [dongHoList, setDongHoList] = useState<DongHo[]>(() => {
        console.log("serialNumbers: ", serialNumbers);
        // Khởi tạo danh sách với số lượng dongHo
        return serialNumbers.map((val, i) => ({
            serial_number: val.trim(),
            phuong_tien_do: "",
            seri_chi_thi: "",
            seri_sensor: "",
            kieu_chi_thi: "",
            kieu_sensor: "",
            kieu_thiet_bi: "",
            co_so_san_xuat: "",
            so_tem: "",
            nam_san_xuat: null,
            dn: "",
            d: "",
            ccx: null,
            q3: "",
            r: "",
            qn: "",
            k_factor: "",
            so_qd_pdm: "",
            ten_khach_hang: "",
            co_so_su_dung: "",
            phuong_phap_thuc_hien: "ĐNVN 17:2017",
            chuan_thiet_bi_su_dung: "Đồng hồ chuẩn đo nước và Bình chuẩn",
            nguoi_kiem_dinh: "",
            ngay_thuc_hien: new Date(),
            vi_tri: "",
            nhiet_do: "",
            do_am: "",
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
            hieu_luc_bien_ban: null,
            so_giay_chung_nhan: "",
        }));
    });

    useEffect(() => {
        console.log("DHL: ", dongHoList);
    }, [dongHoList]);

    const [dongHoSelected, setDongHoSelected] = useState<DongHo | null>(dongHoList[0] || null);

    // useEffect(() => {
    //     console.log("DH: ", dongHoSelected);
    // }, [dongHoSelected]);

    // Initial with amount. Ex create 5 sample DonHo for dongHoList

    const addToListDongHo = (dongHo: DongHo) => {
        setDongHoList(prevList => [...prevList, dongHo]);
    };

    const updateListDongHo = (index: number, updatedDongHo: DongHo) => {
        setDongHoList(prevList =>
            prevList.map((item, i) => (i === index ? updatedDongHo : item))
        );
    };

    const updateSerialDongHoInList = (index: number, newSerial: string) => {
        setDongHoList(prevList =>
            prevList.map((item, i) =>
                i === index ? { ...item, serial_number: newSerial } : item
            )
        );
    };

    const deleteDongHoInList = (index: number) => {
        setDongHoList(prevList => prevList.filter((_, i) => i !== index));
    };

    const getDongHoChuaKiemDinh = (dongHoList: DongHo[]) => {
        return dongHoList.filter(dongHo => {
            try {
                const duLieuKiemDinh = JSON.parse(dongHo?.du_lieu_kiem_dinh || "{}");
                return duLieuKiemDinh.ket_qua === null;
            } catch {
                return true; // Consider as incomplete if parsing fails
            }
        });
    }

    return (
        <DongHoListContext.Provider value={{
            dongHoList,
            dongHoSelected,
            setDongHoSelected,
            setDongHoList,
            addToListDongHo,
            updateSerialDongHoInList,
            updateListDongHo,
            deleteDongHoInList,
            getDongHoChuaKiemDinh
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