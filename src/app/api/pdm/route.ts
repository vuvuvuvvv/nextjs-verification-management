import { BASE_API_URL } from '@lib/system-constant';
import { PDM, PDMFilterParameters } from '@lib/types';
import api from '../route';

const API_PRODUCTS_URL = `${BASE_API_URL}/pdm`;

export const getPDM = async (parameters?: PDMFilterParameters) => {

    try {
        const url = new URL(API_PRODUCTS_URL);

        if (parameters?.ma_tim_dong_ho_pdm) {
            url.searchParams.append('ma_tim_dong_ho_pdm', parameters.ma_tim_dong_ho_pdm.toString());
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

        console.log(parameters?.tinh_trang);
        
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
                "msg": error.response.data.msg || 'Lỗi khi lấy dữ liệu PDM!'
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
        const response = await api.post(API_PRODUCTS_URL, pdm, { withCredentials: true });

        return {
            "status": response.status,
            "data": response.data,
            "msg": response.data.msg || "PDM created successfully!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": error.response.data.msg || 'Error creating PDM!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'An error occurred. Please try again!'
            };
        }
    }
};

export const deletePDM = async (id: number) => {
    try {
        const response = await api.delete(`${API_PRODUCTS_URL}/${id}`, { withCredentials: true });

        return {
            "status": response.status,
            "msg": response.data.msg || "PDM deleted successfully!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": error.response.data.msg || 'Error deleting PDM!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'An error occurred. Please try again!'
            };
        }
    }
};