import api from '../../route';
import Cookies from 'js-cookie';

import { RegisterCredentials } from '@lib/types';

const API_AUTH_URL = `${process.env.NEXT_API_URL}/auth`;

export const register = async (credentials: RegisterCredentials) => {
    try {
        const response = await api.post(`${API_AUTH_URL}/register`, credentials);

        if (response.data.access_token) {
            Cookies.set('accessToken', response.data.access_token);
            Cookies.set('refreshToken', response.data.refresh_token);
        }
        return response.data;

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.data.msg,
                "msg": error.response.data.msg || 'Lỗi đăng ký!'
            };
        } else {
            return {
                "status": null,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};