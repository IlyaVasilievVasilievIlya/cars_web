import axios from "axios";
import { authStore } from "../../store/authStore";
import { PromiseCallback } from "../../components/model";

export const API_URL = "http://localhost:5202/api";
//5202
//10000

export const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": 'application/json;charset=utf-8'
    },
    withCredentials: true
})

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": 'application/json;charset=utf-8'
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

let isRefreshing = false;

let refreshQueue: PromiseCallback[] = [];

api.interceptors.response.use(response => {
    return response;
}, (async error => {
    const prevRequest = error.config;
    if (error?.response?.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;

            authStore.refreshToken().then(token => {
                if (token) {
                    authStore.setAuth(token);
                    refreshQueue.forEach((v) => v.resolve())
                    refreshQueue = [];
                }
            }).catch(error => {
                authStore.logOut();
                authStore.setError(undefined, 401);
                refreshQueue.forEach((v) => v.reject(error))
                refreshQueue = [];
            }).finally(() => {
                    isRefreshing = false
            })
        }

        return new Promise((resolve, reject) => {
            refreshQueue.push({
                resolve: () => {
                    resolve(api.request(prevRequest))
                },
                reject: (err: unknown) => {
                    reject(err)
                }
            })
        })
    }
    return Promise.reject(error);
}))