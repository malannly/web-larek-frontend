import { Api, ApiListResponse } from './base/api';
import { IContactsResult, IContacts } from "../types/index";
import { ICardItem } from '../types/index';

export interface IAppAPI {
    getCardList: () => Promise<ICardItem[]>;
    getCardItem: (id: string) => Promise<ICardItem>;
    orderCards: (contacts: IContacts) => Promise<IContactsResult>;
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
    orderCards(contacts: IContacts): Promise<IContactsResult> {
        return this.post('/order', contacts).then(
            (data: IContactsResult) => data
        );
    }

}