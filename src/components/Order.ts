import { Form } from "./common/Form";
import { EventEmitter, IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { IOrderForm, paymentMethod } from "../types";

interface IOrderActions {
    onClick: () => void;
}

    export class Order extends Form<IOrderForm> {
        private _addressInput: HTMLInputElement;
        private _paymentButtons: NodeListOf<HTMLButtonElement>;;
        private _button: HTMLButtonElement;
    
        constructor(container: HTMLFormElement, events: IEvents) {
            super(container, events);
    
            this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
            this._paymentButtons = container.querySelectorAll<HTMLButtonElement>('.button__payment');
            this._button = this.container.querySelector('.order__button');

            this._paymentButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const payment = button.name as paymentMethod;
                    this.events.emit('payment:change', { payment });
                });
            });    
            
            if (this._button) {
                this._button.addEventListener('click', () => {
                    events.emit('contacts:open');
                });
            }
        }
    
        set address(value: string) {
            this._addressInput.value = value;
        }
    
        set payment(payment: string) {
            this._paymentButtons.forEach(btn => {
                btn.classList.toggle('button_alt-active', btn.name === payment);
            });
        }
        // render(data: Partial<IOrderForm>): HTMLFormElement {
        //     if (data.payment) {
        //         this.payment = data.payment;
        //     }
        //     if (data.address) {
        //         this.address = data.address;
        //     }
        
        //     return this.container;
        // }
        
    }
    