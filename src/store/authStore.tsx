import { AuthInfo, LoginRequest, RegisterRequest } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { AuthService } from '../services/AuthService';
import { basketStore } from './basketStore';

class AuthStore {
    authData?: AuthInfo;

    error?: string;

    errorCode?: number;

    loading: boolean = false;

    constructor() {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const role = localStorage.getItem('role');
        if (accessToken && refreshToken && role)
        {       
            this.setAuthInfo({refreshToken, accessToken, role});
        }
        makeAutoObservable(this);
    }

    setAuthInfo(newAuthInfo?: AuthInfo){
        this.authData = newAuthInfo;
        if (this.authData) {
            for (const [key, value] of Object.entries(this.authData))
            localStorage.setItem(key, value);
    } else {
        localStorage.clear();
        basketStore.clear();
    };      
}

    setAuth(authInfo: AuthInfo) {
        const encodedClaims = authInfo.accessToken.split(".")[1];
        const role = JSON.parse(atob(encodedClaims)).role;
        this.setAuthInfo({...authInfo, role: role});
    }

    setError(error?: string, errorCode?: number) {
        this.error = error;
        this.errorCode = errorCode;
    }
    
    setLoading(loading: boolean) {
        this.loading = loading;
    }

    async login(loginCreds: LoginRequest){
        this.setError();
        this.setLoading(true);
        try {
            const response = await AuthService.login(loginCreds);
            this.setAuth(response.data);
        } catch (e) {
            console.log('login error '.concat((e as Error).message));
        } finally {
            this.setLoading(false);
        }
    }

    async register(registerInfo: RegisterRequest) {
        this.setError();
        this.setLoading(true);
        try {
            const response = await AuthService.register(registerInfo);
            this.setAuth(response.data);
        } catch (e) {
            console.log('register error '.concat((e as Error).message));
        } finally {
            this.setLoading(false);
        }
    }

    async refreshToken() {
        this.setError();
        if (!this.authData)
            return;
        try {
            const response = await AuthService.refresh(this.authData.refreshToken);
            this.setAuth(response.data);
        } catch (e) {
            console.log('refresh token error '.concat((e as Error).message));
            return Promise.reject();
        }
    }

    checkRole(roles?: string[]) {
        return roles?.includes(this.authData?.role ?? '')
    }


    logout(){
        this.setAuthInfo();
    }
};

export const authStore = new AuthStore();