import { BrandModel, Car, AuthInfo, LoginRequest, RegisterRequest } from '../components/model';
import { API_URL } from '../public/consts';
import { makeAutoObservable } from 'mobx';

class AuthStore {
    authData: AuthInfo | null = null;

    error?: String;

    constructor() {
        makeAutoObservable(this);
    }

    setAuthInfo(newAuthInfo: AuthInfo){
        this.authData = newAuthInfo;
    }

    createAuth(authInfo: AuthInfo) { //вынести в отд метод как обобщение (ну или хотя бы типизировать)
        
        const encodedClaims = authInfo.accessToken.split(".")[1];
        const role = JSON.parse(atob(encodedClaims)).role;
        this.setAuthInfo({...authInfo, role: role});

        console.log(this.authData);
    }

    async login(loginCreds: LoginRequest){
        this.error = undefined;
        try {
            const response = await fetch(`${API_URL}/Identity/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(loginCreds)
            });
            
            if (response.status == 401){
                const errors: string[] = await response.json();
                throw new Error(errors[0]);
            }
            
            const body: AuthInfo = await response.json();
            this.createAuth(body);
        } catch (e: unknown) {
            this.error = (e as Error).message;
        }
    }

    async register(registerInfo: RegisterRequest) {
        this.error = undefined;
        try {
            const response = await fetch(`${API_URL}/Identity/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(registerInfo)
            });

            if (response.status == (401 || 400)){
                const errors: string[] = await response.json();
                throw new Error(errors[0]);
            }
    
            const body: AuthInfo = await response.json();
            this.createAuth(body);
        } catch (e: unknown) {
            this.error = (e as Error).message;
        }
    }

    async refreshToken() {
        this.error = undefined;
        if (!this.authData)
            return;

        try{
            const response = await fetch(`${API_URL}/Identity/token/refreshing`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({refreshToken: this.authData.refreshToken})
            });
            
            if (response.status == 401){
                const errors: string[] = await response.json();
                throw new Error(errors[0]);
            }

            let body: AuthInfo = await response.json();
            this.setAuthInfo(body);
        } catch (e: unknown) {
            this.error = (e as Error).message;
        }
    }

    logout(){
        this.authData = null;
    }
};

export const authStore = new AuthStore();