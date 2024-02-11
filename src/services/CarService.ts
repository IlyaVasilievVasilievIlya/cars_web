import { AxiosResponse } from "axios";
import { api } from "./http";
import { Car, EditCarRequest } from "../components/model";

export class CarsService {
    static async deleteCar(id: number): Promise<AxiosResponse<void>>  {
        return api.delete(
            `/Cars/${id}`,
        )
    }

    static async addCar(newCar: Car): Promise<AxiosResponse<number>>  {
        return api.post(
            `/Cars`,
            JSON.stringify({carModelId: newCar.brand.carModelId, color: newCar.color}))
    }

    static async editCar(editedCar: EditCarRequest): Promise<AxiosResponse<void>> {
        return api.put(
            `/Cars/${editedCar.carId}`,
            JSON.stringify(editedCar))
    }

    static async fetchCars(): Promise<AxiosResponse<Car[]>> {
        return api.get(
            '/Cars'
        )
    }
}