import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: "application/json",
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    window.location = '/login?session-expired';
}

axiosInstance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        const unixNow = dayjs().unix();
        // check if token is expired
        if (unixNow >= jwt_decode(token).exp) {
            logout();
        }
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
});

export default axiosInstance;