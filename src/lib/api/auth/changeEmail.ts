import Cookies from 'js-cookie';
import api from '@/lib/api/instance';
import { ResetEmailCredentials } from '@/lib/types';
import { useUser } from '@/context/AppContext';
import { BASE_API_URL } from '@/lib/system-constant';

const API_AUTH_URL = `${BASE_API_URL}/auth`;

const resetEmail = async (credentials: ResetEmailCredentials) => {

    try {
        const response = await api.post(`${API_AUTH_URL}/change/email`, credentials, { withCredentials: true });
        if (response.data.access_token && response.data.user && response.data.refresh_token) {
            Cookies.set('accessToken', response.data.access_token, { expires: 1 });
            Cookies.set('user', JSON.stringify(response.data.user), { expires: 3 });
            Cookies.set('refreshToken', response.data.refresh_token, { expires: 3 });

            return {
                "status": response.status,
                "msg": response.data.msg || "Email của bạn đã được đổi!",
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
                "msg": error.response.data.msg || 'Thay đổi email thất bại!'
            };
        } else {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};

export { resetEmail };