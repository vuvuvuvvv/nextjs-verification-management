import Cookies from 'js-cookie';
// import api from '@/app/api/route';
import axios from 'axios';
import { LoginCredentials } from '@lib/types';
import { BASE_API_URL } from '@lib/system-constant';

const API_AUTH_URL = `${BASE_API_URL}/auth`;

export const login = async (credentials: LoginCredentials) => {

    try {

        const response = await axios.post(`${API_AUTH_URL}/login`, credentials, { withCredentials: true });

        if (response.data.access_token && response.data.user && response.data.refresh_token) {
            Cookies.set('accessToken', response.data.access_token, { expires: new Date(new Date().getTime() + 10 * 1000) });
            Cookies.set('user', JSON.stringify(response.data.user), { expires: credentials.remember ? 3 : undefined });
            Cookies.set('refreshToken', response.data.refresh_token, { expires: credentials.remember ? 3 : undefined });
            
            return {
                "status": response.status,
                "msg": response.data.msg || "Đăng nhập thành công!",
                "user": response.data.user
            }
        } else {
            return {
                "status": response.status,
                "msg": response.data.msg || "Có lỗi đã xảy ra. Hãy thử lại!",

            }
        }

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": error.response.data.msg || 'Lỗi đăng nhập!'
            };
        } else {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};