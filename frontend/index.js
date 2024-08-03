import { Component } from './lib/component.js';
import { ExampleComponent } from './example/component/example.js';
import { ExampleModal } from './example/modal/example.js';
import { ExampleControls } from './example/controls/example.js';
import { ExampleCustomControl} from './example/custom/example.js';
import { ExampleRender} from './example/render/example.js';
import { store } from './common/store.js';

class Application extends Component {
    // change script reference in index.html to src="index2.js"
    // for menu management with SingleSelect control
    onInit() {
        this._activeMenu = undefined;
        this.main = this.el('main');

        this.onPropertyChanged(store, 'status', (val) => this.el('spanStatus').innerText = val);

        this.onElementEvent(this.el('btnComponent'), 'click', (evt) => this.setContent(evt, new ExampleComponent()));
        this.onElementEvent(this.el('btnModal'), 'click', (evt) => this.setContent(evt, new ExampleModal()));
        this.onElementEvent(this.el('btnControls'), 'click', (evt) => this.setContent(evt, new ExampleControls()));
        this.onElementEvent(this.el('btnCustom'), 'click', (evt) => this.setContent(evt, new ExampleCustomControl()));
        this.onElementEvent(this.el('btnRender'), 'click', (evt) => this.setContent(evt, new ExampleRender()));
    }

    setContent(evt, component) {
        this.activeMenu = evt.srcElement;
        this.loadComponent(this.main, component);
    }

    set activeMenu(element) {
        if (this._activeMenu) {
            this._activeMenu.className = '';
        }
        this._activeMenu = element;
        this._activeMenu.className = 'sidenav-active';
    }
}

let app = new Application().bindDocument();
