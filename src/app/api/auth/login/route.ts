import Cookies from 'js-cookie';
import api from '../../route';
import { LoginCredentials } from '@lib/types';

const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const login = async (credentials: LoginCredentials) => {

    try {

        const response = await api.post(`${API_AUTH_URL}/login`, credentials, { withCredentials: true });

        if (response.status == 200) {
            Cookies.set('accessToken', response.data.access_token, { expires: 1 }); // Set cookie with expiration
            Cookies.set('refreshToken', response.data.refresh_token, { expires: 7 }); // Set cookie with expiration
            Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 }); // Set cookie with expiration
        }
        return response;

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.data.msg,
                "msg": error.response.data.msg || 'Lỗi đăng nhập!'
            };
        } else {
            return {
                "status": null,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};