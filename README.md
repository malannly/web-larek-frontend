# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Паттерн

В данной проектной работе для построения архитектуры приложения будет использован паттерн mvp (Model-View-Presenter):
- Model (модель) -> бизнес-логика приложения, база данных, то что будет использовано для технической реализации всех функций
- View (вид) -> интерфейс пользователя, то с чем он будет взаимодействовать в приложении.
- Presenter (представитель) -> посредник между моделью и представлением. Он содержит бизнес-логику приложения и управляет взаимодействием между моделью и представлением. Презентер получает данные от модели, форматирует их и передает представлению для отображения.

## Описание приложения

Приложение состоит из нескольких основных частей: главная страница и модальные окна.
Все модальные окна имеют общую логику:

- значок "крестик" для закрытия окна
- затемнение заднего фона при открытии
- поля ввода должны иметь placeholder, а при повторном открытии очищаться

Главная страница:
-пользователь видит список доступных товаров
- в header страницы отображаются логотип и значок корзины с количеством товаров

    Клик по товару открывает модальное окно с:
        - названием, описанием, ценой
        - возможностью добавить товар в корзину

    Клик по корзине открывает модальное окно корзины с:
        - списком товаров, их ценами, общей стоимостью
        - возможностью удалить товар и оформить заказ

Процесс оформления заказа

Клик по кнопке "Оформить заказ" открывает модальное окно выбора способа оплаты и ввода адреса.
После заполнения пользователь нажимает "Далее" и указывает email и номер телефона.
При корректном заполнении переходит к финальному модальному окну с подтверждением заказа.
Отображается сумма списания и галочка подтверждения.

## Model

Model отвечает за хранение данных и бизнес-логику. Она не взаимодействует напрямую с интерфейсом.

1. Model карточки (CatalogModel):
    Будет ревлизована через интерфейс ICatalog.

    Задачи:
    - хранение списка карточек товаров
    - загрузка товаров из API
    - проверкана наличие товара в корзине
    
    Методы:
    - loadData(): Promise<void> - загрузка карточек из API
    - getAllProducts(): ICatalog[] - возвращает все карточки
    - isInBasket(productId: number): boolean - проверка на наличие товара в корзине

2. Model корзины (BasketModel):
    Будет реализована через интерфейс IBasket.
    
    Задачи:
    - хранение списка товаров в корзине
    - управление товарами (добавление, удаление)
    - расчёт общей суммы заказа
    
    Методы:
    - addToBasket(product: ICatalog): void
    - removeFromBasket(productId: number): void
    - getTotalPrice(): number – итоговая цена
    - clearBasket(): void – очистка корзины после заказа

3. Model покупателя (UserModel):
    Будет реализована через интерфейс IUser.
    
    Задачи:
    - хранение данных пользователя (адрес, оплата, контакты)
    
    Методы:
    - setPaymentMethod(method: string): void
    - setAddress(address: string): void
    - validateUserData(): boolean – проверка, все ли данные введены

## View

View отвечает за отрисовку данных и обработку пользовательских действий.

1. View карточки (ViewCatalog):

    Задачи:
    - получить список карточек из CatalogModel
    - создать карточки товаров в HTML
    - добавить кнопки "Добавить в корзину" с обработчиками

    Методы:
    - renderProducts(products: ICatalog[]): void - рисует карточки
    - bindAddToBasket(handler: (id: number) => void): void - обработчик клика "Добавить в корзину"

2. View корзины (ViewBasket):

    Задачи:
    - показать товары из BasketModel
    - добавить обработчики, чтобы удалить товар (значок мусорки) и "Оформить заказ"

    Методы:
    - renderBasket(items: IBasket[]): void - рисуетмассив краточек
    - bindRemoveProduct(handler: (id: number) => void): void - удаление карточки
    - bindCheckout(handler: () => void): void - оформление заказа

3. View покупателя (ViewUser):
    
    Задачи:
    - показать форму оплаты и доставки
    - обработать ввод пользователя
    
    Методы:
    - renderUserForm(user: IUser): void - форма
    - bindSubmitUserData(handler: (userData: IUser) => void): void - обраюотка формы

## Presenter

Представляет собой связь с API, объединив model и view между собой. Берет данные из Model переедает в View

Главная страница:
На главной странице отображаеться список карточек. Чтобы отобразить (рендерить) карточки понадобяться данные из Model CatalogModel.

Каточка:
Карточка открывается по клику. Передаем данные карточки для отображения. Метод addToBasket() добавляет карточку в корзину (BasketModel).
removeFromBasket() удаляет карточку из BasketModel.

Корзина:
Корзина открывается по клику. Передаем данные корзины из Model BasketModel.

При клике "Оформить заказ" срабатывает метод checkout(), открывается модальное окно с оформлением заказа.

При удалении карточки срабатывает метод removeFromBasket(), изменяются данные в Model BasketModel.

Модальное окно (способ опдат и адрес доставки):
Когда пользователь выбирает способ оплаты и вводит адрес, он нажимает кнопку "Далее".
Срабатывает метод openModal('contactInfo'), открывается следующее модальное окно (email и телефон).

Модальное окно (email и phone number):
Когда оба поля заполнены верно, пользователь нажимает кнопку "Оплатить".
Срабатывает метод openModal('orderSummary'), открывается следующее модальное окно.

Модельное окно (когда закан оплачен):
Передаются данные из Model BasketModel для отображения общей суммы заказа.

## Брокер

Посредник между частями приложения, который помогает обмениваться событиями без прямой связи между объектами.

- basket: update — обновляет корзину при добавлении/удалении товара
- checkoutModal: open — открывает модальное окно оформления
- user: addressAdd — обновляет адрес доставки
- basketModal: open - открывает модалку корзины
- checkoutMoreModal: open - открывает модалку для продолжения ввода доп данных пользователя для товара
- confirmationModal: open - когда заказ оформен и оплачен
- cardOpen: open - открывает карточку с товаром

## Интерфейс

1. ICatalog
- id краточки (уникальный номер карточки)
- title (название)
- sub-title (под-название)
- description (описание)
- price (цена)
- image
- selected (проверяет есть товар в корзине)

2. IBasket
- basket (хранит карточки)
- add (добавить карточку)
- remove (удалить карточку)
- общая сумма
- очистить корзину после оформления
- getBasketAmount() -> получить кол-во товаров

3. ApiCatalog
- список карточек для работы с api

4. IApiCatalog
- список карточек
- список карточек в корзине
- добавить в корзину
- убрать из корзины
- число краточек
- валидация пользователя прошла успешно или нет
- очистить корзину после покупки
- метод для хранения id карточки
- метод для заполнения полей заказа

5. IUser
- address
- phone number
- payment method
- пустой массив карточек (выбранные)
- email
- общая сумма

6. IOrder
- список карточек
- метод оплаты
- общая сумма
- address
- email
- phone number

7. IOrderForm
- address
- email
- метод оплаты
- phone number

## Класс

1. CatalogModel
Представляет собой:
- массив карточки (название, подназвание, описание, цена)
- добавить карточку в корзину -> addToBasket() (наследуеться из BasketModel)
- удалить карточку из карзины -> removeFromBasket() (наследуеться из BasketModel)
- проверку на наличии товара в корзине -> catalogInBasket() (наследуеться из BasketModel)


2. BasketModel
Представляет собой:
- массив карточек (id - для отображения названия, цены), (общее число карточек) -> getCtalog()
- добавить карточку -> addToBasket()
- удалить карточку -> removeFromBasket()
- число карточек -> getTheTotalNumberCatalog()
- финальная сумма всех товаров -> getTheFinalPrice()
- проверку на наличии товара в корзине -> catalogInBasket()
- чистка корзины после полного оформления заказа -> clearBasket()


3. UserModel
Представляет собой
- адрес -> addressUser
- способ оплаты -> paymentMethod
- email -> emailUser
- phone number -> phoneNumberUser