import { BrandModel, Car } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { BrandModelService } from '../services/BrandModelService';


class BrandModelsStore {
    brandModels: BrandModel[] = [];

    error?: string;

    constructor(){
        makeAutoObservable(this);
    }

    setBrandModels(brandModels: BrandModel[]) {
        this.brandModels = brandModels;
    }
    
    setError(error?: string) {
        this.error = error;
    }

    async fetchBrandModels() {
        this.setError();
        try {
            const response = await BrandModelService.fetchBrandModels();
            this.setBrandModels(response.data);
        } catch (e) {
            console.log('fetchbrandmodels error '.concat((e as Error).message));
            this.setError((e as Error).message);
        }
    }

};

export const brandModelsStore = new BrandModelsStore();