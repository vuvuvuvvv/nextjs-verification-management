import { DongHo } from '@lib/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface DongHoContextType {
    dongHo: DongHo;
    setDongHo: React.Dispatch<React.SetStateAction<DongHo>>;
}

const DongHoContext = createContext<DongHoContextType | undefined>(undefined);

export const DongHoProvider = ({ children }: { children: ReactNode }) => {

    const [dongHo, setDongHo] = useState<DongHo>({
        id: "",
        ten_dong_ho: "",
        group_id: "",
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
    });

    return (
        <DongHoContext.Provider value={{ dongHo, setDongHo }}>
            {children}
        </DongHoContext.Provider>
    );
};

export const useDongHo = () => {
    const context = useContext(DongHoContext);
    if (context === undefined) {
        throw new Error('useDongHo must be used within a DongHoProvider');
    }
    return context;
};