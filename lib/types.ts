import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// lib/types.ts
export interface User {
    id: number;
    username: string;
    fullname: string;
    email: string;
    role: string;
    status: string;
}

export interface SideLink {
    title: string;
    icon: IconDefinition;
    href?: string;
    children?: SideLink[];
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

export interface PDM {
    ma_tim_dong_ho_pdm: string | null,
    ten_dong_ho: string | null,
    noi_san_xuat: string | null,
    dn: string | null,
    ccx: string | null,
    sensor: string | null,
    transmitter: string | null,
    qn: string | null,
    q3: string | null,
    r: string | null,
    don_vi_pdm: string | null,
    dia_chi: string | null,
    so_qd_pdm: string | null,
    ngay_qd_pdm: Date | null,
    ngay_het_han: Date | null,
    anh_pdm: string | null,
}

export interface PDMFilterParameters {
    // ma_tim_dong_ho_pdm: string | null,
    ten_dong_ho: string | null,
    so_qd_pdm: string | null,
    ngay_qd_pdm_from: Date | null,
    ngay_qd_pdm_to: Date | null,
    tinh_trang: string | null,
    dn: string | null,
    ccx?: string | null,
    sensor?: string | null,
    transmitter?: string | null,
    
    limit: number;  // x
    last_seen: string; // p => limit x offset x * (p-1)
    next_from?: string; 
    prev_from?: string; 
}

export interface ReportData {
    "id": number,
    "createdAt": string,
    "updatedAt": string,
    "createdBy": string,
    "updatedBy": string,
    "numberOfClocks": number,
    "status": string,
}

export interface WaterMeterData {
    "id": number,
    "serial_number": string,
    "type": string,
    "ccx": string,
    "createdAt": string,
    "updatedAt": string,
    "createdBy": string,
    "updatedBy": string,
    "status": string,
}

export interface PDMData {
    "id": number,
    "ma_tim_dong_ho_pdm": string,
    "ten_dong_ho": string,
    "noi_san_xuat": string,
    "dn": string,
    "ccx": string,
    "sensor": string,
    "transmitter": string,
    "qn": string,
    "q3": string,
    "r": string,
    "don_vi_pdm": string,
    "dia_chi": string,
    "so_qd_pdm": string,
    "ngay_qd_pdm": string,
    "ngay_het_han": string,
    "anh_pdm": string,
}

export type LuuLuong = {
    title: string;
    value: string | number | null;
}

export type TinhSaiSoValueTabs = [
    DuLieuMotLanChay,
    DuLieuMotLanChay,
    DuLieuMotLanChay
]

// Các thông số cho một lần đo 
export type DuLieuMotLanChay = {
    V1: number;
    V2: number;
    Tdh: number;
    Vc1: number | string | null;
    Vc2: number | string | null;
    Vc: number | string;
    Tc: number;
    Mf?: number | null;
};

// {
//     1: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 },
//     2: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 },
//     3: { V1: 0, V2: 0, Vc1: 0, Vc2: 0, Tdh: 0, Tc: 0 }
// }
export type DuLieuCacLanChay = Record<number, DuLieuMotLanChay>

// Tại các điểm Q1 2 3 || n t min có thể có nhiều lần đo
/*
 * Ex: q3 {
 *  value: xxx;
 *  lan_chay: {
 *      1: {
 *          ...
 *      },
 *      2: {
 *          ....
 *      },
 *      ...
 *  }
 * }
*/
export type DuLieuChayDiemLuuLuong = {
    value: number | null;
    lan_chay: DuLieuCacLanChay;
};

// Tùy theo loại đồng hồ chia ra chạy q 123 hoặc n t min:
/**
 * Ex: dh1 {
 *  "q3": {
 *      ...
 *  },
 *  ...
 * }
 */
export type DuLieuChayDongHo = Record<string, DuLieuChayDiemLuuLuong | null>;

export interface DongHo {
    id: string | null;
    ten_phuong_tien_do: string | null;

    is_hieu_chuan?: boolean,
    index: number | null,

    group_id: string | null;

    transitor: string | null;
    sensor: string | null;
    serial: string | null;

    co_so_san_xuat: string | null;
    nam_san_xuat: Date | null;

    dn: string | null;
    d: string | null;
    ccx: string | null;
    q3: string | null;
    r: string | null;
    qn: string | null;
    k_factor: string | null;
    so_qd_pdm?: string | null;

    so_tem: string | null;
    so_giay_chung_nhan: string | null;

    co_so_su_dung: string | null;
    phuong_phap_thuc_hien: string | null;
    chuan_thiet_bi_su_dung: string | null;
    
    nguoi_thuc_hien: string | null;
    ngay_thuc_hien: Date | null;

    // vi_tri: string | null,
    // nhiet_do: string | null,
    // do_am: string | null,
    ten_khach_hang: string | null,
    noi_su_dung: string | null,

    dia_diem_thuc_hien: string | null;
    
    ket_qua_check_vo_ngoai: boolean | null,
    ket_qua_check_do_kin: boolean | null,
    ket_qua_check_do_on_dinh_chi_so: boolean | null,

    du_lieu_kiem_dinh: string | null;
    nguoi_soat_lai: string | null;

    hieu_luc_bien_ban: Date | null;

    current_permission?: string | null;
}

export interface GeneralInfoDongHo {
    ten_phuong_tien_do: string | null,
    group_id: string | null,

    co_so_san_xuat: string | null,

    nam_san_xuat: Date | null,
    dn: string | null,
    d: string | null,

    ccx: string | null,
    q3: string | null,
    r: string | null,

    qn: string | null,
    so_qd_pdm?: string | null,
    co_so_su_dung: string | null,
    phuong_phap_thuc_hien: string | null,

    chuan_thiet_bi_su_dung: string | null,
    nguoi_thuc_hien: string | null,
    ngay_thuc_hien: Date | null,

    // vi_tri: string | null,
    // nhiet_do: string | null,
    // do_am: string | null,
    noi_su_dung: string | null,
    ten_khach_hang: string | null,


    nguoi_soat_lai: string | null,
    dia_diem_thuc_hien: string | null,
}

export interface DongHoFilterParameters {
    so_giay_chung_nhan: string;
    serial: string;
    kieu_moden: string;
    ccx: string;
    nguoi_thuc_hien: string;
    
    ngay_kiem_dinh_from: Date | null;
    ngay_kiem_dinh_to: Date | null;

    limit: number;  // x
    last_seen: string; // p => limit x offset x * (p-1)
    next_from?: string; 
    prev_from?: string; 
}

export interface NhomDongHo {
    group_id: string | null;
    so_luong: number | null;
    co_so_san_xuat: string | null;
    nguoi_thuc_hien: string | null;
    ngay_thuc_hien: Date | null;
    is_paid?: boolean | null;
}

export interface NhomDongHoFilterParameters {
    // group_id: string;
    nguoi_thuc_hien: string;
    ngay_kiem_dinh_from: Date | null;
    ngay_kiem_dinh_to: Date | null;
    limit: number;  // x
    page: number;   // p: => limit x offset x*(p-1)
}

export interface DongHoPermission {
    id?: string,
    username: string,
    fullname: string,
    email: string,
    role: string,
}

export interface PhongBan {
    id: number;
    ten_phong_ban: string | null;
    truong_phong: User | null;
    members: User[] | null;
    ngay_tao?: Date | null;
}

// {
//     "data": [
//         {
//             "id": 5,
//             "members": [
//                 {
//                     "confirmed": 1,
//                     "email": "dht_superadmin@gmail.com",
//                     "fullname": "Super Administrator",
//                     "id": "Nw==",
//                     "permission": 5,
//                     "role": "SuperAdministrator",
//                     "username": "dht_superadmin"
//                 },
//                 {
//                     "confirmed": 1,
//                     "email": "user@gmail.com",
//                     "fullname": "User Nguyễn",
//                     "id": "NA==",
//                     "permission": 1,
//                     "role": "User",
//                     "username": "user"
//                 },
//                 {
//                     "confirmed": 1,
//                     "email": "nguyenvu260502@gmail.com",
//                     "fullname": "Nguyễn Thế Vũ",
//                     "id": "Ng==",
//                     "permission": 1,
//                     "role": "User",
//                     "username": "vuvuvuvvv"
//                 },
//                 {
//                     "confirmed": 1,
//                     "email": "hoangtrithao@gmail.com",
//                     "fullname": "Hoàng Trí Thảo",
//                     "id": "OA==",
//                     "permission": 1,
//                     "role": "User",
//                     "username": "hoangtrithao"
//                 }
//             ],
//             "ngay_tao": "2025-05-29T04:15:05.778097",
//             "ten_phong": "123213",
//             "truong_phong": {
//                 "confirmed": 1,
//                 "email": "dht_superadmin@gmail.com",
//                 "fullname": "Super Administrator",
//                 "id": "Nw==",
//                 "permission": 5,
//                 "role": "SuperAdministrator",
//                 "username": "dht_superadmin"
//             },
//             "truong_phong_username": "dht_superadmin"
//         }
//     ],
//     "total_page": 1,
//     "total_records": 1
// }

export interface PhongBanFilterParameters {
    ten_phong_ban: string | null;
    truong_phong: string | null;
    ngay_tao_from: Date | null;
    ngay_tao_to: Date | null;
    limit: number;  // x
    last_seen: string; // p => limit x offset x * (p-1)
    next_from?: string;
    prev_from?: string;
}

export interface UserInPhongBan {
    user: User;
    is_manager: boolean | null;
    phong_ban_id: number | null;
    phong_ban: string | null;
}

export interface RoleOption {
    value: string;
    label: string;
}

type VChuanDongBo = Record<number, { Vc1?: string, Vc2?: string } | null>;
export type VChuanDongBoCacLL = Record<string, VChuanDongBo | null>