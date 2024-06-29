// import axios from 'axios';
import api from '../../route';
import Cookies from 'js-cookie';

const API_AUTH_URL = `${process.env.BASE_URL}/api/auth`;

export const logout = async () => {
    const response = await api.post(`${API_AUTH_URL}/logout`);
    if (response.status == 200) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
    }
};
