import {Form} from "./common/Form";
import { IEvents } from "./base/events";
import { IContactsForm } from '../types'

export class Contacts extends Form<IContactsForm> {
    private _button: HTMLElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('success:open');
            });
        }
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}