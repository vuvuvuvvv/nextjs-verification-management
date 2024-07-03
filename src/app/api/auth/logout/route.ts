import axios from 'axios';
import Cookies from 'js-cookie';

const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const logout = async () => {
    const response = await axios.post(`${API_AUTH_URL}/logout`);
    console.log(response);
    if (response.status == 200) {
        // Remove cookie
        // Cookies.remove('accessToken');
        // Cookies.remove('refreshToken');
    }
};
