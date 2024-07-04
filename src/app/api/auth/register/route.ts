// import api from '@/app/api/route';
import axios from 'axios';
import Cookies from 'js-cookie';

import { RegisterCredentials } from '@lib/types';

const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const register = async (credentials: RegisterCredentials) => {
    try {
        const response = await axios.post(`${API_AUTH_URL}/register`, credentials, { withCredentials: true });

        if (response.status == 200) {
            Cookies.set('accessToken', response.data.access_token, { expires: 1 });
            Cookies.set('refreshToken', response.data.refresh_token, { expires: 7 });
            Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
        }
        return response.data;

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": error.response.data.msg || 'Lỗi đăng k!'
            };
        } else {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};