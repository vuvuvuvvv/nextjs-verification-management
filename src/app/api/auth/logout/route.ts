import api from '@/app/api/route';
import Cookies from 'js-cookie';

const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const logout = async () => {
    try {
        const response = await api.post(`${API_AUTH_URL}/logout`, {}, { withCredentials: true });

        const allCookies = Cookies.get(); // Get all cookies
        for (let cookie in allCookies) {
            Cookies.remove(cookie); // Remove each cookie
        }

        if (response.status === 200) {
            return {
                "status": 200,
                "msg": 'Đăng xuất thành công!'
            };
        } else if (response.status === 401) {
            return {
                "status": 401,
                "msg": 'Phiên đăng nhập hết hạn!'
            };
        }
    } catch (error: any) {
        const allCookies = Cookies.get(); // Get all cookies
        for (let cookie in allCookies) {
            Cookies.remove(cookie); // Remove each cookie
        }

        if (error.response?.status == 401) {
            return {
                "status": error.response.status,
                "msg": "Phiên đăng nhập hết hạn!"
            };
        } else {
            return {
                "status": error.response.status,
                "msg": error.response.data.message || 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};