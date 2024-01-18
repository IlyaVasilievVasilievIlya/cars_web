import { Car } from '../components/model';
import { API_URL } from '../public/consts';
import { makeAutoObservable } from 'mobx';
import { authStore } from './authStore';


const testData: Car[] = [
    {carId: 1, brand: {carModelId: 1, brand: 'Toyota', model: 'Camry'}, color:'melon yellow'},
    {carId: 2, brand: {carModelId: 2, brand: 'Renault', model: 'Logan'}, color:'black'},
    {carId: 3, brand: {carModelId: 3, brand: 'Mercedes', model: 'Benz'}, color:'red'},
    {carId: 4, brand: {carModelId: 4, brand: 'Lada', model: 'Granta'}, color:'white'}
]

class CarsStore {
    cars: Car[] = testData;



    error?: String;

    constructor(){
        makeAutoObservable(this);
    }

    async handleUnathorized() {
        if (authStore.authData){
            await authStore.refreshToken();
            if (authStore.error)
                throw new Error('refresh token is invalid or exprired');
        } else {
            throw new Error('not authenticated');
        }
    }

    setCars(cars: Car[]) {
        this.cars = cars;
    }

    async deleteCar(id: number) {
        this.error = undefined;
        try{
            let response = await fetch(`${API_URL}/Cars/${id}`, {
                method: 'DELETE',
                headers: {Authorization:
                     `bearer ${authStore.authData?.accessToken}`,
                     'Content-Type': 'application/json;charset=utf-8'
                    }
            });
            
            if (response.status == 401) {
                this.handleUnathorized();
                this.deleteCar(id);
                return;
            }

            if (response.status == 400)
                throw new Error('bad request');

            this.setCars(this.cars.filter((elem:Car) => elem.carId != id));
            
        } catch (error: unknown) {
            error = (error as Error).message; //mobx сделает? иначе setstate
        }
    }

    async addCar(newCar: Car) {
        this.error = undefined;
        try{
            let response = await fetch(`${API_URL}/Cars`, {
                method: 'POST',
                headers: {Authorization:
                     `bearer ${authStore.authData?.accessToken}`,
                     'Content-Type': 'application/json;charset=utf-8'
                    },
                body: JSON.stringify({carModelId: newCar.brand.carModelId, color: newCar.color})
            });
            
            if (response.status == 401) {
                this.handleUnathorized();
                this.addCar(newCar);
                return;
            }

            if (response.status == 400)
                throw new Error('bad request');

            const responseData: Car = await response.json();

            this.cars.push(responseData);
            
        } catch (error: unknown) {
            error = (error as Error).message; //mobx сделает? иначе setstate
        }
    }

    async editCar(editedCar: Car) {
        this.error = undefined;
        try{
            let response = await fetch(`${API_URL}/Cars/${editedCar.carId}`, {
                method: 'PUT',
                headers: {Authorization:
                     `bearer ${authStore.authData?.accessToken}`,
                     'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({carModelId: editedCar.brand.carModelId, color: editedCar.color})
            });
            
            if (response.status == 401) {
                this.handleUnathorized();
                this.editCar(editedCar);
                return;
            }

            if (response.status == 400)
                throw new Error('bad request');

            this.cars = this.cars.map((elem:Car) => (
                elem.carId == editedCar.carId) ? editedCar : elem);
            
        } catch (error: unknown) {
            error = (error as Error).message; //mobx сделает? иначе setstate
        }

    }

    async fetchCars() {
        this.error = undefined;
        try{
            let response = await fetch(`${API_URL}/Cars`, {
                headers: {Authorization:
                     `bearer ${authStore.authData?.accessToken}`}
            });

            if (response.status == 401) {
                this.handleUnathorized();
                this.fetchCars();
                return;
            }

            if (response.status == 400)
                throw new Error('bad request');

            let body: Car[] = await response.json();
    
            this.setCars(body);
            
        } catch (error: unknown) {
            error = (error as Error).message;
        }
    }
};

export const carsStore = new CarsStore();