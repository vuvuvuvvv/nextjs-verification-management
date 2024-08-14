import api from '@/app/api/route';
import { logout } from '../../logout/route';
import { ResetPasswordCredentials } from '@lib/types';
import { BASE_API_URL } from '@lib/system-constant';

const API_AUTH_URL = `${BASE_API_URL}/auth`;

export const resetPassword = async (credentials: ResetPasswordCredentials) => {

    try {
        const response = await api.post(`${API_AUTH_URL}/reset/password`, credentials, { withCredentials: true });
        if (response.data.access_token && response.data.user && response.data.refresh_token) {
            return {
                "status": response.status,
                "msg": response.data.msg || "Mật khẩu của bạn đã được đổi!",
            }
        } else {
            console.log("err res:", response);
            if (response.status = 404) {
                logout();
            }
            return {
                "status": response.status,
                "msg": response.data.msg || "Có lỗi đã xảy ra. Hãy thử lại!",

            }
        }
    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": error.response.data.msg || 'Thay đổi mật khẩu thất bại!'
            };
        } else {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};