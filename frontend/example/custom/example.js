import { Component } from '../../lib/component.js';
import { Control, MultiSelect } from '../../lib/controls.js';
import { store } from '../../common/store.js';
import { TabPage, TabView } from './tabView.js'
import { Comp } from './comp.js';


export class ExampleCustomControl extends Component {
    constructor() {
        super();
        this.templateUrl = '/example/custom/example.html';
    }

    async onInit() {
        store.status = 'ExampleCustomControl';
        const tabs = [
            new TabPage(this.el('btn1'), this.el('pane1')),
            new TabPage(this.el('btn2'), this.el('pane2')),
            new TabPage(this.el('btn3'), this.el('pane3'))
        ]
        this.tabView = new TabView(tabs);
        this.tabView.onSelectionChanged(() => this.onTabSelectionChanged(), 'selected-tab-button');
        this.tabView.selectedItem = tabs[2];
        tabs[1].disabled = true;

        this.addButton = new Control(this.el('add'));
        this.addButton.onClick(() => this.addTab());

        const ids = ['comp1', 'comp2', 'comp3','comp4','comp5'];
        const components = await Promise.all(ids.map(async (id) => await this.loadComponent(this.el(id), new Comp())));
        const controls = components.map(comp=> new Control(comp.el('button1')));
        this.multiSelect = new MultiSelect(controls);
        this.multiSelect.onSelectionChanged(() => {}, 'selected');
        this.multiSelect.selectedItems = [controls[0], controls[2]];
    }

    onTabSelectionChanged() {
        store.status = this.tabView.selectedItem.innerText;
    }

    addTab() {
        const ctlButtons = new Control(this.el('btnBar'));
        const elemButton = ctlButtons.insertElement('button', ctlButtons.element.lastElementChild);
        elemButton.setAttribute('id', `btn${this.tabView.items.length + 1}`);
        elemButton.innerText = `Page ${this.tabView.items.length + 1}`;

        const ctlPanes = new Control(this.el('paneBar'));
        const elemPane = ctlPanes.addElement('div');
        elemPane.setAttribute('id', `pane${this.tabView.items.length + 1}`);
        elemPane.innerText = `Content ${this.tabView.items.length + 1}`;

        const tab = new TabPage(elemButton, elemPane);
        this.tabView.add(tab);
        this.tabView.selectedItem = tab;
    }
}
