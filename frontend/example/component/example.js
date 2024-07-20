import { Component } from '../../lib/component.js';
import { store } from '../../common/store.js';
import { Comp1 } from './comp1.js';
import { Comp2 } from './comp2.js';


export class ExampleComponent extends Component {
    constructor() {
        super();
        this.templateUrl = '/example/component/example.html';
    }

    onInit() {
        store.status = 'ExampleComponent';
        const template = this.el('comp3Template').innerHTML;
        this.loadComponent(this.el('comp1'), new Comp1());
        this.loadComponent(this.el('comp2'), new Comp2());
        this.loadComponent(this.el('comp3'), new Comp3(template));
    }
}

class Comp3 extends Component {
    constructor(templateHtml) {
        super();
        this.templateHtml = templateHtml;
    }

    onInit() {
        this.onElementEvent(this.el('button1'), 'click', (evt) => store.status = this.el('label1').innerText);
    }
}
