import Cookies from 'js-cookie';
import api from '../../route';                 // use instance

const API_AUTH_URL = `${process.env.BASE_URL}/api/auth`;

export const getMe = async () => {
    try {
        const response = await api.get(`${API_AUTH_URL}/me`);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.data.msg,
                "msg": error.response.data.msg || 'Error!'
            };
        } else {
            return {
                "status": null,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};