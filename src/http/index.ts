import axios from "axios";
import { authStore } from "../store/authStore";

export const API_URL = "https://localhost:7154/api";


export const authApi = axios.create({
    baseURL: API_URL
})

export const api = axios.create({
    baseURL: API_URL
})

authApi.interceptors.request.use( config => {
    if (authStore.authData) {
        config.headers.Authorization = `bearer ${authStore.authData.accessToken}`;
    }
    config.headers["Content-Type"] = 'application/json;charset=utf-8';
    return config;
})

authApi.interceptors.response.use( config => {
    return config;
},  (error => {
    const errors: string[] = error.response.data;
    throw new Error(errors[0]);
}))

api.interceptors.request.use( config => {
    if (authStore.authData) {
        config.headers.Authorization = `bearer ${authStore.authData.accessToken}`;
    }
    config.headers["Content-Type"] = 'application/json;charset=utf-8';
    return config;
})

api.interceptors.response.use( config => {
    return config;
},  (async error =>  {
    const prevRequest = error?.config;
    if (error?.response.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        await authStore.refreshToken();
        return api(prevRequest);
    }
    return Promise.reject(error); 
}))