import { BrandModel, Car } from '../components/model';
import { API_URL } from '../public/consts';
import { makeAutoObservable } from 'mobx';


const staticData:BrandModel[] = [
    {id: 1, brand: 'Toyota', model: 'Camry'},
    {id: 2, brand: 'Renault', model: 'Logan'},
    {id: 3, brand: 'Mercedes', model: 'Benz'},
    {id: 4, brand: 'Lada', model: 'Granta'}
]

class BrandModelsStore {
    brandModels: BrandModel[] = staticData;

    constructor(){
        makeAutoObservable(this);
    }
};

export const brandModelsStore = new BrandModelsStore();