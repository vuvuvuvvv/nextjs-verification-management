import axios from 'axios';
import Cookies from 'js-cookie';
import { logout } from './auth/logout/route';

const API_URL = process.env.NEXT_PUBLIC_URL;
const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, 
});

api.interceptors.request.use(config => {
    const token = Cookies.get('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${ token }`;
    }
    return config;
});

export default api;