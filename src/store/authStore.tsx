import { BrandModel, Car, AuthInfo, LoginRequest, RegisterRequest } from '../components/model';
import { API_URL } from '../public/consts';
import { makeAutoObservable } from 'mobx';

class AuthStore {
    authData: AuthInfo | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setAuthInfo(newAuthInfo: AuthInfo){
        this.authData = newAuthInfo;
    }

    getRole(authInfo: AuthInfo) { //вынести в отд метод как обобщение (ну или хотя бы типизировать)
        
        const encodedClaims = authInfo.accessToken.split(".")[1];
        const role = JSON.parse(atob(encodedClaims)).role;
        this.setAuthInfo({...authInfo, role: role});

        console.log(this.authData);
    }

    async login(loginCreds: LoginRequest){

        const response = await fetch(`${API_URL}/Identity/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(loginCreds)
        });
        
        let body: AuthInfo = await response.json();
        this.getRole(body);
    }

    async register(registerInfo: RegisterRequest) {
        const response = await fetch(`${API_URL}/Identity/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(registerInfo)
        });

        const body: AuthInfo = await response.json();
        this.getRole(body);
    }

    async refreshToken() {
        if (!this.authData)
            return;

        const response = await fetch(`${API_URL}/Identity/token/refreshing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({refreshToken: this.authData?.refreshToken})
        });
        
        let body: AuthInfo = await response.json();
        this.setAuthInfo(body);
    }

    logout(){
        this.authData = null;
    }
};

export const authStore = new AuthStore();