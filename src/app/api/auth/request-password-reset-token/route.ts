import axios from 'axios';

const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const requestPasswordResetToken = async (email: string) => {
    try {
        const response = await axios.post(`${API_AUTH_URL}/send-password-reset-token`, {
            "email": email
        }, { withCredentials: true });

        if (response.status === 200) {
            return {
                "status": 200,
                "msg": 'Gửi mail thành công! Hãy kiểm tra hòm thư của bạn!'
            };
        } else {
            return {
                "status": response.status,
                "msg": response.data.msg || "Có lỗi đã xảy ra. Hãy thử lại!",

            }
        }
    } catch (error: any) {
        return {
            "status": error.response?.status || error?.msg || error?.message || 'Có lỗi đã xảy ra. Hãy thử lại!',
            "msg": error.response?.data.message || error.response?.msg || error.response?.message || 'Có lỗi đã xảy ra. Hãy thử lại!'
        };
    }
};