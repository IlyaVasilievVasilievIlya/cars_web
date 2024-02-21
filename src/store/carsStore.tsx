import { Car, CarQueryParameters, Pagination } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { CarsService } from '../services/CarService';
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

    async addCar(newCar: Car) {
        this.setActionError();
        this.setLoading(true);
        try {
            const response = await CarsService.addCar(newCar);
            this.addCarAction({...newCar, carId: response.data});
        } catch (e) {
            console.log('add car error: '.concat((e as Error).message));
            this.setActionError((e as Error).message);
        } finally {
            this.setLoading(false);
        }
    }

    async editCar(editedCar: Car) {
        this.setActionError();
        this.setLoading(true);
        try {
            await CarsService.editCar({carId: editedCar.carId, carModelId:editedCar.brand.carModelId, color: editedCar.color});
            this.setCars(this.cars.map((elem:Car) => (
                elem.carId === editedCar.carId) ? editedCar : elem));
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