export interface BrandModel {
    carModelId: number;
    brand: string;
    model: string;
}

export interface Car {
    carId: number;
    brand: BrandModel;
    color?: string;
}

export interface CarAddRequest {
    carModelId: number;
    color?: string;
}

export interface CarEditRequest {
    carId: number;
    carModelId: number;
    color?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    surname: string;
    patronymic?: string;
    birthDate: Date;
}

export interface AuthInfo {
    accessToken: string;
    role: string;
}