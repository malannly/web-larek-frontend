

// главная страница и мочалка каждой карточки
export interface ICardItem {
id: string;
title: string;
image: string;
description: string;
price: number | null
category: string;
}

// модалка корзины товаров
export interface IBasket {
id: string;
title: string;
index: number;
price: number | null;
finalPrice: number | null
}

export type paymentMethod = 'card' | 'cash' 

export interface IOrderForm {
    payment: paymentMethod;
    address: string;
  }

  export interface IOrder extends IOrderForm {
    items: string[];
}

export interface IContactsResult {
    id: string;
    total: number | null;
}
  
  export type FormErrorsOrder = Partial<Record<keyof IOrderForm, string>>;

  export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IContacts extends IContactsForm {
    items: string[]
}

export type FormErrorsContacts = Partial<Record<keyof IContacts, string>>;

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