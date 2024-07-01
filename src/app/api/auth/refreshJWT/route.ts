import api from "../../route";
import Cookies from 'js-cookie';
import { logout } from "../route";
const BASE_URL = process.env.BASE_URL;
const API_URL = `${BASE_URL}/api`;

export const refreshJWT = async () => {
    try {
        const refreshToken = Cookies.get('refreshToken'); // Lấy refreshToken từ cookies
        if (!refreshToken) {
            // Cookies.remove('accessToken');
            // Cookies.remove('refreshToken');

            // logout();
            return null
        }
        const response = await api.post(`${API_URL}/refresh`, {}, { // Gửi yêu cầu refresh token
            headers: {
                'Authorization': `Bearer ${refreshToken}` // Gửi refreshToken trong Authorization header
            },
        });

        const data = response.data;

        if (data.status == 200) {
            const new_jwt = data.accessToken;
            Cookies.set('accessToken', new_jwt); // Lưu accessToken mới vào cookies
            return new_jwt;
        }
        return null;
    } catch (e) {
        // logout(); 
        console.error('Error refreshing token:', e);
        return null;
    }
};