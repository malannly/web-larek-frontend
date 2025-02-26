// интерфейс товара
interface ICatalog {
    id: string;
    title: string;
    subTitle?: string;
    description: string;
    price: number | null;
    image: string;
    selected: boolean;
}

// интерфейс корзины
interface IBasket {
    basket: ICatalog[];
    add(product: ICatalog): void;
    remove(productId: string): void;
    getTotalPrice(): number;
    clear(): void;
    getBasketAmount(): number;
}

// интерфейс пользователя
enum PaymentMethod {
    ONLINE = 'online',
    ONPLACE = 'onplace'
}

interface IUser {
    paymentMethod: PaymentMethod;
    address: string;
    email: string;
    phoneNumber: string;
    selectedItems: ICatalog[];
    total: number;
}

// интерфейс для оформленного товара
interface IOrder {
    items: string[];
    paymentMethod: PaymentMethod;
    address: string;
    email: string;
    phone: string;
    total: number;
}

// форма заполнения заказа
interface IOrderForm {
    paymentMethod: PaymentMethod;
    address: string;
    email: string;
    phone: string;
}

// интерфейс Api-каталога
interface ApiCatalog {
    items: ICatalog[];
}

interface IApiCatalog {
    items: ICatalog[];
    basket: ICatalog[];
    addToBasket(value: ICatalog): void;
    removeFromBasket(id: string): void;
    getTheFinalPrice(): number;
    getTheTotalNumberCatalog(): number;
    validateData(): boolean;
    clearBasket(): void;
    storeItemIds(): void;
    fillOrderField(field: keyof IOrderForm, value: string): void; 
  }
  