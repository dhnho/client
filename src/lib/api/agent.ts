import axios from "axios";
import { toast } from "react-toastify";
// import { store } from "../stores/store";

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

agent.interceptors.request.use(async config => {
    return config;
});

agent.interceptors.response.use(
    async response => {
        return response;
    },
    async error => {
        // store.uiStore.isIdle();
        const { status, data, config } = error.response;

        switch (status) {
            case 401:
                if (error.response && error.response.data.error === 'Expired') {
                    try {
                        // localStorage.setItem('returnUrl', window.location.pathname);
                        await axios.post(import.meta.env.VITE_API_URL + '/account/refresh-token', {}, { withCredentials: true })
                        return agent(config)
                    } catch {
                        window.location.href = '/login'
                        return Promise.reject(error);
                    }
                }

                break;

            case 400:
                toast.error(data.message);
                break;

            default:
                toast.error("Đã xảy ra lỗi không xác định");
        }

        throw error
    }
);

export default agent;