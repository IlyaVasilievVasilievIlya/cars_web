import { BrandModel } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { BrandModelService } from '../services/BrandModelService';


class BrandModelsStore {
    brandModels: BrandModel[] = [];

    fetchError?: string;

    constructor(){
        makeAutoObservable(this);
    }

    setBrandModels(brandModels: BrandModel[]) {
        this.brandModels = brandModels;
    }
    
    setFetchError(fetchError?: string) {
        this.fetchError = fetchError;
    }

    async fetchBrandModels() {
        this.setFetchError();
        try {
            const response = await BrandModelService.fetchBrandModels();
            this.setBrandModels(response.data);
        } catch (e) {
            console.log('fetch brandmodels error: '.concat((e as Error).message));
            this.setFetchError((e as Error).message);
        }
    }
};

export const brandModelsStore = new BrandModelsStore();