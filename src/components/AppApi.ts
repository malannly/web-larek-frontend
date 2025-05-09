import { Api, ApiListResponse } from './base/api';
import { IOrderResult, IContactsForm, IOrderForm, paymentMethod } from "../types/index";
import { ICardItem } from '../types/index';

export interface IAppAPI {
    orderCards(data: {
        email: string;
        phone: string;
        payment: paymentMethod;
        address: string;
        items: string[];
        total: number;
      }): Promise<IOrderResult>
    }      

export class AppAPI extends Api implements IAppAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    // загрузить карточку
    getCardItem(id: string): Promise<ICardItem> {
        return this.get(`/product/${id}`).then(
            (item: ICardItem) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    // загрузить список карточек
    getCardList(): Promise<ICardItem[]> {
        return this.get('/product').then((data: ApiListResponse<ICardItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    // отправка заказа
    orderCards(data: {
        email: string;
        phone: string;
        payment: paymentMethod;
        address: string;
        items: string[];
        total: number;
    }): Promise<IOrderResult> {
        return this.post('/order', data).then((result: IOrderResult) => result);
    }
    
    

}