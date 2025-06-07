import api from '../route';
import { BASE_API_URL } from "@/lib/system-constant";
import { PhongBan, PhongBanFilterParameters, User, UserInPhongBan } from "@/lib/types";

const API_PHONGBAN_URL = `${BASE_API_URL}/phongban`;

interface APIResponse<T = any> {
    status: number;
    data?: T;
    msg: string;
}

// 1. Lấy danh sách tất cả phòng ban
export const getAllPhongBanByFilter = async (parameters: PhongBanFilterParameters): Promise<APIResponse<
    {
        data: PhongBan[];
        total_page: number;
        total_records: number;
    }>> => {
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
            data: res.data.data,
            msg: "Lấy danh sách phòng ban thành công!"
        };
    } catch (error: any) {
        return handlePhongBanError(error, "lấy danh sách phòng ban");
    }
}

// 2. Lấy phòng ban theo ID
export async function getPhongBanById(id: number): Promise<APIResponse<PhongBan>> {
    try {
        const res = await api.get(`${API_PHONGBAN_URL}/${id}`);
        return {
            status: res.status,
            data: res.data.data,
            msg: "Lấy phòng ban thành công!"
        };
    } catch (error: any) {
        return handlePhongBanError(error, `lấy phòng ban ID ${id}`);
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
        return handlePhongBanError(error, `lấy trưởng phòng ${username}`);
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
        return handlePhongBanError(error, `lấy thành viên theo phòng ban`);
    }
}

// 5. Lấy users đã/ chưa gia nhập phòng ban
export async function getUsersByPhongBanStatus(exceptPbId: number | null = null): Promise<APIResponse<{
    chua_tham_gia: UserInPhongBan[];
    da_tham_gia: UserInPhongBan[];
}>> {
    try {
        const res = await api.get(`${API_PHONGBAN_URL}/users/by-phongban` + (exceptPbId ? "/except/" + exceptPbId : ""));
        return {
            status: res.status,
            data: res.data.data,
            msg: "Lấy users theo phòng ban thành công!"
        };
    } catch (error: any) {
        return handlePhongBanError(error, "lấy users theo phòng ban");
    }
}

// Hàm xử lý lỗi dùng chung
function handlePhongBanError(error: any, context: string): APIResponse {
    if (error.response?.data?.msg) {
        return {
            status: error.response.status,
            msg: `Có lỗi xảy ra khi ${context}!`
        };
    } else {
        return {
            status: error.response?.status || 500,
            msg: `Có lỗi đã xảy ra khi xử lý ${context}. Hãy thử lại!`
        };
    }
}

export async function upsertPhongBan(data: {
    id_phong_ban?: number;
    ten_phong_ban?: string;
    truong_phong?: UserInPhongBan;
    members?: UserInPhongBan[];
}): Promise<APIResponse<PhongBan>> {
    try {
        const res = await api.post(API_PHONGBAN_URL, data, { withCredentials: true });
        return {
            status: res.status,
            data: res.data,
            msg: "Thêm hoặc cập nhật phòng ban thành công!"
        };
    } catch (error: any) {
        return handlePhongBanError(error, "thêm/cập nhật phòng ban");
    }
}


export async function addNhanVienPhongBan(data: {
    id: number; // ID của phòng ban muốn thêm vào
    members: UserInPhongBan[]; // Danh sách nhân viên cần thêm
}): Promise<APIResponse<PhongBan>> {
    try {
        const res = await api.post(`${API_PHONGBAN_URL}/nhan-vien`, data, { withCredentials: true });
        return {
            status: res.status,
            data: res.data,
            msg: "Thêm nhân viên vào phòng ban thành công!"
        };
    } catch (error: any) {
        return handlePhongBanError(error, "thêm nhân viên vào phòng ban");
    }
}

export async function deleteNhanVienPhongBan(id: string): Promise<APIResponse<null>> {
    try {
        const res = await api.delete(`${API_PHONGBAN_URL}/nhan-vien/${id}`, { withCredentials: true });

        return {
            status: res.status,
            data: null,
            msg: "Đã gỡ nhân viên khỏi phòng ban thành công!",
        };
    } catch (error: any) {
        return handlePhongBanError(error, "gỡ nhân viên khỏi phòng ban");
    }
}


export async function deletePhongBan(id: string): Promise<APIResponse<null>> {
    try {
        const res = await api.delete(`${API_PHONGBAN_URL}/${id}`, { withCredentials: true });

        return {
            status: res.status,
            data: null,
            msg: "Đã gỡ nhân viên khỏi phòng ban thành công!",
        };
    } catch (error: any) {
        return handlePhongBanError(error, "gỡ nhân viên khỏi phòng ban");
    }
}
