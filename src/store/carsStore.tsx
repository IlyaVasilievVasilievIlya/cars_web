import { Car } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { CarsService } from '../services/CarService';

class CarsStore {
    cars: Car[] = [];

    fetchError?: string;

    actionError?: string;

    loading: boolean = false;

    constructor(){
        makeAutoObservable(this);
    }

    setCars(cars: Car[]) {
        this.cars = cars;
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
        } catch (e) {
           console.log('deletecar error '.concat((e as Error).message));
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
            this.addCarAction(response.data);
        } catch (e) {
            console.log('addcar error '.concat((e as Error).message));
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
        } catch (e) {
            console.log('editcar error '.concat((e as Error).message));
            this.setActionError((e as Error).message);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchCars() {
        this.setFetchError();
        this.setLoading(true);
        try {
            const response = await CarsService.fetchCars();
            this.setCars(response.data);
        } catch (e) {
            console.log('fetchcars error '.concat((e as Error).message));
            this.setFetchError((e as Error).message);
        } finally {
            this.setLoading(false);
        }
    }
};

export const carsStore = new CarsStore();