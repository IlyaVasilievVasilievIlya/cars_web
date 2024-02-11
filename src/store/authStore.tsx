import { jwtDecode } from "jwt-decode";
import { makeAutoObservable } from 'mobx';
import { AuthInfo, LoginRequest, RegisterRequest, UserInfo } from '../components/model';
import { AuthService } from '../services/AuthService';
import { basketStore } from './basketStore';

class AuthStore {
    isAuth?: boolean;

    error?: string;

    errorCode?: number;

    loading: boolean = false;

    userRole?: string;

    authChecked = false;

    constructor() {
        makeAutoObservable(this);
    }

    setIsAuth(isAuth: boolean = true) {
        this.isAuth = isAuth;
    }

    setUserRole(role?:string) {
        this.userRole = role;
    }

    async checkAuth() { 
        if (!localStorage.getItem('refreshToken') || this.authChecked) {
            return;
        }

        this.authChecked = true;
        try {
            await this.refreshToken().then(token => {
                if (token) {
                    this.setAuth(token);
                }
            });
        } catch { 
            this.logout();
        }
    }

    setAuth(authInfo: AuthInfo) {
        this.setLocalStorage(authInfo);
        this.setIsAuth();
        const token = localStorage.getItem('accessToken');
        if (token) {
            this.setUserRole(jwtDecode<UserInfo>(token).role);
        }
    }
    
    setLocalStorage(authInfo: AuthInfo) {
        localStorage.setItem('accessToken', authInfo.accessToken);
        localStorage.setItem('refreshToken', authInfo.refreshToken);
    }
    
    setError(error?: string, errorCode?: number) {
        this.error = error;
        this.errorCode = errorCode;
    }
    
    setLoading(loading: boolean) {
        this.loading = loading;
    }

    checkRole(roles?: string[]) {
        return roles?.includes(this.userRole ?? '');
    }

    async login(loginCreds: LoginRequest) {
        this.setError();
        this.setLoading(true);
        try {
            const response = await AuthService.login(loginCreds);
            this.setAuth(response.data);
        } catch (e) {
            console.log('login error: '.concat((e as Error).message));
        } finally {
            this.setLoading(false);
        }
    }

    async loginWithGoogle(token: string) {
        this.setError();
        this.setLoading(true);
        try {
            const response = await AuthService.loginWithGoogle(token);
            this.setAuth(response.data);
        } catch (e) {
            console.log('*' + authStore.error);
            console.log('login error: '.concat((e as Error).message));
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
            console.log('register error: '.concat((e as Error).message));
        } finally {
            this.setLoading(false);
        }
    }

    async refreshToken(): Promise<AuthInfo | undefined> {
        this.setError();
        let refreshToken : string | null;
        if (!(refreshToken = localStorage.getItem('refreshToken')))
            return Promise.reject();
        try {
            const response = await AuthService.refresh(refreshToken);
            return Promise.resolve(response.data);
        } catch (e) {
            console.log('refresh token error: '.concat((e as Error).message));
            return Promise.reject();
        }
    }

    logout() {
        localStorage.clear();
        basketStore.clear();
        this.setUserRole();
        this.setIsAuth(false);
    }
};

export const authStore = new AuthStore();