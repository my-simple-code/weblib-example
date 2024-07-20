import { Component } from '../../lib/component.js';
import { Control, Input, SingleSelect, MultiSelect, Table } from '../../lib/controls.js';
import { store } from '../../common/store.js';

export class ExampleControls extends Component {
    constructor() {
        super();
        this.templateUrl = '/example/controls/example.html';
    }

    onInit() {
        store.status = 'ExampleControls';
        this.toggleButton = new Control(this.el('btnToggle'));
        this.toggleButton.onClick(() => {
            this.toggleButton.setData('selected', !this.toggleButton.getData('selected', false));
            this.toggleButton.setStyle(this.toggleButton.getData('selected') ? 'background-color: lightblue;' : 'background-color: white;');
        });

        this.colorTarget = new Control(this.el('colorTarget'));
        this.colorPicker = new Input(this.el('colorPicker'));
        this.colorPicker.onChange(() => this.colorTarget.setStyle(`background-color: ${this.colorPicker.value};`));
        
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const spanControls = weekdays.map(day => new Control(this.el(`span${day}`)));
        this.multiSelect = new MultiSelect(spanControls);
        this.multiSelect.onSelectionChanged(ctlList => store.status = ctlList.map(x => x.innerText).join(', '), 'selected');
        this.multiSelect.selectedItems = [spanControls[1], spanControls[4]];

        const divControls = weekdays.map(day => new Control(this.el(`div${day}`)));
        this.singleSelect = new SingleSelect(divControls);
        this.singleSelect.onSelectionChanged(ctl => store.status = ctl.innerText, 'selected');
        this.singleSelect.selectedItem = divControls[0];
    }

    onTableDataLoaded(data) {
        this.table1.selectedCell = undefined;
        this.table1.tableData = data;

        const html_rows = this.table1.tableData.map((row, ndx) => `<tr class="clickable" id="${this.table1.id}_${ndx}"><td>${row.name}</td><td>${row.first_name}</td><td>${row.birthday}</td></tr>`);
        this.table1.innerHTML = html_rows.join('\n');
    }
}
