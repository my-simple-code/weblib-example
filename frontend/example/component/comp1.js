import { Component } from '../../lib/component.js';
import { store } from '../../common/store.js';

export class Comp1 extends Component {
    constructor() {
        super();
        this.templateUrl = '/example/component/comp1.html';
    }

    onInit() {
        this.onElementEvent(this.el('button1'), 'click', (evt) => store.status = this.el('label1').innerText);
    }
}
