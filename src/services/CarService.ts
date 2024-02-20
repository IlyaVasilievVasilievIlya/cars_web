import { AxiosResponse } from "axios";
import { api } from "./http";
import { AddCarRequest, Car, CarQueryParameters, EditCarRequest } from "../components/model";

export class CarsService {

    static createParamsObject(parameters: CarQueryParameters) {
        let k: keyof CarQueryParameters;
        for (k in parameters) {
            if (!parameters[k]) {
                delete parameters[k];
            }
        }
        return parameters;
    }

    static async deleteCar(id: number): Promise<AxiosResponse<void>>  {
        return api.delete( 
            `/Cars/${id}`,
        )
    }

    static async addCar(newCar: AddCarRequest): Promise<AxiosResponse<number>>  {
        return api.post(
            `/Cars`,
            {...newCar, image: newCar.image[0]}, {headers: { "Content-Type": "multipart/form-data"}})
    }

    static async editCar(editedCar: EditCarRequest): Promise<AxiosResponse<void>> {
        return api.put(
            `/Cars/${editedCar.carId}`,
            {...editedCar, image: editedCar.image[0]}, {headers: { "Content-Type": "multipart/form-data"}})
    }

    static async fetchCars(parameters: CarQueryParameters): Promise<AxiosResponse<Car[]>> {
        return api.get(
            '/Cars', {params: {...this.createParamsObject(parameters)}}
        )
    }
}