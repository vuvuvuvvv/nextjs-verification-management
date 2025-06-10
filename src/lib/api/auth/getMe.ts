
import api from '@/lib/api/instance';
import { BASE_API_URL } from '@/lib/system-constant';

const API_AUTH_URL = `${BASE_API_URL}/auth`;

const getMe = async () => {

    try {
        const response = await api.get(`${API_AUTH_URL}/me`);
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

export { getMe };