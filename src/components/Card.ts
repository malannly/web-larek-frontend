import {Component} from "./base/Component";
import {createElement, ensureElement, bem} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    id: string;
    title: string;
    price: number | null;
    category: string;
    description: string;
    image: string;
    index: number;
}

// основной класс карточки
export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    }
    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: string) {
        this.setPrice(this._price, value);
    }
      
}

// карточки в корзине
export class CardBasket extends Card {
    protected _index: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);

        this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
        this._button = ensureElement<HTMLButtonElement>(`.basket__item-delete`, container);
        
        if (actions?.onClick) {
            (this._button ?? this.container).addEventListener('click', actions.onClick);
        }

    }
    set index(value: string) {
        this.container.dataset.index = value;
    }
}

// карточка на главной странице
export class CardPage extends Card {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _button: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container, actions);

        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`)
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = this.getCategoryClassName(value);
            const classList = this._category.classList;
            Array.from(classList)
                .filter(cls => cls.startsWith('card__category_'))
                .forEach(cls => classList.remove(cls));
            classList.add(categoryClass);
        }
    }

    private getCategoryClassName(category: string): string {
        const categoryMap: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'дополнительное': 'card__category_additional',
            'другое': 'card__category_other',
            'кнопка': 'card__category_button',
        };
        return categoryMap[category] || 'card__category_other';
    }
    set data(item: ICard) {
        this.id = item.id;
        this.title = item.title;
        this.image = item.image;
        this.price = item.price ? `${item.price} синапсов` : 'Бесценно';
        this.category = item.category;
      }
      
}

// модалка
export class CardPreview extends CardPage {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container, actions);

        this._description = ensureElement<HTMLElement>(`.${blockName}__text`, container);
        this._button = ensureElement<HTMLButtonElement>(`.${blockName}__button`, container)

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // устанавливаем описанию 
    set description(value: string) {
        this.setText(this._description, value);
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }
    set disabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
            this._button.classList.toggle('button_disabled', value);
        }
    }
}