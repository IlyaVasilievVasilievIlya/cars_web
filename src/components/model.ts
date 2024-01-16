export interface BrandModel {
    id: number;
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
