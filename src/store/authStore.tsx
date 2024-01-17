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
        
        let encodedClaims = authInfo.accessToken.split(".")[1];
        let role = JSON.parse(atob(encodedClaims)).role;
        this.authData = {...authInfo, role: role};
        console.log(this.authData);
    }

    async login(loginCreds: LoginRequest){

        let response = await fetch(`${API_URL}/Identity/login`, {
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
        let response = await fetch(`${API_URL}/Identity/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'

            },
            body: JSON.stringify(registerInfo)
        });

        let body: AuthInfo = await response.json();
        this.getRole(body);
    }

    logout(){
        this.authData = null;
    }
};

export const authStore = new AuthStore();