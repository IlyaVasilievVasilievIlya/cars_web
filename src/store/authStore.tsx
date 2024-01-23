import { BrandModel, Car, AuthInfo, LoginRequest, RegisterRequest } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { AuthService } from '../services/AuthService';

class AuthStore {
    authData?: AuthInfo;

    error?: string;


    constructor() {
        makeAutoObservable(this);
    }

    setAuthInfo(newAuthInfo?: AuthInfo){
        this.authData = newAuthInfo;
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

    logout(){
        this.setAuthInfo();
    }
};

export const authStore = new AuthStore();