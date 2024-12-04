import { BASE_API_URL } from '@lib/system-constant';
import { PDM, PDMData, PDMFilterParameters } from '@lib/types';
import api from '../route';

const API_PDM_URL = `${BASE_API_URL}/pdm`;

export const getPDMByFilter = async (parameters?: PDMFilterParameters) => {

    try {
        const url = new URL(API_PDM_URL);

        // if (parameters?.ma_tim_dong_ho_pdm) {
        //     url.searchParams.append('ma_tim_dong_ho_pdm', parameters.ma_tim_dong_ho_pdm.toString());
        // }

        if (parameters?.ten_dong_ho) {
            url.searchParams.append('ten_dong_ho', parameters.ten_dong_ho.toString());
        }

        if (parameters?.so_qd_pdm) {
            url.searchParams.append('so_qd_pdm', parameters.so_qd_pdm.toString());
        }

        if (parameters?.ngay_qd_pdm_from) {
            url.searchParams.append('ngay_qd_pdm_from', parameters.ngay_qd_pdm_from.toString());
        }

        if (parameters?.ngay_qd_pdm_to) {
            url.searchParams.append('ngay_qd_pdm_to', parameters.ngay_qd_pdm_to.toString());
        }

        if (parameters?.tinh_trang) {
            url.searchParams.append('tinh_trang', parameters.tinh_trang.toString());
        }

        if (parameters?.dn) {
            url.searchParams.append('dn', parameters.dn.toString());
        }

        if (parameters?.ccx) {
            url.searchParams.append('ccx', parameters.ccx.toString());
        }

        if (parameters?.kieu_sensor) {
            url.searchParams.append('kieu_sensor', parameters.kieu_sensor.toString());
        }

        if (parameters?.transmitter) {
            url.searchParams.append('transmitter', parameters.transmitter.toString());
        }

        const response = await api.get(url.toString(), { withCredentials: true });

        return {
            "status": response.status,
            "data": response.data,
            "msg": response.data.msg || "Done!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu PDM!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};

export const getPDMBySoQDPDM = async (so_qd_pdm: string) => {

    try {
        const url = API_PDM_URL + "/so_qd_pdm/" + so_qd_pdm.toString();

        const response = await api.get(url.toString(), { withCredentials: true });

        return {
            "status": response.status,
            "data": response.data,
            "msg": "Done!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu PDM!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};

export const getPDMByMaTimDongHoPDM = async (ma_tim_dong_ho_pdm: string) => {

    try {
        const url = API_PDM_URL + "/ma_tim_dong_ho_pdm/" + ma_tim_dong_ho_pdm.toString();

        const response = await api.get(url.toString(), { withCredentials: true });

        return {
            "status": response.status,
            "data": response.data,
            "msg": "Done!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu PDM!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};


export const createPDM = async (pdm: PDM) => {
    try {
        const response = await api.post(API_PDM_URL, pdm, { withCredentials: true });

        return {
            "status": response.status,
            "data": response.data,
            "msg": "Phê duyệt mẫu tạo mới thành công!"
        };

    } catch (error: any) {
        return {
            "status": error.response?.status || 500,
            "msg": 'Đã có lỗi xảy ra! Hãy thử lại sau.'
        };
    }
};

export const updatePDM = async (pdm: PDMData) => {
    try {
        const response = await api.put(API_PDM_URL, pdm, { withCredentials: true });

        return {
            "status": response.status,
            "data": response.data,
            "msg": "Phê duyệt mẫu cập nhật thành công!"
        };

    } catch (error: any) {
        return {
            "status": error.response?.status || 500,
            "msg": 'Đã có lỗi xảy ra! Hãy thử lại sau.'
        };
    }
};

export const deletePDM = async (ma_tim_dong_ho_pdm: string) => {
    try {
        const response = await api.delete(`${API_PDM_URL}/ma_tim_dong_ho_pdm/${ma_tim_dong_ho_pdm}`, { withCredentials: true });

        return {
            "status": response.status,
            "msg": "Đã xóa!"
        };

    } catch (error: any) {
        return {
            "status": error.response?.status || 500,
            "msg": 'Đã có lỗi xảy ra! Hãy thử lại sau.'
        };
    }
};