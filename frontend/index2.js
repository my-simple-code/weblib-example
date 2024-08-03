import { Component } from './lib/component.js';
import { ExampleComponent } from './example/component/example.js';
import { ExampleModal } from './example/modal/example.js';
import { ExampleControls } from './example/controls/example.js';
import { ExampleCustomControl} from './example/custom/example.js';
import { ExampleRender} from './example/render/example.js';
import { Control, SingleSelect } from './lib/controls.js';
import { store } from './common/store.js';

class Application extends Component {
    onInit() {
        this.onPropertyChanged(store, 'status', (val) => this.el('spanStatus').innerText = val);
        this.mainDiv = this.el('main');
        this.menu = new SingleSelect([this.ctl('btnComponent', ExampleComponent),
                                     this.ctl('btnModal', ExampleModal),
                                     this.ctl('btnControls', ExampleControls),
                                     this.ctl('btnCustom', ExampleCustomControl),
                                     this.ctl('btnRender', ExampleRender)]);

        this.menu.onSelectionChanged(ctl => this.onMenu(ctl), 'sidenav-active');
    }

    ctl(elementId, compClass) {
        const ctl = new Control(this.el(elementId));
        ctl.setData('compClass', compClass);
        return ctl;
    }

    onMenu(ctl) {
        const componentClass = ctl.getData('compClass');
        this.loadComponent(this.mainDiv, new componentClass());
    }
}

let app = new Application().bindDocument();
