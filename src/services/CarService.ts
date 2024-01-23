import { AxiosResponse } from "axios";
import { api } from "../http";
import { Car } from "../components/model";

export class CarsService {
    static async deleteCar(id: number): Promise<AxiosResponse<void>>  {
        return api.delete(
            `/Cars/${id}`,
        )
    }

    static async addCar(newCar: Car): Promise<AxiosResponse<Car>>  {
        return api.post(
            `/Cars`,
            JSON.stringify({carModelId: newCar.brand.carModelId, color: newCar.color}))
    }

    static async editCar(editedCar: Car): Promise<AxiosResponse<void>> {
        return api.put(
            `/Cars/${editedCar.carId}`,
            JSON.stringify({carModelId: editedCar.brand.carModelId, color: editedCar.color}))
    }

    static async fetchCars(): Promise<AxiosResponse<Car[]>> {
        return api.get(
            '/Cars'
        )
    }
}