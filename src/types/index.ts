// главная страница и мочалка каждой карточки
export interface ICardItem {
id: string;
title: string;
image: string;
description: string;
price: number | null
category: string;
}

export type paymentMethod = 'card' | 'cash' 

export interface IOrderForm {
    payment: paymentMethod;
    address: string;
  }

export type FormErrorsOrder = Partial<Record<keyof IOrderForm, string>>;

export interface IOrderResult {
    id: string;
    total: number | null;
}

  export interface IContactsForm {
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