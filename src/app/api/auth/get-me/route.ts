import Cookies from 'js-cookie';
import api from '../../route';

const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const getMe = async (accessToken: string) => {
    console.log("get-me token:", accessToken);

    try {
        const response = await api.get(`${API_AUTH_URL}/me`, { withCredentials: true, headers: {
            'Authorization': `Bearer ${accessToken}`
        } });
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