import { Component } from '../../lib/component.js';
import { store } from '../../common/store.js';

export class Comp3 extends Component {
    constructor() {
        super();
        this.templateUrl = '/render/template';
        this.templateIsStatic = false;
    }

    onInit() {
        this.onElementEvent(this.el('button1'), 'click', (evt) => store.status = this.el('label1').innerText);
    }
}
