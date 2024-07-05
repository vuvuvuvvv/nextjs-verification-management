// import axios from 'axios';
import api from '@/app/api/route';
import Cookies from 'js-cookie';

const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const logout = async () => {
    const response = await api.post(`${API_AUTH_URL}/logout`, {withCredentials: true});
    if (response.status == 200) {
        const allCookies = Cookies.get(); // Get all cookies
        for (let cookie in allCookies) {
            Cookies.remove(cookie); // Remove each cookie
        }
        window.location.href = '/login';
    }
    return response;
};