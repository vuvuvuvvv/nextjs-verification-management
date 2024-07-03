import axios from 'axios';
import Cookies from 'js-cookie';
import path from 'path';
import { logout } from './auth/logout/route';

const NEXT_API_URL = process.env.NEXT_API_URL;
const API_URL = `${NEXT_API_URL}`;

const api = axios.create({
    baseURL: API_URL, // Thiết lập baseURL cho instance axios
});

api.interceptors.request.use(config => {
    const token = Cookies.get('accessToken'); // Lấy giá trị accessToken từ cookies
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Thêm Authorization header vào config của request
    }
    return config; // Trả về config đã được chỉnh sửa để tiếp tục thực hiện yêu cầu
});


api.interceptors.response.use(
    response => response, // Nếu yêu cầu thành công, trả về response nguyên thủy
    async error => { // Nếu có lỗi xảy ra
        const originalRequest = error.config; // Lưu trữ yêu cầu gốc
        if (error.response.status === 401 && !originalRequest._retry) { // Nếu lỗi là 401 Unauthorized và chưa thử lại
            originalRequest._retry = true; // Đánh dấu là đã thử lại
            try {
                const refreshToken = Cookies.get('refreshToken'); // Lấy refreshToken từ cookies
                const response = await axios.post(`${API_URL}/refresh`, {}, { // Gửi yêu cầu refresh token
                    headers: {
                        'Authorization': `Bearer ${refreshToken}` // Gửi refreshToken trong Authorization header
                    },
                });
                Cookies.set('accessToken', response.data.access_token); // Lưu accessToken mới vào cookies
                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`; // Cập nhật Authorization header cho yêu cầu gốc
                return axios(originalRequest); // Thử lại yêu cầu gốc với accessToken mới
            } catch (e) {
                logout(); // Đăng xuất người dùng (xóa cookies)
                window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
            }
        }
        return Promise.reject(error); // Nếu không phải lỗi 401 Unauthorized, reject promise với lỗi
    }
);


export default api;
