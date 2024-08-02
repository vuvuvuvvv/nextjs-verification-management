// lib/types.ts
export interface User {
    id: number;
    username: string;
    fullname: string;
    email: string;
    role: string;
}

export interface ResetEmailCredentials {
    email: string;
    password: string;
}
export interface ResetPasswordCredentials {
    old_password: string;
    new_password: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
    remember: boolean;
}

export interface RegisterCredentials {
    username: string;
    fullname: string;
    password: string;
    email: string;
}

export interface ReportDataType {
    "id": number,
    "createdAt": string,
    "updatedAt": string,
    "createdBy": string,
    "updatedBy": string,
    "numberOfClocks": number,
    "status": string,
}

export interface WaterMeterDataType {
    "id": number,
    "serialNumber": string,
    "type": string,
    "accuracyClass": string,
    "createdAt": string,
    "updatedAt": string,
    "createdBy": string,
    "updatedBy": string,
    "status": string,
}

export interface PDMDataType {
    "id": number,
    "ma_tim_dong_ho_pdm": string,
    "ten_dong_ho": string,
    "noi_san_xuat": string,
    "dn": string,
    "ccx": string,
    "kieu_sensor": string,
    "transmitter": string,
    "qn": string,
    "q3": string,
    "R": string,
    "don_vi_pdm": string,
    "dia_chi": string,
    "so_qd_pdm": string,
    "ngay_qd_pdm": string,
    "ngay_het_han": string,
    "tinh_trang": string,
}