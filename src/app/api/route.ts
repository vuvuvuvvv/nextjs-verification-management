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

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response != undefined && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshSubscribers.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axios(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = Cookies.get('refreshToken');
            if (!refreshToken) {
                logout();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_AUTH_URL}/refresh`, {}, {
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`
                    },
                    withCredentials: true
                });

                const newAccessToken = response.data.access_token;
                Cookies.set('accessToken', newAccessToken);
                Cookies.set('user', JSON.stringify(response.data.user));

                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                refreshSubscribers.forEach(callback => callback(newAccessToken));
                refreshSubscribers = [];
                isRefreshing = false;

                return axios(originalRequest);
            } catch (err) {
                logout();
                // window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;