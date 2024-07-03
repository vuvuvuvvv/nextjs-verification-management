import axios from 'axios';
import type { NextRequest } from 'next/server';

export const getMe = async (req: NextRequest) => {
    try {
        const response = await axios.get(`${process.env.NEXT_API_URL}/auth/me`, {
            withCredentials: true,
            headers: {
                cookie: req.headers.get('cookie') || '',
            }
        });
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return {
                status: 401,
                message: 'Unauthorized. Please log in again.'
            };
        }
        throw error; // Re-throw other errors
    }
};

// export const getMe = async () => {
//     try {
//         const response = await api.get(`${API_AUTH_URL}/me`);
//         return response.data;
//     } catch (error: any) {
//         if (error.response?.data?.msg) {
//             return {
//                 "status": error.response.data.msg,
//                 "msg": error.response.data.msg || 'Error!'
//             };
//         } else {
//             return {
//                 "status": null,
//                 "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
//             };
//         }
//     }
// };