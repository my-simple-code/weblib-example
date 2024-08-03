import { Component } from '../../lib/component.js';
import { Modal } from '../../lib/modal.js';
import { store } from '../../common/store.js';
import { FormEditor } from './formEditor.js'


export class ExampleModal extends Component {
    constructor() {
        super();
        this.templateUrl = '/example/modal/example.html';
    }

    onInit() {
        store.status = 'ExampleModal';
        this.onElementEvent(this.el('alert'), 'click', (evt) => this.modal().show('Hello'));
        this.onElementEvent(this.el('confirmation'), 'click', (evt) => this.confirmation());
        this.onElementEvent(this.el('html'), 'click', (evt) => this.showHtml());
        this.onElementEvent(this.el('component'), 'click', (evt) => this.showComponent(false));
        this.onElementEvent(this.el('componentOnly'), 'click', (evt) => this.showComponent(true));
    }

    modal() { return new Modal(); }
    closeModal() { Modal.close(); }

    confirmation() {
        store.status = '';
        this.modal()
            .title('Confirmation')
            .button('Yes', () => { store.status = 'Delete data confirmed'; this.closeModal(); })
            .button('No')
            .show('Should the data be deleted?');
    }

    showHtml() {
        store.status = '';
        const message = '<b>What do you want to do?</b><ul><li>(A) Save data</li><li>(B) Discard changes</li><li>(C) Cancel</li></ul>'

        this.modal()
            .title('Please select the next action')
            .button('Case A', (evt) => this.choosed(evt))
            .button('Case B', (evt) => this.choosed(evt))
            .button('Case C', (evt) => this.choosed(evt))
            .show(message);
    }

    choosed(evt) {
        store.status = `${evt.target.innerText} selected`;
        this.closeModal();
    }

    showComponent(contentOnly=false) {
        store.status = '';

        const templateHtml = this.el('inputFormular').innerHTML;
        const comp = new FormEditor(templateHtml);

        const modal = this.modal()
            .title('Header with close button', true)
            .component(comp, !contentOnly, !contentOnly)
            .button('Cancel')
            .button('Accept changes')
            .show();
        
        comp.ownerModal = modal;
    }
}

