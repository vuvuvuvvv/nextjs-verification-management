import Cookies from 'js-cookie';
import axios from 'axios';

// import api from '../../route';                 // use instance

const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const getMe = async () => {
    try {
        const response = await axios.get(`${API_AUTH_URL}/me`, {withCredentials: true});
        console.log("response: ", response);
        // if(response.status == 200 && 'data' in response) {
        //     return response.data;
        // } else {
        //     return null;
        // }

        return response;
    } catch (error: any) {
        return null
    }
};