import axios from 'axios';
import Cookies from 'js-cookie';
import { logout } from './auth/logout/route';
import { BASE_API_URL } from '@lib/system-constant';

const API_AUTH_URL = `${BASE_API_URL}/auth`;
let isRefreshing = false;
let failedQueue: any[] = [];
let retryCount = 0;
const MAX_RETRY_COUNT = 3;

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

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
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            if (retryCount >= MAX_RETRY_COUNT) {
                logout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            retryCount++;

            const refreshToken = Cookies.get('refreshToken');
            return new Promise(function(resolve, reject) {
                axios.post(`${API_AUTH_URL}/refresh`, {}, {
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`
                    },
                }).then(({ data }) => {
                    Cookies.set('accessToken', data.access_token);
                    originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                    processQueue(null, data.access_token);
                    resolve(axios(originalRequest));
                }).catch((err) => {
                    processQueue(err, null);
                    reject(err);
                }).finally(() => {
                    isRefreshing = false;
                });
            });
        }

        return Promise.reject(error);
    }
);

export default api;