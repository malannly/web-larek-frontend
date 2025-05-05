import './scss/styles.scss';
import { AppAPI } from "./components/AppApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { AppData, CardChangeEvent }  from "./components/AppData";
import {Page} from "./components/Page";
import {Modal} from "./components/common/Modal";
import {cloneTemplate, ensureElement} from "./utils/utils";
import { CardPage, CardBasket, CardPreview } from './components/Card';
import { ICardItem, paymentMethod, IOrderForm, IContactsForm } from './types/index';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Success } from './components/Success';
import { Contacts } from './components/Contacts';

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
const appData = new AppData({}, events);

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

// Получаем карточки с сервера
api
	.getCardList()
	.then(appData.setCards.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// Изменились элементы каталога
events.on<CardChangeEvent>('cards:updated', () => {
	page.catalog = appData.getCards().map((item) => {
		const card = new CardPage('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
        return card.render(item);
	});

	page.counter = appData.basket.length;
});

events.on('card:select', (item: ICardItem) => {
    appData.setPreview(item);
    const previewElement = cloneTemplate(cardPreviewTemplate);
    const preview = new CardPreview('card', previewElement, {
      onClick: () => {
        const inBasket = appData.basket.includes(item.id);
        if (inBasket) {
          appData.removeFromBasket({ id: item.id });
        } else {
          appData.addToBasket({ id: item.id });
        }

        preview.buttonText = inBasket ? 'В корзину' : 'Удалить';
      }
    });
    
    if (item.price === null) {
      preview.buttonText = 'Недоступно';
      preview.disabled = true;
    } else {
      preview.buttonText = appData.basket.includes(item.id) ? 'Удалить' : 'В корзину';
      preview.disabled = false;
    }
    modal.render({ content: preview.render(item) });
    events.emit('modal:open');
  });
  
  const basketElement = cloneTemplate(basketTemplate);
  const basket = new Basket(basketElement, events);
    
// Открытие корзины
events.on('basket:open', (event: { id: string }) => {
    modal.render({ content: basketElement })
    basket.selected = appData.basket;
});
  
  events.on('basket:changed', () => {
    updateBasketView();
    basket.selected = appData.basket;
});

function updateBasketView() {
    // обновляем счётчик
    page.counter = appData.basket.length;
  
    // обновляем список товаров в корзине
    const basketItems = appData.basket.map((id, index) => {
      const item = appData.getCard(id);
      const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
        onClick: () => {
          appData.removeFromBasket({ id: item.id });
        }
      });
  
      card.index = String(index + 1);
      return card.render(item);
    });
  
    basket.items = basketItems;
    basket.total = appData.getTotal();
  }  

const order = new Order(cloneTemplate(orderTemplate), events);

// Изменилось состояние валидации формы
events.on('FormErrorsOrder:change', (errors: Partial<IOrderForm>) => {
    const { address, payment } = errors;
    contacts.valid = !address && !payment;
    contacts.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on('order.address:change', (data: { value: string }) => {
    appData.setAddress(data.value);
});

events.on('order.payment:change', (data: { value: string }) => {
        appData.setPayment(data.value as paymentMethod);
    
});

events.on('order:changed', () => {
    const { address, payment } = appData.validateOrder();
    const valid = !address && !payment;
    const errors = Object.values({address, payment}).filter(i => !!i).join('; ');
    order.render({
        address: appData.order.address,
        payment: appData.order.payment,
        valid: valid,
        errors: errors,
    });
})

// Открыть форму заказа
events.on('order:open', () => {
    if (appData.basket.length === 0) {
        return;
    }
    modal.render({ content: order.render() });
});

// Изменилось состояние валидации формы
events.on('FormErrorsContacts:change', (errors: Partial<IContactsForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^contacts\..*:change/, (data: { field: keyof IContactsForm, value: string }) => {
    appData.setContacts(data.field, data.value);
});

events.on('contacts:changed', () => {
    const { email, phone } = appData.validateContacts();
    const valid = !email && !phone;
    const errors = Object.values({phone, email}).filter(i => !!i).join('; ');
    contacts.render({
        email: appData.contacts.email,
        phone: appData.contacts.phone,
        valid: valid,
        errors: errors,
    });
})

// Открыть форму заказа
events.on('contacts:open', () => {
    modal.render({ content: contacts.render() });
});

const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

const successElement = cloneTemplate(successTemplate);

const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => {
        modal.close();
    }
});

// Отправлена форма заказа
events.on('contacts:submit', () => {

    const orderData = {
        email: appData.contacts!.email,
        phone: appData.contacts!.phone,
        payment: appData.order!.payment,
        address: appData.order!.address,
        items: appData.basket,
        total: appData.getTotal()
    };

    api
    
        .orderCards(orderData)
        .then((result) => {
            appData.clearBasket();
            appData.initOrder();
            appData.initContacts();
            modal.render({
                content: success.render({ finalPrice: result.total })
            });
        })
        .catch(err => {
            console.error(err);
        });
});


// инитизируем данные
appData.initContacts()
appData.initOrder()