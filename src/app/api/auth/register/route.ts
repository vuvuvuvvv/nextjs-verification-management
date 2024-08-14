// import api from '@/app/api/route';
import axios from 'axios';
import Cookies from 'js-cookie';

import { RegisterCredentials } from '@lib/types';
import { BASE_API_URL } from '@lib/system-constant';

const API_AUTH_URL = `${BASE_API_URL}/auth`;

export const register = async (credentials: RegisterCredentials) => {
    try {
        const response = await axios.post(`${API_AUTH_URL}/register`, credentials, { withCredentials: true });

        if (response.status == 200) {
            Cookies.set('accessToken', response.data.access_token, { expires: 1 });
            Cookies.set('refreshToken', response.data.refresh_token, { expires: undefined });
            Cookies.set('user', JSON.stringify(response.data.user), { expires: undefined });
            
            return {
                "status": response.status,
                "msg": response.data.msg || "Đăng ký thành công!",
                "user": response.data.user
            }
        } else {
            console.log(response.data)
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