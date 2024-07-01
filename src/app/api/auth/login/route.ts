import Cookies from 'js-cookie';
// import api from '../../route';          // loop redirect cause there is no jwt
import axios from 'axios';
import { LoginCredentials } from '@lib/types';

const API_AUTH_URL = `${process.env.BASE_URL}/api/auth`;

export const login = async (credentials: LoginCredentials) => {

    try {

        const response = await axios.post(`${API_AUTH_URL}/login`, credentials);

        if (response.data.access_token) {
            Cookies.set('accessToken', response.data.access_token);
            Cookies.set('refreshToken', response.data.refresh_token);
        }
        return response.data;

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.data.msg,
                "msg": error.response.data.msg || 'Lỗi đăng nhập!'
            };
        } else {
            return {
                "status": null,
                "msg": 'Có lỗi đã xảy ra. Hãy thử lại!'
            };
        }
    }
};