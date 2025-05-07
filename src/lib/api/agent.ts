import axios from "axios";
import { toast } from "react-toastify";
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
    async response => {
        return response;
    },
    async error => {
        // store.uiStore.isIdle();
        const { status, data, config } = error.response;

        switch (status) {
            case 401:
                store.uiStore.isBusy()
                try {
                    const loginResponse = getLoginResponse()
                    if(!loginResponse) {
                        // window.location.href = '/login'
                        return
                    }

                    const { data } = await axios.post<LoginResponse>(import.meta.env.VITE_API_URL + `/account/refresh-token?refreshToken=${loginResponse.refreshToken}`, {})
                    
                    loginResponse.token = data.token
                    loginResponse.refreshToken = data.refreshToken

                    localStorage.setItem('loginResponse', JSON.stringify(loginResponse))

                    store.uiStore.isIdle()
                    return agent(config)

                } catch {
                    localStorage.removeItem('loginResponse')
                    window.location.href = '/login'
                    return Promise.reject(error);
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