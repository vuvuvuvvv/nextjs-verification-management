import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DongHo {
    seriNumber: string;
    phuongTienDo: string;
    seriChiThi: string;
    seriSensor: string;
    kieuChiThi: string;
    kieuSensor: string;
    kieuThietBi: string;
    soTem: string;
    coSoSanXuat: string;
    namSanXuat: Date | null;
    dn: string;
    d: string;
    ccx: string | null;
    q3: string;
    r: string;
    qn: string;
    kFactor: string;
    so_qd_pdm: string;
    tenKhachHang: string;
    coSoSuDung: string;
    phuongPhapThucHien: string;
    chuanThietBiSuDung: string;
    implementer: string;
    ngayThucHien: Date | null;
    viTri: string;
    nhietDo: string;
    doAm: string;
    isDHDienTu: boolean;
    qt: number | null;
    qmin: number | null;
    formHieuSaiSo: { hss: number | null }[];
}

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
        nhietDo: "",
        doAm: "",
        isDHDienTu: false,
        qt: null,
        qmin: null,
        formHieuSaiSo: [
            { hss: null },
            { hss: null },
            { hss: null },
        ],
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