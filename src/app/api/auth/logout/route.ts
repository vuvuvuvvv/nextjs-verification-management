// import axios from 'axios';
import api from '../../route';
import Cookies from 'js-cookie';

const API_AUTH_URL = `${process.env.NEXT_API_URL}/auth`;

export const logout = async () => {
    const response = await api.post(`${API_AUTH_URL}/logout`);
    if (response.status == 200) {
        const allCookies = Cookies.get();
        
        for (const cookieName in allCookies) {
            Cookies.remove(cookieName, { path: '/' });
        }
    }
};
