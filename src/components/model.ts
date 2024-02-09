import { roleList } from "../common/roles";

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

export interface AddCarRequest {
    carModelId: number;
    color?: string;
}

export interface EditCarRequest {
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
    refreshToken: string;
}

export type UserRole = typeof roleList[number]

export interface User {
    id: string;
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    birthDate: Date;
    role: UserRole;
}

export interface UserResponse {
    id: string;
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    birthDate: string;
    role: UserRole;
}

export interface EditUserRequest {
    name: string;
    surname: string;
    patronymic?: string;
    birthDate: Date;
}

export interface ChangeUserRoleRequest {
    role: UserRole;
}

export interface BasketItem {
    count: number;
    name: string;
    id: number;
}

export interface IOption {
    value: number;
    label: string;
}

export interface UserInfo {
    role: string;
}