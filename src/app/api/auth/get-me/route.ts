import Cookies from 'js-cookie';
import api from '@/app/api/route';
import { BASE_API_URL } from '@lib/system-constant';

const API_AUTH_URL = `${BASE_API_URL}/auth`;

export const getMe = async (accessToken: string) => {
    // console.log("get-me token:", accessToken);

    try {
        const response = await api.get(`${API_AUTH_URL}/me`, { withCredentials: true, headers: {
            'Authorization': `Bearer ${accessToken}`
        } });
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": error.response.data.msg || 'Error!'
            };
        } else {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};