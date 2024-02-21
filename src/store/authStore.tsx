import { makeAutoObservable } from 'mobx';
import { AuthInfo, LoginRequest, RegisterRequest, UserInfo } from '../components/model';
import { AuthService } from '../services/AuthService';
import { basketStore } from './basketStore';

class AuthStore {
    User?: UserInfo;

    error?: string;

    errorCode?: number;

    loading: boolean = false;

    authChecked = false;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user?: UserInfo) {
        this.User = user;
    }

    async checkAuth() { 
        try {
            await AuthService.checkAuth().then(userInfo => {
                if (userInfo) {
                    this.setUser(userInfo.data);
                }
            });
        } catch (e) { 
            authStore.setError(undefined);
            console.log('cannot refresh token: '.concat((e as Error).message));
        }
    }

    setAuth(authInfo: AuthInfo) {
        this.setLocalStorage(authInfo.accessToken);
        this.setUser(authInfo.userInfo);
    }
    
    setLocalStorage(accessToken: string) {
        localStorage.setItem('accessToken', accessToken);
    }
    
    setError(error?: string, errorCode?: number) {
        this.error = error;
        this.errorCode = errorCode;
    }
    
    setLoading(loading: boolean) {
        this.loading = loading;
    }

    checkRole(roles?: string[]) {
        return roles?.includes(this.User?.role ?? '');
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
        try {
            const response = await AuthService.refresh();
            return Promise.resolve(response.data);
        } catch (e) {
            console.log('refresh token error: '.concat((e as Error).message));
            return Promise.reject(e);
        }
    }

    async logOut(): Promise<void> {
        this.setError();
        try {
            await AuthService.logOut();
            localStorage.clear();
            basketStore.clear();
            this.setUser(undefined);
        } catch (e) {
            console.log('refresh token error: '.concat((e as Error).message));
            return Promise.reject(e);
        }
    }
};

export const authStore = new AuthStore();