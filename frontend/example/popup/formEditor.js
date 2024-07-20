import { Component } from '../../lib/component.js';
import { Popup } from '../../lib/popup.js';


export class FormEditor extends Component {
    constructor(templateHtml) {
        super();
        this.templateHtml = templateHtml;
        this.ownerPopup = undefined;
    }

    onInit() {
        this.onElementEvent(this.el('cancel'), 'click', (evt) => Popup.close());
        this.onElementEvent(this.el('popup'), 'click', (evt) => this.secondaryPopup());
        this.onElementEvent(this.el('isValid'), 'change', (evt) => this.updatePopupButton(true));
        this.onElementEvent(this.el('isNotValid'), 'change', (evt) => this.updatePopupButton(false));
    }

    updatePopupButton(valid) {
        if (this.ownerPopup && this.ownerPopup.dom.buttons.length > 0) {
            this.ownerPopup.dom.buttons[1].disabled = !valid;
        }
    }

    secondaryPopup() {
        (new Popup())
            .button('Close parent popup', () => Popup.close(this.ownerPopup.id))
            .button('Close')
            .show('Secondary popup');
    }
}
