import { Car } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { CarsService } from '../services/CarService';


// const testData: Car[] = [
//     {carId: 1, brand: {carModelId: 1, brand: 'Toyota', model: 'Camry'}, color:'melon yellow'},
//     {carId: 2, brand: {carModelId: 2, brand: 'Renault', model: 'Logan'}, color:'black'},
//     {carId: 3, brand: {carModelId: 3, brand: 'Mercedes', model: 'Benz'}, color:'red'},
//     {carId: 4, brand: {carModelId: 4, brand: 'Lada', model: 'Granta'}, color:'white'}
// ]

class CarsStore {
    cars: Car[] = [];

    error?: string;

    constructor(){
        makeAutoObservable(this);
    }

    setCars(cars: Car[]) {
        this.cars = cars;
    }

    setError(error?: string) {
        this.error = error;
    }

    async deleteCar(id: number) {
        this.setError();
        try{
            await CarsService.deleteCar(id);
            this.setCars(this.cars.filter((elem:Car) => elem.carId != id));
            
        } catch (e) {
            console.log('deletecar error '.concat((e as Error).message));
           this.setError((e as Error).message);
        }
    }

    async addCar(newCar: Car) {
        this.setError();
        try {
            const response = await CarsService.addCar(newCar);
            this.cars.push(response.data);
        } catch (e) {
            console.log('addcar error '.concat((e as Error).message));
            this.setError((e as Error).message);
        }
    }

    async editCar(editedCar: Car) {
        this.setError();
        try {
            await CarsService.editCar(editedCar);
            this.cars = this.cars.map((elem:Car) => (
                elem.carId == editedCar.carId) ? editedCar : elem);
        } catch (e) {
            console.log('editcar error '.concat((e as Error).message));
            this.setError((e as Error).message);
        }
    }

    async fetchCars() {
        this.setError();
        try {
            const response = await CarsService.fetchCars();
            this.setCars(response.data);
        } catch (e) {
            console.log('fetchcars error '.concat((e as Error).message));
            this.setError((e as Error).message);
        }
    }
};

export const carsStore = new CarsStore();