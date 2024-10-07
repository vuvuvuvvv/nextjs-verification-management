import { DongHo } from '@lib/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface DongHoListContextType {
    dongHoList: DongHo[];
    setDongHoList: React.Dispatch<React.SetStateAction<DongHo[]>>;
    addDongHo: (dongHo: DongHo) => void;
    updateDongHo: (updates: { index: number, updatedDongHo: DongHo }[]) => void;
    deleteDongHo: (index: number) => void;
}

const DongHoListContext = createContext<DongHoListContextType | undefined>(undefined);

export const DongHoListProvider = ({ children, serialNumbers = [] }: { children: ReactNode, serialNumbers: string[] }) => {
    const [dongHoList, setDongHoList] = useState<DongHo[]>(() => {
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
            du_lieu_kiem_dinh: "", // Added new field
            hieu_luc_bien_ban: new Date(),
            so_giay_chung_nhan: "",
        }));
    });
    
    const [amount, setAmount] = useState<number>(serialNumbers.length)

    // Initial with amount. Ex create 5 sample DonHo for dongHoList

    const addDongHo = (dongHo: DongHo) => {
        setDongHoList(prevList => [...prevList, dongHo]);
    };

    const updateDongHo = (updates: { index: number, updatedDongHo: DongHo }[]) => {
        setDongHoList(prevList => 
            prevList.map((item, i) => {
                const update = updates.find(update => update.index === i);
                return update ? update.updatedDongHo : item;
            })
        );
    };

    const deleteDongHo = (index: number) => {
        setDongHoList(prevList => prevList.filter((_, i) => i !== index));
    };

    return (
        <DongHoListContext.Provider value={{ dongHoList, setDongHoList, addDongHo, updateDongHo, deleteDongHo }}>
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