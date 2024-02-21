import { AddCarRequest, Car, CarQueryParameters, EditCarRequest, Pagination } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { CarsService } from '../services/CarService';
import { brandModelsStore } from './brandModelsStore';
import { getBase64 } from '../common/functions';
import { basketStore } from './basketStore';

class CarsStore {
    cars: Car[] = [];

    fetchError?: string;

    actionError?: string;

    loading: boolean = false;

    pagination?: Pagination;

    constructor(){
        makeAutoObservable(this);
    }

    setCars(cars: Car[]) {
        this.cars = cars;
    }

    setPagination(pagination: Pagination) {
        this.pagination = pagination;
    }

    setFetchError(error?: string) {
        this.fetchError = error;
    }

    setActionError(error?: string) {
        this.actionError = error;
    }

    setLoading(loading: boolean) {
        this.loading = loading;
    }

    addCarAction(car: Car) {
        this.cars.unshift(car);
    }

    async deleteCar(id: number) {
        this.setActionError();
        this.setLoading(true);
        try{
            await CarsService.deleteCar(id);
            this.setCars(this.cars.filter((elem:Car) => elem.carId !== id));
            basketStore.deleteIfContains(id);          
        } catch (e) {
           console.log('delete car error: '.concat((e as Error).message));
           this.setActionError((e as Error).message);
        } finally {
            this.setLoading(false);
        }
    }

    async addCar(newCar: AddCarRequest) {
        this.setActionError();
        this.setLoading(true);

        const brandModel = brandModelsStore.brandModels.find(elem => elem.carModelId === newCar.carModelId);
        if (!brandModel) {
            carsStore.setActionError('car model not found');
            this.setLoading(false);
            return;
        }
        try {
            const response = await CarsService.addCar(newCar);
            let imageBase64: string | undefined;
            try {
                imageBase64 = await getBase64(newCar.image[0]);
            } catch {
                imageBase64 = undefined;
            }
            this.addCarAction({color: newCar.color, carId: response.data, image: imageBase64, brand: brandModel});
        } catch (e) {
            console.log('add car error: '.concat((e as Error).message));
            this.setActionError((e as Error).message);
        } finally {
            this.setLoading(false);
        }
    }

    async editCar(editedCar: EditCarRequest) {
        this.setActionError();
        this.setLoading(true);

        const brandModel = brandModelsStore.brandModels.find(elem => elem.carModelId === editedCar.carModelId);
        if (!brandModel) {
            carsStore.setActionError('car model not found');
            this.setLoading(false);
            return;
        }
        try {
            let imageBase64: string | undefined;
            if (editedCar.image[0]) {
                try {
                    imageBase64 = await getBase64(editedCar.image[0]);
                } catch {
                    imageBase64 = undefined;
                }
            }
            await CarsService.editCar(editedCar);
            const editedCarView: Car = {...editedCar, image: imageBase64, brand: brandModel}
            this.setCars(this.cars.map((elem:Car) => (
                elem.carId === editedCar.carId) ? {...editedCarView, image: editedCar.image[0] ? imageBase64 : elem.image} : elem));
            basketStore.deleteIfContains(editedCar.carId);
        } catch (e) {
            console.log('edit car error: '.concat((e as Error).message));
            this.setActionError((e as Error).message);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchCars(params: CarQueryParameters) {
        this.setFetchError();
        this.setLoading(true);
        try {
            const response = await CarsService.fetchCars(params);
            this.setPagination(JSON.parse(response.headers['pagination']));
            this.setCars(response.data);
        } catch (e) {
            console.log('fetch cars error: '.concat((e as Error).message));
            this.setFetchError((e as Error).message);
        } finally {
            this.setLoading(false);
        }
    }
}

export const carsStore = new CarsStore();