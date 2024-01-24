import { AxiosResponse } from "axios";
import { AuthInfo, LoginRequest, RegisterRequest } from "../components/model";
import { authApi } from "../http";
import { UserService } from "./UserService";

export class AuthService {
    static async login(loginCreds: LoginRequest): Promise<AxiosResponse<AuthInfo>> {
        return authApi.post<AuthInfo>( //'Content-Type': 'application/json;charset=utf-8' *??
            '/Identity/login',
            JSON.stringify(loginCreds))
    }

    static async register(registerInfo: RegisterRequest): Promise<AxiosResponse<AuthInfo>> {
        return authApi.post<AuthInfo>(
            '/Identity/signup',
            JSON.stringify({...registerInfo, birthDate: UserService.formatData(registerInfo.birthDate)}))
    }

    static async refresh(refreshToken: string): Promise<AxiosResponse<AuthInfo>> {
        return authApi.post<AuthInfo>(
            '/Identity/token/refreshing',
            JSON.stringify({refreshToken: refreshToken})
        )
    }
}
