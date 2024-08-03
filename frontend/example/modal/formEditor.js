import { Component } from '../../lib/component.js';
import { Modal } from '../../lib/modal.js';


export class FormEditor extends Component {
    constructor(templateHtml) {
        super();
        this.templateHtml = templateHtml;
        this.ownerModal = undefined;
    }

    onInit() {
        this.onElementEvent(this.el('cancel'), 'click', (evt) => Modal.close());
        this.onElementEvent(this.el('modal'), 'click', (evt) => this.secondaryModal());
        this.onElementEvent(this.el('isValid'), 'change', (evt) => this.updateModalButton(true));
        this.onElementEvent(this.el('isNotValid'), 'change', (evt) => this.updateModalButton(false));
    }

    updateModalButton(valid) {
        if (this.ownerModal && this.ownerModal.dom.buttons.length > 0) {
            this.ownerModal.dom.buttons[1].disabled = !valid;
        }
    }

    secondaryModal() {
        (new Modal())
            .button('Close parent modal', () => Modal.close(this.ownerModal.id))
            .button('Close')
            .show('Secondary modal');
    }
}
