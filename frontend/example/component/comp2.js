import { Component } from '../../lib/component.js';
import { store } from '../../common/store.js';

export class Comp2 extends Component {
    constructor() {
        super();
        this.templateHtml = '<div><label id="label1">Comp-2</label> <button id="button1">Test</button></div>';
    }

    onInit() {
        this.onElementEvent(this.el('button1'), 'click', (evt) => store.status = this.el('label1').innerText);
    }
}
