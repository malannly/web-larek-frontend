import { Model } from "./base/Model";
import {EventEmitter} from "../components/base/events";
import { IOrder, paymentMethod } from '../types/index'

import { IAppState, ICardItem, IBasket,
    IContacts, IContactsForm, IOrderForm, FormErrorsContacts, FormErrorsOrder } from "../types/index";

const events = new EventEmitter();

export type CardChangeEvent = {
    cards: LotItem[]
};

export class LotItem extends Model<ICardItem> {
    id: string;
    title: string;
    image: string;
    description?: string;
    price: number | null
    category: string;
}

// модель состояния приложения
export class AppData extends Model<IAppState> {
    cards: ICardItem[];        // список карточек на главной
    basket: string[] = [];          // id товаров в корзине
    contacts: IContacts = {
        email: '',
        phone: '',
        items: []
    }; // данные пользователя
    order: IOrder = {
        payment: 'cash',
        address: '',
        items: []
    }; // данные по заказу
    loading: boolean = false;
    preview: string | null;  // id карточки для модального окна
    formErrorsContacts: FormErrorsContacts = {};    // ошибки формы contacts
    formErrorsOrder: FormErrorsOrder = {};  // ошибки формы order
    category: string;

    // установить каталог товара с api
    getCard(id: string): ICardItem {
        return this.cards.find(item => item.id === id);
    }

    // установить карточку с api 
    getCards(): ICardItem[] {
        return this.cards;
    }

    // 
    setCards(cards: ICardItem[]) {
        this.cards = cards;
        this.events.emit('cards:updated', cards);
    }

    // добавить товар в корзину
    addToBasket(item: { id: string }) {
        if (!this.basket.includes(item.id)) {
            this.basket.push(item.id);
            this.emitChanges('basket:add', this.basket);
        }
    }

    // удалить товар из корзины
    removeFromBasket(item: { id: string }) {
        this.basket = this.basket.filter(id => id !== item.id);
        this.emitChanges('basket:remove', this.basket);
    }    

    // очистить корзину
    clearBasket() {
        this.basket = [];
        this.emitChanges('basket:changed', this.basket);
    }

    // открыть модальное окно карточки
    setPreview(item: ICardItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    initContacts() {
        this.contacts = {
            email: '',
            phone: '',
            items:[]
        };
    this.emitChanges('contacts:changed')
    }

    // Установить данные пользователя для формы
    setContacts(field: keyof IContactsForm, value: string) {
        this.contacts[field] = value;
        this.emitChanges('contacts:changed');
    }    

    // валидация формы пользователя
    validateContacts(): FormErrorsContacts {
        const errors: FormErrorsContacts = {};
        if (!this.contacts?.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.contacts?.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
    
        return errors;
    }

    initOrder() {
        this.order = {
            address: '',
            payment: 'cash',
            items:[]
        };
    this.emitChanges('order:changed')
    }

    setPayment(payment: paymentMethod): void {
        if (!this.isPayment(payment)) {
            alert('Invalid payment');
            return;
        }
        this.order.payment = payment;
        this.events.emit('order:changed', { payment }); 
    }   

    setAddress(address: string) {
        this.order.address = address;
        this.emitChanges('order:changed');
    }

    // setOrder(address: string, payment: paymentMethod): void {
    //     if (!this.isPayment(payment)) {
    //         alert('Invalid payment');
    //         return;
    //     }
        
    //     this.order.address = address;
    //     this.order.payment = payment;
    
    //     this.emitChanges('order:changed');
    // }
    
    validateOrder(): FormErrorsOrder {
        const errors: FormErrorsOrder = {};
        if (!this.order?.address) {
            errors.address = 'Необходимо указать адресс';
        }
        if (!this.order?.payment) {
            errors.payment = 'Выберите способ опоаты';
        }
    
        return errors;
    }   

    // рассчитать финальную сумму
    getTotal(): number {
        return this.basket.reduce((total, id) => {
            const item = this.cards.find(card => card.id === id);
            return total + (item?.price || 0);
        }, 0);
    }

    // changePayment(payment: paymentMethod): void {
    //     if (!this.isPayment(payment)) {
    //         alert('Invalid payment');
    //         return;
    //     }
    //     this.order.payment = payment;
    //     this.events.emit('payment:changed', { payment }); 
    // }    

      protected isPayment(x: string): x is paymentMethod {
        return ['cash', 'card'].includes(x);
      }
    
      getPayment() {
        return this.order.payment;
    }    
}
