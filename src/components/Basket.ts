import {Component} from "./base/Component";
import {cloneTemplate, createElement, ensureElement, formatNumber} from "./../utils/utils";
import {EventEmitter} from "./base/events";

interface IBasketView {
    items: HTMLElement[]; // массив товаров
    total: number; // общая сумма
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            items.forEach((item, i) => {
                const indexElement = item.querySelector('.basket__item-index');
                if (indexElement) {
                    indexElement.textContent = (i + 1).toString();
                }
            });
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, formatNumber(total) + ' синапсов');
    }
}