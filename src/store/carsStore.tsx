import { Car } from '../components/model';
import { API_URL } from '../public/consts';
import { makeAutoObservable } from 'mobx';


const testData: Car[] = [
    {carId: 1, brand: {id: 1, brand: 'Toyota', model: 'Camry'}, color:'melon yellow'},
    {carId: 2, brand: {id: 2, brand: 'Renault', model: 'Logan'}, color:'black'},
    {carId: 3, brand: {id: 3, brand: 'Mercedes', model: 'Benz'}, color:'red'},
    {carId: 4, brand: {id: 4, brand: 'Lada', model: 'Granta'}, color:'white'}
]

class CarsStore {
    cars: Car[] = testData;

    constructor(){

        makeAutoObservable(this);
    }

    deleteCar(id: number){
        this.cars = this.cars.filter((elem:Car) => elem.carId != id);
    }

    addCar(newCar: Car){
        this.cars.push(newCar);
    }

    editCar(editedCar: Car){
        this.cars = this.cars.map((elem:Car) => (
            elem.carId == editedCar.carId) ? editedCar : elem);
    }

    async fetchCars() {
        //let response = await fetch(`${API_URL}/Cars`);
        //let body: Car[] = await response.json();

        //this.cars = cars;
    }
};

export const carsStore = new CarsStore();