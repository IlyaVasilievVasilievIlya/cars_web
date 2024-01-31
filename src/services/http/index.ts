import axios from "axios";
import { authStore } from "../../store/authStore";

export const API_URL = "http://localhost:10000/api";

export const authApi = axios.create({
    baseURL: API_URL
})

export const api = axios.create({
    baseURL: API_URL
})

authApi.interceptors.request.use(config => {
    if (authStore.authData) {
        config.headers.Authorization = `bearer ${authStore.authData.accessToken}`;
    }
    config.headers["Content-Type"] = 'application/json;charset=utf-8';
    return config;
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
    if (authStore.authData) {
        config.headers.Authorization = `bearer ${authStore.authData.accessToken}`;
    }
    config.headers["Content-Type"] = 'application/json;charset=utf-8';
    return config;
})

let refreshTokenPromise: Promise<void> | null;

api.interceptors.response.use(config => {
    return config;
}, (async error => {
    const prevRequest = error.config;
    if (error?.response?.status === 401) {
        if (!refreshTokenPromise) {
            refreshTokenPromise = authStore.refreshToken();
        }
        return refreshTokenPromise.then(() => {
            refreshTokenPromise = null;
            return api(prevRequest);
        }).catch(error => {
            authStore.logout();
            authStore.setError(undefined, 401);
        })
    }
    return Promise.reject(error);
}))