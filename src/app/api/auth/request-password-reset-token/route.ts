import { BASE_API_URL } from '@lib/system-constant';
import axios from 'axios';

const API_AUTH_URL = `${BASE_API_URL}/auth`;

export const requestPasswordResetToken = async (email: string) => {
    try {
        const response = await axios.post(`${API_AUTH_URL}/send-password-reset-token`, {
            "email": email
        });

        console.log(response);

        if (response.status === 200) {
            return {
                "status": 200,
                "msg": 'Gửi mail thành công! Hãy kiểm tra hòm thư của bạn!'
            };
        } else {
            return {
                "status": response?.status || 500,
                "msg": response?.data?.msg || 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    } catch (error: any) {
        return {
            "status": error.response?.status || 500,
            "msg": error.response?.data?.msg || 'Có lỗi đã xảy ra. Hãy thử lại!'
        };
    }
};