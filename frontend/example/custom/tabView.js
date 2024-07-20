import { Control, SingleSelect } from '../../lib/controls.js';

export class TabPage extends Control {
    constructor(navElement, pageElement) {
        super(navElement)
        this.children.push(new Control(pageElement));
    }
}

export class TabView extends SingleSelect {
    constructor(tabPages) {
        super(tabPages);
    }

    viewSelection() {
        super.viewSelection();
        this.items.forEach(x => x.children[0].setStyle('display: none;'));
        this.selectedItem.children[0].setStyle('display: block;')
    }
}
