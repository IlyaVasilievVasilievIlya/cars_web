import { BasketItem } from '../components/model';
import { makeAutoObservable } from 'mobx';

class BasketStore {
    basket: BasketItem[];

    constructor() {
        this.basket = JSON.parse(localStorage.getItem('basket') || '[]') || [];
        makeAutoObservable(this);
    }

    refreshLocalStorage() {
        localStorage.setItem('basket', JSON.stringify(this.basket));
    }

    setBasket(basket: BasketItem[]) {
        this.basket = basket;
        this.refreshLocalStorage();
    }

    contains(id: number) {
        return this.basket.find(elem => elem.id === id) ? true : false;
    }

    deleteProduct(id: number) {
        this.setBasket(this.basket.filter((elem: BasketItem) => elem.id !== id));
    }

    deleteIfContains(id: number) {
        if (this.contains(id)) {
            this.deleteProduct(id);
        }
    }

    deleteIfContains(id: number) {
        if (this.contains(id)) {
            this.deleteProduct(id);
        }
    }

    decrementCount(id: number) {
        const product = this.basket.find(product => product.id === id);
        if (product) {
            product.count--;
            this.refreshLocalStorage();
        }
    }

    incrementCount(id: number) {
        const product = this.basket.find(product => product.id === id);
        if (product) {
            product.count++;
            this.refreshLocalStorage();
        }
    }

    addProduct(basketItem: BasketItem) {
        this.basket.push(basketItem);
        this.refreshLocalStorage();
    }

    clear() {
        this.setBasket([]);
    }
};

export const basketStore = new BasketStore();