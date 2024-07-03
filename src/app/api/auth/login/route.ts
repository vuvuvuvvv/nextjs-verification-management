import Cookies from 'js-cookie';
import axios from 'axios';
import { LoginCredentials } from '@lib/types';
import { getMe } from '../route';

const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const login = async (credentials: LoginCredentials) => {

    try {
        console.log(API_AUTH_URL);
        const response = await axios.post(`${API_AUTH_URL}/login`, credentials, {withCredentials: true});
        // const response = await axios.post(`${API_AUTH_URL}/logout`, {}, {withCredentials: true});
        console.log("Res login: ",response);

        if(response.status === 200) {
            const res = await getMe();
            console.log(res);
        }

        // return response.data;

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