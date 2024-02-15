import axios from "axios";
import { authStore } from "../../store/authStore";

export const API_URL = "http://localhost:5202/api";
//5202
//10000

export const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type" : 'application/json;charset=utf-8'
    }
})

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type" : 'application/json;charset=utf-8'
    }
})

authApi.interceptors.response.use(config => {
    return config;
}, (error => {
    if (error.response) {
        authStore.setError(error.response.data[0], error.response.status)
    } else authStore.setError(error.message, error.code)
    return Promise.reject(error);
}))

api.interceptors.request.use(config => {
    if (authStore.User) {
        config.headers.Authorization = `bearer ${localStorage.getItem('accessToken')}`;
    }
    return config;
})

let refreshTokenPromise: Promise<void> | null;

api.interceptors.response.use(response => {
    return response;
}, (async error => {
    const prevRequest = error.config;
    if (error?.response?.status === 401) {
        if (!refreshTokenPromise) {
            refreshTokenPromise = authStore.refreshToken().then(token => {
                refreshTokenPromise = null; 
                if (token) {
                    authStore.setAuth(token);
                }})
        }
        return refreshTokenPromise.then(() => {
            return api.request(prevRequest);
        }).catch(_ => {
            authStore.logout();
            authStore.setError(undefined, 401);
        })
    }
    return Promise.reject(error);
}))