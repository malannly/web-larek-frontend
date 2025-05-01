import { Form } from "./common/Form";
import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IOrderActions {
    onClick: () => void;
}

export type ITypePayment = 'card' | 'cash'

// форма товара
export interface IOrderForm {
    payment: string;
    address: string
    }

    export class Order extends Form<IOrderForm> {
        private _addressInput: HTMLInputElement;
        private _paymentButtons: HTMLButtonElement[];
        private _submitButton: HTMLButtonElement;
        private _selectedPayment: ITypePayment | null = null;
    
        constructor(blockName: string, container: HTMLFormElement, events: EventEmitter, actions?: IOrderActions) {
            super(container, events);
    
            // поле адреса
            this._addressInput = ensureElement<HTMLInputElement>('.form__input', container);
            this._submitButton = ensureElement<HTMLButtonElement>('.order__button', container);
            this._paymentButtons = Array.from(container.querySelectorAll<HTMLButtonElement>('.button__payment'));
    
            // адрес 
            this._addressInput.addEventListener('input', () => {
                this.onInputChange('address', this._addressInput.value.trim());
                this._validate();
            });
    
            // кнопки оплаты
            this._paymentButtons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.selected = btn.name as ITypePayment;
                    this._validate();
                });
            });
    
            this._submitButton.addEventListener('click', (event) => {
                event.preventDefault();
                if (this._submitButton.disabled) return;
                events.emit('contacts:open');
            });
        }
    
        // выбор кнопки оплаты
        set selected(name: ITypePayment) {
            this._selectedPayment = name;
            this._paymentButtons.forEach((btn) => {
                const isSelected = btn.name === name;
                btn.classList.toggle('button_alt', !isSelected);
            });
        }
    
        protected _getFormData(): IOrderForm {
            return {
                payment: this._selectedPayment || '',
                address: this._addressInput.value.trim(),
            };
        }
        private _validate() {
            const isValid = this._selectedPayment && this._addressInput.value.trim().length > 0;
            this._submitButton.disabled = !isValid;
        }
    }
    