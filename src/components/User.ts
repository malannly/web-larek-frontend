import { IEvents } from './base/events';
import { Form } from './common/Form';
import { IOrderForm } from '../types/index'

export class User extends Form<IOrderForm> {

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
      }
}