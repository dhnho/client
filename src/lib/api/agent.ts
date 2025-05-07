import axios from "axios";
// import { toast } from "react-toastify";
import { store } from "../stores/store";
import { getLoginResponse, getToken } from "../util/util";
// import { store } from "../stores/store";

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

agent.interceptors.request.use(async config => {
    const token = getToken()

    if(token)
        config.headers.Authorization = `Bearer ${token}`

    return config;
});


agent.interceptors.response.use(
    async response => response,
    async error => {
        const originalRequest = error.config;
        const { status } = error.response || {};

        if (status === 401 && !originalRequest._retry) {
            store.uiStore.isBusy();

            try {
                const loginResponse = getLoginResponse();

                if (!loginResponse) {
                    window.location.href = '/login';
                    return;
                }

                originalRequest._retry = true;

                const refreshTokenResponse = await axios.post<LoginResponse>(
                    `${import.meta.env.VITE_API_URL}/account/refresh-token`,
                    loginResponse
                );

                const { token, refreshToken } = refreshTokenResponse.data;

                // Cập nhật token mới
                loginResponse.token = token;
                loginResponse.refreshToken = refreshToken;

                localStorage.setItem('loginResponse', JSON.stringify(loginResponse));

                store.uiStore.isIdle();

                // Gắn token mới và gửi lại request cũ
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return agent(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('loginResponse');
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                store.uiStore.isIdle();
            }
        }

        return Promise.reject(error);
    }
);


export default agent;