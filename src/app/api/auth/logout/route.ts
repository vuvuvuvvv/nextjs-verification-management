// import axios from 'axios';
import api from '../../route';
import Cookies from 'js-cookie';

const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const logout = async () => {
    const token = Cookies.get('accessToken'); // Lấy giá trị accessToken từ cookies
    console.log("logout token:", token);
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


// import api from '../../route';
// import Cookies from 'js-cookie';

// const API_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

// export const logout = async () => {
//     const token = Cookies.get('accessToken'); // Lấy giá trị accessToken từ cookies
//     console.log("logout token:", token);
//     try {
//         const response = await api.post(`${API_AUTH_URL}/logout`, {}, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             },
//             withCredentials: true
//         });
//         if (response.status === 200) {
//             const allCookies = Cookies.get(); // Get all cookies
//             for (let cookie in allCookies) {
//                 Cookies.remove(cookie); // Remove each cookie
//             }
//             window.location.href = '/login';
//         }
//         return response;
//     } catch (error) {
//         console.error("Logout error: ", error);
//         if (error instanceof Error) {
//             return error.message;
//         } else {
//             return 'An unknown error occurred';
//         }
//     }
// };