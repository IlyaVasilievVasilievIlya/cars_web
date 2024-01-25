import { CartItem } from '../components/model';
import { makeAutoObservable } from 'mobx';

class CartStore {
    carts: CartItem[]; 

    constructor(){
        this.carts = JSON.parse(localStorage.getItem('cart') || '') || [];
        makeAutoObservable(this);
    }

    setCarts(carts: CartItem[]) {
        this.carts = carts;
        localStorage.setItem('cart', JSON.stringify(carts));
    }

    deleteProduct(id: number) {
        this.setCarts(this.carts.filter((elem:CartItem) => elem.product.carId != id)); 
    }

    decrementCount(id: number) {
        const product = this.carts.find(cart => cart.product.carId == id);
        if (product) {
            product.count--;
        }
    }

    incrementCount(id: number) {
        const product = this.carts.find(cart => cart.product.carId == id);
        if (product) {
            product.count++;
        }
    }

    addProduct(cartItem: CartItem) {
        this.carts.push(cartItem);
    }
};

export const cartStore = new CartStore();