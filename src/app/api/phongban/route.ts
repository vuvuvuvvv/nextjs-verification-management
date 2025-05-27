import api from '../route';
import { BASE_API_URL } from "@lib/system-constant";
import { PhongBanFilterParameters, User } from "@lib/types";

const API_PHONGBAN_URL = `${BASE_API_URL}/phongban`;

export interface PhongBan {
    id: number;
    ten_phong: string;
    truong_phong_username?: string;
}

export interface UserInPhongBan {
    user: User;
    is_manager: boolean | null;
    phong_ban_id: number | null;
    phong_ban: string | null;
}

interface APIResponse<T = any> {
    status: number;
    data?: T;
    msg: string;
}

// 1. Lấy danh sách tất cả phòng ban
export const getAllPhongBanByFilter = async (parameters: PhongBanFilterParameters): Promise<APIResponse<PhongBan[]>> => {
    try {
        const url = new URL(API_PHONGBAN_URL);
        if (parameters?.ten_phong_ban) {
            url.searchParams.append('ten_phong_ban', parameters.ten_phong_ban.toString());
        }

        if (parameters?.truong_phong) {
            url.searchParams.append('truong_phong', parameters.truong_phong.toString());
        }

        if (parameters?.ngay_tao_from) {
            url.searchParams.append('ngay_tao_from', parameters.ngay_tao_from.toString());
        }

        if (parameters?.ngay_tao_to) {
            url.searchParams.append('ngay_tao_to', parameters.ngay_tao_to.toString());
        }

        if (parameters?.limit) {
            url.searchParams.append('limit', parameters.limit.toString());
        }

        if (parameters?.last_seen) {
            url.searchParams.append('last_seen', parameters.last_seen.toString());
        }

        if (parameters?.next_from) {
            url.searchParams.append('next_from', parameters.next_from.toString());
        }

        if (parameters?.prev_from) {
            url.searchParams.append('prev_from', parameters.prev_from.toString());
        }

        const res = await api.get(url.toString(), { withCredentials: true });
        return {
            status: res.status,
            data: res.data,
            msg: "Lấy danh sách phòng ban thành công!"
        };
    } catch (error: any) {
        return handlePhongBanError(error, "danh sách phòng ban");
    }
}

// 2. Lấy phòng ban theo ID
export async function getPhongBanById(id: number): Promise<APIResponse<PhongBan>> {
    try {
        const res = await api.get(`${API_PHONGBAN_URL}/${id}`);
        return {
            status: res.status,
            data: res.data,
            msg: "Lấy phòng ban thành công!"
        };
    } catch (error: any) {
        return handlePhongBanError(error, `phòng ban ID ${id}`);
    }
}

// 3. Lấy phòng ban theo username của trưởng phòng
export async function getPhongBanByTruongPhong(username: string): Promise<APIResponse<PhongBan>> {
    try {
        const res = await api.get(`${API_PHONGBAN_URL}/truongphong/${username}`);
        return {
            status: res.status,
            data: res.data,
            msg: "Lấy phòng ban theo trưởng phòng thành công!"
        };
    } catch (error: any) {
        return handlePhongBanError(error, `trưởng phòng ${username}`);
    }
}

// 4. Lấy danh sách members của phòng ban theo ID
export async function getMembersByPhongBanId(id: number): Promise<APIResponse<any[]>> {
    try {
        const res = await api.get(`${API_PHONGBAN_URL}/members/${id}`);
        return {
            status: res.status,
            data: res.data,
            msg: "Lấy thành viên phòng ban thành công!"
        };
    } catch (error: any) {
        return handlePhongBanError(error, `thành viên phòng ban ID ${id}`);
    }
}

// 5. Lấy users đã/ chưa gia nhập phòng ban
export async function getUsersByPhongBanStatus(): Promise<APIResponse<{
    chua_gia_nhap: UserInPhongBan[];
    da_gia_nhap: UserInPhongBan[];
}>> {
    try {
        const res = await api.get(`${BASE_API_URL}/users/by-phongban`);
        return {
            status: res.status,
            data: res.data,
            msg: "Lấy users theo phòng ban thành công!"
        };
    } catch (error: any) {
        return handlePhongBanError(error, "users theo phòng ban");
    }
}

// Hàm xử lý lỗi dùng chung
function handlePhongBanError(error: any, context: string): APIResponse {
    if (error.response?.data?.msg) {
        return {
            status: error.response.status,
            msg: `Có lỗi xảy ra khi lấy dữ liệu ${context}!`
        };
    } else {
        return {
            status: error.response?.status || 500,
            msg: `Có lỗi đã xảy ra khi xử lý ${context}. Hãy thử lại!`
        };
    }
}
