import { AxiosResponse } from "axios";
import { api } from "./http";
import { BrandModel } from "../components/model";

export class BrandModelService {

    static async fetchBrandModels(): Promise<AxiosResponse<BrandModel[]>> {
        return api.get(
            '/Cars/brandModels'
        )
    }
}