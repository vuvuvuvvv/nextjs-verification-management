import { BASE_API_URL } from '@lib/system-constant';
import { DongHo, DongHoFilterParameters } from '@lib/types';
import api from '../route';

const API_DONGHO_URL = `${BASE_API_URL}/dongho`;

export const getDongHoByFilter = async (parameters?: DongHoFilterParameters) => {
    try {
        const url = new URL(API_DONGHO_URL);

        if (parameters?.serinumber) {
            url.searchParams.append('serinumber', parameters.serinumber.toString());
        }

        if (parameters?.tenkhachhang) {
            url.searchParams.append('tenkhachhang', parameters.tenkhachhang.toString());
        }

        if (parameters?.namsanxuat_from) {
            url.searchParams.append('namsanxuat_from', parameters.namsanxuat_from.toString());
        }

        if (parameters?.namsanxuat_to) {
            url.searchParams.append('namsanxuat_to', parameters.namsanxuat_to.toString());
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
                "msg": error.response.data.msg || 'Error fetching DongHo data!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'An error occurred. Please try again!'
            };
        }
    }
};

export const getDongHoBySerinumber = async (serinumber: string) => {
    try {
        const url = `${API_DONGHO_URL}/serinumber/${serinumber.toString()}`;
        
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
                "msg": error.response.data.msg || 'Error fetching DongHo data!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'An error occurred. Please try again!'
            };
        }
    }
};

export const getDongHoByTenkhachhang = async (tenkhachhang: string) => {
    try {
        const url = `${API_DONGHO_URL}/tenkhachhang/${tenkhachhang.toString()}`;
        
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
                "msg": error.response.data.msg || 'Error fetching DongHo data!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'An error occurred. Please try again!'
            };
        }
    }
};

export const createDongHo = async (dongho: DongHo) => {
    try {
        const response = await api.post(API_DONGHO_URL, dongho, { withCredentials: true });

        return {
            "status": response.status,
            "data": response.data,
            "msg": response.data.msg || "DongHo created successfully!"
        };

    } catch (error: any) {
        if (error.response?.data?.data) {
            return {
                "status": error.response.status,
                "data": error.response.data.data,
                "msg": "Error: " + error.response.data.msg || 'Error creating DongHo!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'An error occurred. Please try again!'
            };
        }
    }
};

export const deleteDongHo = async (serinumber: string) => {
    try {
        const response = await api.delete(`${API_DONGHO_URL}/serinumber/${serinumber}`, { withCredentials: true });

        return {
            "status": response.status,
            "msg": response.data.msg || "DongHo deleted successfully!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": error.response.data.msg || 'Error deleting DongHo!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'An error occurred. Please try again!'
            };
        }
    }
};