import './scss/styles.scss';
import { AppAPI } from "./components/AppApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { AppData }  from "./components/AppData";
import {Page} from "./components/Page";
import {Modal} from "./components/common/Modal";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import { Card, ICard, CardItem, CardBasket } from './components/Card';
import { ICardItem, ITypeItem } from './types/index';
import { Basket } from './components/Basket';
import { Order } from './components/Order';

const events = new EventEmitter();
const api = new AppAPI(CDN_URL, API_URL);

// Отладка
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
});

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных
const card = new AppData({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Блокировка прокрутки
events.on('modal:open', () => {
  page.locked = true;
});
events.on('modal:close', () => {
  page.locked = false;
});

// Получение карточек
api.getCardList()
  .then(data => {
    card.setCards(data);

    const cardViews: HTMLElement[] = data.map((item: ICardItem) => {
      const cardElement = cloneTemplate(cardCatalogTemplate);
      const cardView = new Card('card', cardElement, {
        onClick: () => events.emit('card:select', item),
      });

      cardView.id = item.id;
      cardView.title = item.title;
      cardView.image = item.image;
      cardView.price = item.price ? `${item.price} синапсов` : 'Бесценно';
      cardView.category = {
        category: item.typeItem,
        label: card.getCategoryLabel(item.typeItem),
      };

      return cardView.render();
    });

    page.catalog = cardViews;
  })
  .catch(err => console.error(err));

// модалка карточек
events.on('card:select', (item: ICardItem) => {
  const previewElement = cloneTemplate(cardPreviewTemplate);
  const preview = new CardItem('card', previewElement, {
    onClick: () => {
      if (card.basket.includes(item.id)) {
        events.emit('basket:remove', { id: item.id });
      } else {
        events.emit('basket:add', { id: item.id });
      }
      events.emit('card:updatePreview', { id: item.id });
    }
  });

  preview.id = item.id;
  preview.title = item.title;
  preview.image = item.image;
  preview.price = item.price ? `${item.price} синапсов` : 'Бесценно';
  preview.category = {
    category: item.typeItem,
    label: card.getCategoryLabel(item.typeItem),
  };
  preview.text = item.description;

  const inBasket = card.basket.includes(item.id);
  const button = previewElement.querySelector('.card__button') as HTMLButtonElement;
  if (button) {
    button.textContent = inBasket ? 'Убрать' : 'В корзину';
  }

  modal.render({
    content: preview.render()
  });

  events.emit('modal:open');
});

// Обновление кнопки 
events.on('card:updatePreview', ({ id }: { id: string }) => {
  const button = document.querySelector('.card__button') as HTMLButtonElement;
  if (!button) return;

  const inBasket = card.basket.includes(id);
  button.textContent = inBasket ? 'Убрать' : 'В корзину';
});

// корзина
const basketElement = cloneTemplate(basketTemplate);
const basket = new Basket(basketElement, events);

function updateBasketView() {
  const basketItems = card.basket.map(id => {
    const item = card.getCard(id);
    const cardElement = cloneTemplate(cardBasketTemplate);
    const basketItem = new CardBasket('card', cardElement, {
      onClick: () => events.emit('basket:remove', { id }),
    });

    basketItem.id = item.id;
    basketItem.title = item.title;
    basketItem.price = item.price ? `${item.price} синапсов` : 'Бесценно';

    return basketItem.render();
  });

  basket.items = basketItems;
  basket.selected = card.basket;
  basket.total = card.getTotal();
  page.counter = card.basket.length;
}

events.on('basket:add', (event: { id: string }) => {
  card.addToBasket({ id: event.id });
  updateBasketView();
});

events.on('basket:remove', (item: { id: string }) => {
  card.removeFromBasket({ id: item.id });
  updateBasketView();
});

// Открытие корзины
events.on('basket:open', () => {
  updateBasketView();
  modal.render({ content: basketElement });
  basketElement.classList.add('modal_active');
  page.locked = true;
});

// Закрытие корзины
events.on('basket:close', () => {
  basketElement.classList.remove('modal_active');
  page.locked = false;
});

