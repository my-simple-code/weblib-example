import { Component } from '../../lib/component.js';

export class Comp extends Component {
    constructor() {
        super();
        this.templateHtml = '<div><label id="label1">Component</label> <span class="button-like" id="button1">Test</span></div>';
    }
}
