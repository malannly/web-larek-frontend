import {Component} from "./base/Component";
import {createElement, ensureElement, bem} from "../utils/utils";
import { ITypeItem } from '../types/index'

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export type CatalogItemCategory = {
    category: ITypeItem;
    label: string;
}

export interface ICard<T> {
    title: string;
    image: string;
    price: number | null;
    description?: string | string[];
}

// класс карточки на главной странице
export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement; // загаловок 
    protected _image?: HTMLImageElement; // картинка
    protected _price: HTMLElement; // цена
    protected _category?: HTMLElement; // категория товара
    protected _button: HTMLButtonElement; // кнопка в виде самой карточки

    // конструктор
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        const imageEl = container.querySelector(`.${blockName}__image`);
        if (imageEl) {
        this._image = imageEl as HTMLImageElement;
        }

        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`);

        const categoryEl = ensureElement<HTMLElement>(`.${blockName}__category`);
        if (categoryEl) {
        this._category = categoryEl as HTMLElement;
        }

        // открытие модального окна карточки по клику по ней
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // устанавливаем id карточки
    set id(value: string) {
        this.container.dataset.id = value;
    }

    // получаем id карточки для дальнейшей работы с ней
    get id(): string {
        return this.container.dataset.id || '';
    }

    // устанавливаем заголовок
    set title(value: string) {
        this.setText(this._title, value);
    }

    // получаем зоголовок карточки для дальнейшей работы
    get title(): string {
        return this._title.textContent || '';
    }

    // устанавливаем изображение 
    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    // получаем цену карточки для дальнейшей работы
    get price(): string {
        return this._price.textContent || '';
    }

    // устанавливаем цену
    set price(value: string) {
        this.setPrice(this._price, value)
    }

    // устанавливаем категорию карточки
    set category({ category, label }: CatalogItemCategory) {

        this.setText(this._category, label);
        console.log(label);
        // сопоставляем категорию
        if (category === 'hard') {
            this._category.classList.add(`${this.blockName}__category_hard`);
        } else if (category === 'soft') {
            this._category.classList.add(`${this.blockName}__category_soft`);
        } else if (category === 'other') {
            this._category.classList.add(`${this.blockName}__category_other`);
        } else if (category === 'additional') {
            this._category.classList.add(`${this.blockName}__category_additional`);
        } else if (category === 'button') {
            this._category.classList.add(`${this.blockName}__category_button`);
        } 
    }
}    

// класс карточки в модальном окне
export class CardItem extends Card<any> {
    protected _text: HTMLElement; // описание

    // конструктор
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container, actions);
        this._text = ensureElement<HTMLElement>(`.${blockName}__text`, container);
    }

    // устанавливаем описанию 
    set text(value: string) {
        this.setText(this._text, value);
    }
}

// карточки в корзине
export class CardBasket extends Card<any> {
    protected _index: HTMLElement; // номер карточки
    protected _button: HTMLButtonElement; // кнопка в виде самой карточки

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container, actions);

        this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
        this._button = ensureElement<HTMLButtonElement>(`.basket__item-delete`, container);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            }
        }
        
    }

    set index(value: number) {
        if (this._index) this._index.textContent = value.toString();
    }
}