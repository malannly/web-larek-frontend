export type ITypeItem = 'hard' | 'other' | 'additional' | 'button' | 'soft'

// главная страница и мочалка каждой карточки
export interface ICardItem {
id: string;
title: string;
image: string;
description?: string;
price: number | null
typeItem: ITypeItem;
}

// модалка корзины товаров
export interface IBasket {
id: string;
title: string;
price: number | null;
finalPrice: number | null
}

export interface IOrderForm {
    payment: 'card' | 'cash' | '';
    address: string;
  }

  export interface IOrder extends IOrderForm {
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number | null;
}
  
  export type FormErrorsOrder = Partial<Record<keyof IOrderForm, string>>;

export interface IContactsForm {
    items: string[];
    email: string;
    phone: string;
  }
  
  export type FormErrorsContacts = Partial<Record<keyof IContactsForm, string>>;

// окно при удачной покупке
export interface ISuccess {
id: string;
finalPrice: number | null
}

// api 
export interface IAppState {
cards: ICardItem[];
basket: string[];
order: IOrderForm | null;
contacts: IContactsForm | null;
preview: string | null;
loading: boolean;
}