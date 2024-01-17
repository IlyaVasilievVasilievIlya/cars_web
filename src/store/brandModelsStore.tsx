import { BrandModel, Car } from '../components/model';
import { API_URL } from '../public/consts';
import { makeAutoObservable } from 'mobx';


const staticData:BrandModel[] = [
    {carModelId: 1, brand: 'Toyota', model: 'Camry'},
    {carModelId: 2, brand: 'Renault', model: 'Logan'},
    {carModelId: 3, brand: 'Mercedes', model: 'Benz'},
    {carModelId: 4, brand: 'Lada', model: 'Granta'}
]

class BrandModelsStore {
    brandModels: BrandModel[] = staticData;

    constructor(){
        makeAutoObservable(this);
    }
    
};

export const brandModelsStore = new BrandModelsStore();