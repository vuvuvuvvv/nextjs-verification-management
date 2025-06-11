import api from '@/lib/api/instance';
import { eventEmitter } from '@/lib/eventEmitter';
import { BASE_API_URL } from '@/lib/system-constant';
import Cookies from 'js-cookie';

const API_AUTH_URL = `${BASE_API_URL}/auth`;

const logout = async () => {
    try {
        const response = await api.post(`${API_AUTH_URL}/logout`, {}, { withCredentials: true });

        const allCookies = Cookies.get(); // Get all cookies
        for (let cookie in allCookies) {
            Cookies.remove(cookie); // Remove each cookie
        }

        if (response.status === 200 || response.status === 201) {
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
                "status": error.response?.status || error?.msg || error?.message || 'Có lỗi đã xảy ra. Hãy thử lại!',
                "msg": error.response?.data.message || error.response?.msg || error.response?.message || 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};

export { logout };