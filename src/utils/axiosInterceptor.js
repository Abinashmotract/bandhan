import axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { API_BASE_URL } from './api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Add token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh on 401 responses
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = Cookies.get('refreshToken');
                if (!refreshToken) {
                    store.dispatch(logout());
                    return Promise.reject(error);
                }
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    { refreshToken },
                    { withCredentials: true }
                );
                const { accessToken } = response.data.data;
                Cookies.set('accessToken', accessToken, { expires: 1 });
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
