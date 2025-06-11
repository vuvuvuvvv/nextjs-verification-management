// import api from '@/lib/api/instance';
import axios from 'axios';
import Cookies from 'js-cookie';

import { RegisterCredentials } from '@/lib/types';
import { BASE_API_URL } from '@/lib/system-constant';

const API_AUTH_URL = `${BASE_API_URL}/auth`;

const register = async (credentials: RegisterCredentials) => {
    try {
        const response = await axios.post(`${API_AUTH_URL}/register`, credentials, { withCredentials: true });

        if (response.status == 201) {
            Cookies.set('accessToken', response.data.access_token, { expires: new Date(new Date().getTime() + 30 * 60 * 1000) });
            Cookies.set('refreshToken', response.data.refresh_token, { expires: 1 });
            Cookies.set('user', JSON.stringify(response.data.user), { expires: 1 });

            return {
                "status": response.status,
                "msg": response.data.msg || "Đăng ký thành công!",
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

export { register };