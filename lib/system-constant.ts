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
    { value: 5, label: 5 },
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

export const DEFAULT_LOCATION = "Công ty Cổ phần Công nghệ và Thương mại FMS"
export const INDEXED_DB_NAME = "FMS_VFM_DB"
export const INDEXED_DB_DH_OBJ_NAME = "DongHo"

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Acess links:
const KD_PDM = "/kiem-dinh/pdm"
const KD_DHN = "/kiem-dinh/dong-ho-nuoc"
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
        src: "/phan-quyen",
        title: "Phân quyền"
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
        title: "Thêm mới đồng hồ nước"
    },
    DHN_DETAIL : {
        src: KD_DHN + "/chi-tiet",
        title: ""
    },
    PDM : {
        src: KD_PDM,
        title: "Phê duyệt mẫu"
    },
    PDM_DETAIL : {
        src: KD_PDM + "/chi-tiet",
        title: ""
    },
    PDM_ADD : {
        src: KD_PDM + "/them-moi",
        title: "Thêm mới phê duyệt mẫu"
    },
}