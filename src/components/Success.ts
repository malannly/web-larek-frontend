import { Component } from "./base/Component";
import { ensureElement } from "./../utils/utils";

interface ISuccess {
    finalPrice: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set finalPrice(value: number) {
        if (this._total) {
            this._total.textContent = `Списано ${value} синапсов`;
        }
    }
}
