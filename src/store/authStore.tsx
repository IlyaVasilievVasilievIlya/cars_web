import { BrandModel, Car, AuthInfo, LoginRequest, RegisterRequest } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { AuthService } from '../services/AuthService';

class AuthStore {
    authData?: AuthInfo;

    error?: string;


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
        } else localStorage.clear();      
    }

    setAuth(authInfo: AuthInfo) {
        
        const encodedClaims = authInfo.accessToken.split(".")[1];
        const role = JSON.parse(atob(encodedClaims)).role;
        this.setAuthInfo({...authInfo, role: role});

        console.log(this.authData);
    }

    setError(error?: string) {
        this.error = error;
    }

    async login(loginCreds: LoginRequest){
        this.setError();
        try {
            const response = await AuthService.login(loginCreds);
            this.setAuth(response.data);
        } catch (e) {
            console.log('login error '.concat((e as Error).message));
            this.error = (e as Error).message;
        }
    }

    async register(registerInfo: RegisterRequest) {
        this.setError();
        try {
            const response = await AuthService.register(registerInfo);
            this.setAuth(response.data);
        } catch (e) {
            console.log('register error '.concat((e as Error).message));
            this.error = (e as Error).message;
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
            this.error = (e as Error).message;
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