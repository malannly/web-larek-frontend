import { Model } from "./base/Model";
import {EventEmitter} from "../components/base/events";
import { ITypeItem, IOrder } from '../types/index'
import { IAppState, ICardItem, IBasket, IContactsForm, IOrderForm, FormErrorsContacts, FormErrorsOrder } from "../types/index";

const events = new EventEmitter();

// модель состояния приложения
export class AppData extends Model<IAppState> {
    items: ICardItem[] = [];        // список карточек на главной
    basket: string[] = [];          // id товаров в корзине
    contacts: IContactsForm | null = null;  // данные пользователя
    order: IOrder = {
        payment: '',
        address: '',
        items: []
    }; // данные по заказу
    loading: boolean = false;
    preview: string | null;  // id карточки для модального окна
    formErrorsContacts: FormErrorsContacts = {};    // ошибки формы contacts
    formErrorsOrder: FormErrorsOrder = {};  // ошибки формы order
    category: ITypeItem;

    // установить каталог товара с api
    getCard(id: string): ICardItem {
        return this.items.find(item => item.id === id);
    }

    // установить карточку с api 
    getCards(): ICardItem[] {
        return this.items;
    }

    // 
    setCards(items: ICardItem[]) {
        this.items = items;
        this.events.emit('cards:updated', items);
    }

    // добавить товар в корзину
    addToBasket(item: { id: string }) {
        if (!this.basket.includes(item.id)) {
            this.basket.push(item.id);
            this.emitChanges('basket:changed', this.basket);
        }
    }

    // удалить товар из корзины
    removeFromBasket(item: { id: string }) {
        this.basket = this.basket.filter(id => id !== item.id);
        this.emitChanges('basket:changed', this.basket);
    }    

    // // очистить корзину
    // clearBasket() {
    //     this.basket = [];
    //     this.emitChanges('basket:changed', this.basket);
    // }

    // открыть модальное окно карточки
    setPreview(item: ICardItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    // Установить данные пользователя для формы
    setContactsField<T extends keyof IContactsForm>(field: T, value: IContactsForm[T]) {
        if (!this.contacts) this.contacts = {} as IContactsForm;
        this.contacts[field] = value;
    
        if (this.validateContactsForm()) {
            this.events.emit('contacts:ready', this.contacts);
        }
    }    

    // валидация формы пользователя
    validateContactsForm(): boolean {
        const errors: FormErrorsContacts = {};
        if (!this.contacts?.email) errors.email = 'Необходимо указать email';
        if (!this.contacts?.phone) errors.phone = 'Необходимо указать телефон';
        this.formErrorsContacts = errors;
        this.emitChanges('formErrorsContacts:change', this.formErrorsContacts);
        return Object.keys(errors).length === 0;
    }   
     

    // установить данные заказа
    setOrderField<T extends keyof IOrder>(field: T, value: IOrder[T]) {
        if (!this.order) this.order = {} as IOrder;
        this.order[field] = value;
    
        if (this.validateOrderForm()) {
            this.events.emit('order:ready', this.order);
        }
        
    }    

    // валидация формы заказа
    validateOrderForm(): boolean {
        const errors: FormErrorsOrder = {};
        if (!this.order?.address) errors.address = 'Укажите адрес доставки';
        this.formErrorsOrder = errors;
        this.emitChanges('formErrorsOrder:change', this.formErrorsOrder);
        return Object.keys(errors).length === 0;
    }    

    // рассчитать финальную сумму
    getTotal(): number {
        return this.basket.reduce((total, id) => {
            const item = this.items.find(card => card.id === id);
            return total + (item?.price || 0);
        }, 0);
    }

    getCategoryLabel(typeItem: ITypeItem): string {
        switch (typeItem) {
            case "hard":
                return `Хард-скилл`;
            case "soft":
                return `Софт-скилл`;
            case "other":
                return `Другое`;
            case "additional":
                return `Дополнительно`;
            case "button":
                return `Кнопка`;
            default:
                return `категория`;
        }
    }
    
}
