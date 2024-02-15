import { AxiosResponse } from "axios";
import { AuthInfo, LoginRequest, RegisterRequest } from "../components/model";
import { authApi } from "./http";
import { UserService } from "./UserService";

export class AuthService {
    static async login(loginCreds: LoginRequest): Promise<AxiosResponse<AuthInfo>> {
        return authApi.post<AuthInfo>(
            '/Identity/login',
            JSON.stringify(loginCreds))
    }

    static async loginWithGoogle(token: string): Promise<AxiosResponse<AuthInfo>> {
        return authApi.post<AuthInfo>(
            '/Identity/loginWithGoogle',
            token
        )
    }

    static async register(registerInfo: RegisterRequest): Promise<AxiosResponse<AuthInfo>> {
        return authApi.post<AuthInfo>(
            '/Identity/signup',
            JSON.stringify({...registerInfo, birthDate: UserService.formatDate(registerInfo.birthDate)}))
    }

    static async refresh(): Promise<AxiosResponse<AuthInfo>> {
        return authApi.post<AuthInfo>(
            '/Identity/token/refreshing'
        )
    }
}
