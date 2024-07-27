import { Component } from '../../lib/component.js';
import { Control, Input, SingleSelect, MultiSelect, Table } from '../../lib/controls.js';
import { store } from '../../common/store.js';
import { action } from '../../common/action.js';


export class ExampleRender extends Component {
    constructor() {
        super();
        this.templateUrl = '/example/render/example.html';
    }

    async onInit() {
        this.table1 = new Table(this.el('table1'));
        this.table1.onSelectionChanged(() => this.onTable1SelectionChanged(), 'selected');
        this.onPropertyChanged(store, 'employee_list', data => this.onTableDataLoaded(data));

        this.table2 = new Table(this.el('table2'));
        this.table2.onSelectionChanged(() => this.onTable2SelectionChanged());
        
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const controls1 = weekdays.map(day => new Control(this.el(`${day}_1`)));
        this.selectClient = new SingleSelect(controls1);
        this.selectClient.onSelectionChanged(ctl => action.get_emploee_list(ctl.innerText), 'selected');
        this.selectClient.selectedItem = controls1[0];
        action.get_emploee_list(this.selectClient.selectedItem.innerText);

        const controls2 = weekdays.map(day => new Control(this.el(`${day}_2`)));
        this.selectServer = new SingleSelect(controls2);
        this.selectServer.onSelectionChanged(ctl => this.loadServerRenderedHtml(ctl.innerText, -1), 'selected');
        this.selectServer.selectedItem = controls2[0];
        this.loadServerRenderedHtml(this.selectServer.selectedItem.innerText, -1)
    }

    onTableDataLoaded(data) {
        this.table1.selectedCell = undefined;
        this.table1.tableData = data;

        const html_rows = this.table1.tableData.map((row, ndx) => `<tr class="clickable" id="${this.table1.id}_${ndx}"><td>${row.name}</td><td>${row.first_name}</td><td>${row.birthday}</td></tr>`);
        this.table1.innerHTML = html_rows.join('\n');
    }

    onTable1SelectionChanged() {
        const row_index = this.table1.selectedRow.index;
        const row = this.table1.tableData[row_index];
        store.status = `${row.name}, ${row.first_name} (${row.birthday}) selected`;
    }

    async onTable2SelectionChanged() {
        const weekday = this.selectServer.selectedItem.innerText;
        const selectedId = this.table2.selectedRow.id;
        await this.loadServerRenderedHtml(weekday, selectedId);
    }

    async loadServerRenderedHtml(weekday, selectedId) {
        this.table2.innerHTML = await action.get_emploee_list_rendered(weekday, selectedId);
        store.status = '---';
        if (selectedId !== -1) {
            store.status = await action.get_emploee_details_rendered(weekday, selectedId);
        }
    }
}
