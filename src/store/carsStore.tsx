import { Car } from '../components/model';
import { API_URL } from '../public/consts';
import { makeAutoObservable } from 'mobx';


const testData: Car[] = [
    {carId: 1, brand: {carModelId: 1, brand: 'Toyota', model: 'Camry'}, color:'melon yellow'},
    {carId: 2, brand: {carModelId: 2, brand: 'Renault', model: 'Logan'}, color:'black'},
    {carId: 3, brand: {carModelId: 3, brand: 'Mercedes', model: 'Benz'}, color:'red'},
    {carId: 4, brand: {carModelId: 4, brand: 'Lada', model: 'Granta'}, color:'white'}
]

class CarsStore {
    cars: Car[] = testData;

    constructor(){

        makeAutoObservable(this);
    }

    setCars(cars: Car[]) {
        this.cars = cars;
    }

    deleteCar(id: number) {
        this.cars = this.cars.filter((elem:Car) => elem.carId != id);
    }

    addCar(newCar: Car) {
        this.cars.push(newCar);
    }

    editCar(editedCar: Car) {
        this.cars = this.cars.map((elem:Car) => (
            elem.carId == editedCar.carId) ? editedCar : elem);
    }

    async fetchCars() {
       // ошибки обработать

        let response = await fetch(`${API_URL}/Cars?offset=0&limit=10`, {
            headers: {Authorization:
                 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU3VwZXJVc2VyIiwibmJmIjoxNzA1NDc5NDE3LCJleHAiOjE3MDU0ODAzMTcsImlhdCI6MTcwNTQ3OTQxNywiaXNzIjoiY2Fyc0FwaUlkZW50aXR5IiwiYXVkIjoiY2Fyc0FwaSJ9.iRwIXt2z1D-tTuWdAqE3WeipNRQ8MCZe4HQo-NB-_lY'}
        });
        
        let body: Car[] = await response.json();

        this.setCars(body);
    }
};

export const carsStore = new CarsStore();