import {bem, createElement, ensureElement} from "../utils/utils";
import {Component} from "./base/Component";
import { ICard, CategoryMatch, CategoryCard } from "../types/index"
import { CDN_URL } from '../utils/constants';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

// вью карточки на главной странице
export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    // конструктор 
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._button = container.querySelector(`.${blockName}__button`);
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // сеттер уникального id карточки
    set id(value: string) {
        this.container.dataset.id = value;
    }

    // геттер уникального id карточки
    get id(): string {
        return this.container.dataset.id || '';
    }

    // сеттер уникального названия карточки
    set title(value: string) {
        this.setText(this._title, value);
    }

    // геттер уникального названия карточки
    get title(): string {
        return this._title.textContent || '';
    }

    // сеттер для картинки (текста)
    set image(value: string) {
        this._image.src = CDN_URL + value;
    }

    // сеттер чтобы посомтреть выбран ли товар или нет
    set selected(value: boolean) {
        if (!this._button.disabled) {
          this._button.disabled = value;
        }
      }

    // Сеттер для цены
    set price(value: number | null) {
    this._price.textContent = value
    ? `${value.toLocaleString()} синапсов` : 'Бесценно';
        if (this._button && !value) {
      this._button.disabled = true;
    }
  }

    // Сеттер для категории
    set category(value: CategoryCard) {
        this._category.textContent = value;
        const categoryClass = CategoryMatch[value]; // Используем CategoryMatch
        if (categoryClass) {
            this._category.classList.add(categoryClass);
        }
    }

    setItems(item: ICard) {
        this.id = item.id.toString();
        this.title = item.title;
        this.category = item.category;
        this.price = item.price;
        this.image = item.image;
        this.selected = item.selected;
}
}

// обертка для отображения карточки в каталоге
export class viewCard extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) {
      super('card', container, actions);
    }
  }
  
// карточка в модальном окне
export class modalViewCard extends Card {
    protected _description: HTMLElement;
  
    constructor(container: HTMLElement, actions?: ICardActions) {
      super('card', container, actions);
  
      this._description = container.querySelector(`.${this.blockName}__text`);
    }
  
    // добавляем описание
    set description(value: string) {
      this._description.textContent = value;
    }
}