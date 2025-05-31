export const statusOptions = [
    { value: '0', label: 'Không hoạt động' },
    { value: '1', label: 'Hoạt động' },
];

export const pdmStatusOptions = [
    { value: '0', label: 'Hết hạn' },
    { value: '1', label: 'Còn hiệu lực' },
];

export const phuongTienDoOptions = [
    { value: "1", label: "Đồng hồ đo nước lạnh có cơ cấu điện tử" },
    { value: "2", label: "Đồng hồ đo nước lạnh cơ khí" },
    { value: "3", label: "Đồng hồ đo nước" }
]

export const typeOptions = [
    { value: "Điện tử", label: "Điện tử" },
    { value: "Cơ - Điện từ", label: "Cơ - Điện từ" },
    { value: "Đơn tia", label: "Đơn tia" },
    { value: "Đa tia", label: "Đa tia" },
    { value: "Thể tích", label: "Thể tích" },
    { value: "Woltman", label: "Woltman" },
    { value: "Woltex", label: "Woltex" },
    { value: "Khác", label: "Khác" }
]

export const ccxOptions = [
    // { value: "0.5", label: "0.5" },
    { value: "1", label: "1" },
    // { value: "1.5", label: "1.5" },
    { value: "2", label: "2" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" }
]

export const limitOptions = [
    // { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 15, label: 15 },
    { value: 20, label: 20 },
    { value: 25, label: 25 },
    { value: 50, label: 50 },
]

export const TITLE_LUU_LUONG = {
    q3: "Q3",
    q2: "Q2",
    q1: "Q1",
    qn: "Qn",
    qt: "Qt",
    qmin: "Qmin"
}

export const PERMISSIONS = {
    VIEWER: "User",
    MANAGER: "Manager",
    KIEM_DINH_VIEN: "Kiểm định viên",
    ADMIN: "Administrator",
    SUPERADMIN: "SuperAdministrator",
}
export const PERMISSION_VALUES : Record<string, number> = {
    "User" : 1,
    "Kiểm định viên" : 2,
    "Manager" : 3,
    "Administrator" : 4,
    "SuperAdministrator" : 5,
}

export const PERMISSION_TITLES : Record<string, string> = {
    "User" : "Người dùng",
    "Kiểm định viên" : "Kiểm định viên",
    "Manager" : "Quản lý",
    "Administrator" : "Quản trị viên",
    "SuperAdministrator" : "Siêu quản trị viên",
}

export const DEFAULT_LOCATION = "Công ty Cổ phần Công nghệ và Thương mại FMS"
export const INDEXED_DB_NAME = "FMS_VFM_DB"
export const INDEXED_DB_KIEM_DINH_NAME = "KiemDinh"
export const INDEXED_DB_HIEU_CHUAN_NAME = "HieuChuan"

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Acess links:
const _PDM = "/pdm"
const _PB = '/phong-ban'
const KD_DHN = "/kiem-dinh/dong-ho-nuoc"
const HC_DHN = "/hieu-chuan/dong-ho-nuoc"
// const KD_DHN = KD_DHN + "/q-bigger-than-15"
// const KD_DHN = KD_DHN + "/q-smaller-than-15"
export const ACCESS_LINKS = {
    HOME : {
        src: "/",
        title: "Trang chủ"
    },
    AD_XUAT_BAO_CAO : {
        src: "/xuat-bao-cao",
        title: "Xuất báo cáo"
    },
    AD_PHAN_QUYEN : {
        src: "/phong-ban",
        title: "Phòng ban"
    },
    AUTH_FORGOT_PW : {
        src: "/forgot-password",
        title: "Quên mật khẩu"
    },
    AUTH_LOGIN: {
        src: "/login",
        title: "Đăng nhập"
    },
    AUTH_REGISTER : {
        src: "/register",
        title: "Đăng ký"
    },
    AUTH_VERIFY: {
        src: "/verify",
        title: "Xác thực người dùng"
    },
    AUTH_UNVERIFIED : {
        src: "/unverified",
        title: "Yêu cầu xác thực"
    },
    AUTH_RESET_PW : {
        src: "/reset-password",
        title: "Đặt lại mật khẩu"
    },
    CHANGE_EMAIL : {
        src: "/change/email",
        title: "Đổi email"
    },
    CHANGE_PW : {
        src: "/change/password",
        title: "Đổi mật khẩu"
    },
    DHN : {
        src: KD_DHN, 
        title: "Đồng hồ nước"
    },
    DHN_ADD : {
        src: KD_DHN + "/them-moi",
        title: "Thêm mới kiểm định"
    },
    DHN_EDIT_DH : {
        src: KD_DHN + "/chinh-sua",
        title: "Chỉnh sửa kiểm định"
    },
    DHN_EDIT_NDH : {
        src: KD_DHN + "/chinh-sua/nhom",
        title: "Chỉnh sửa kiểm định nhóm"
    },
    DHN_DETAIL_DH : {
        src: KD_DHN + "/chi-tiet",
        title: "Chi tiết kiểm định"
    },
    DHN_DETAIL_NDH : {
        src: KD_DHN + "/chi-tiet/nhom",
        title: "Chi tiết kiểm định nhóm"
    },
    PDM : {
        src: _PDM,
        title: "Phê duyệt mẫu"
    },
    PDM_DETAIL : {
        src: _PDM + "/chi-tiet",
        title: "Chi tiết phê duyệt mẫu"
    },
    PDM_ADD : {
        src: _PDM + "/them-moi",
        title: "Thêm mới phê duyệt mẫu"
    },
    // Hiệu chuẩn
    HC_DHN : {
        src: HC_DHN, 
        title: "Đồng hồ nước"
    },
    HC_DHN_ADD : {
        src: HC_DHN + "/them-moi",
        title: "Thêm mới hiệu chuẩn"
    },
    HC_DHN_EDIT_DH : {
        src: HC_DHN + "/chinh-sua",
        title: "Chỉnh sửa hiệu chuẩn"
    },
    HC_DHN_EDIT_NDH : {
        src: HC_DHN + "/chinh-sua/nhom",
        title: "Chỉnh sửa nhóm hiệu chuẩn"
    },
    HC_DHN_DETAIL_DH : {
        src: HC_DHN + "/chi-tiet",
        title: "Chi tiết hiệu chuẩn"
    },
    HC_DHN_DETAIL_NDH : {
        src: HC_DHN + "/chi-tiet/nhom",
        title: "Chi tiết hiệu chuẩn nhóm"
    },

    // Phòng ban
    PB_DHN : {
        src: _PB, 
        title: "Phòng ban"
    },
    PB_DHN_ADD : {
        src: _PB + "/them-moi",
        title: "Thêm phòng ban"
    },
    PB_DHN_EDIT: {
        src: _PB + "/chinh-sua",
        title: "Chỉnh sửa phòng ban"
    },
    PB_DHN_DETAIL : {
        src: _PB + "/chi-tiet",
        title: "Chi tiết phòng ban"
    },
}