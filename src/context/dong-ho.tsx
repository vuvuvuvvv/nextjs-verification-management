import { DongHo } from '@lib/types';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DongHoContextType {
    dongHo: DongHo;
    setDongHo: React.Dispatch<React.SetStateAction<DongHo>>;
}

const DongHoContext = createContext<DongHoContextType | undefined>(undefined);

export const DongHoProvider = ({ children }: { children: ReactNode }) => {
    const [dongHo, setDongHo] = useState<DongHo>({
        seriNumber: "",
        phuongTienDo: "",
        seriChiThi: "",
        seriSensor: "",
        kieuChiThi: "",
        kieuSensor: "",
        kieuThietBi: "",
        soTem: "",
        coSoSanXuat: "",
        namSanXuat: null,
        dn: "",
        d: "",
        ccx: null,
        q3: "",
        r: "",
        qn: "",
        kFactor: "",
        so_qd_pdm: "",
        tenKhachHang: "",
        coSoSuDung: "",
        phuongPhapThucHien: "ĐNVN 17:2017",
        chuanThietBiSuDung: "Đồng hồ chuẩn đo nước và Bình chuẩn",
        implementer: "",
        ngayThucHien: new Date(),
        viTri: "",
        duLieuKiemDinh: "", // Added new field
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