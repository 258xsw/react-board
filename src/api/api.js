// api.js
import axios from 'axios'
import { clearAuth, getToken } from './authApi';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

// Request Interceptor : 서버로 나가는 모든 요청에 JWT 자동 추가
api.interceptors.request.use((config) => {
    const token = getToken();
    // 헤더 추가
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response Interceptor
api.interceptors.response.use(
    (response) => response, // 200번대 성공

    (error) => {
        // error.response && error.response.status
        if (error.response?.status === 401) {
            clearAuth();
            // 현재 로그인 페이지가 아니면 리다이렉트
            if (!window.location.pathname.includes('/auth/login')) {
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);