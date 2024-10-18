import axios from 'axios';
import Cookies from 'js-cookie';
import { logout } from './auth/logout/route';
import { useUser } from '@/context/AppContext';
import { BASE_API_URL } from '@lib/system-constant';


const API_AUTH_URL = `${BASE_API_URL}/auth`;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const api = axios.create({
    baseURL: API_AUTH_URL,
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const token = Cookies.get('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
    response => response, // Nếu yêu cầu thành công, trả về response nguyên thủy
    async error => { // Nếu có lỗi xảy ra
        const originalRequest = error.config; // Lưu trữ yêu cầu gốc
        if (error.response.status === 401 && !originalRequest._retry) { // Nếu lỗi là 401 Unauthorized và chưa thử lại
            originalRequest._retry = true; // Đánh dấu là đã thử lại
            try {
                const refreshToken = Cookies.get('refreshToken'); // Lấy refreshToken từ cookies
                const response = await axios.post(`${API_AUTH_URL}/refresh`, {}, { // Gửi yêu cầu refresh token
                    headers: {
                        'Authorization': `Bearer ${refreshToken}` // Gửi refreshToken trong Authorization header
                    },
                });
                Cookies.set('accessToken', response.data.access_token); // Lưu accessToken mới vào cookies
                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`; // Cập nhật Authorization header cho yêu cầu gốc
                return axios(originalRequest); // Thử lại yêu cầu gốc với accessToken mới
            } catch (e) {
                logout(); 
            }
        }
        return Promise.reject(error); // Nếu không phải lỗi 401 Unauthorized, reject promise với lỗi
    }
);

export default api;

