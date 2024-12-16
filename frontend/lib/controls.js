export class Control {
    constructor(el) {
        this.element = el;
        this.data = {};
        this.children = [];
    }

    onClick(callback, add=true) {
        add ? this.element.addEventListener('click', callback)
            : this.element.removeEventListener('click', callback);
    }

    get id() { return this.element.id; }
    
    get innerText() { return this.element.innerText; }
    set innerText(val) { this.element.innerText = val; }

    get innerHTML() { return this.element.innerHTML; }
    set innerHTML(val) { this.element.innerHTML = val; }

    set disabled(val) {
        this.element.disabled = val;
        this.setStyle(`opacity: ${val ? '0.5': '1'};`);
    }

    cloneElement() { return this.element.content.cloneNode(true); }

    addElement(elem) {
        elem = (typeof elem === "string") ? document.createElement(elem) : elem;
        this.element.appendChild(elem);
        return elem;
    }

    insertElement(elem, child=undefined) {
        elem = (typeof elem === "string") ? document.createElement(elem) : elem;
        child = child || this.element.firstElementChild;
        if (child) {
            this.element.insertBefore(elem, child);
        }
        else {
            this.element.appendChild(elem);
        }
        return elem;
    }

    setClass(cls, add=true) {
        cls.split(' ').forEach(x => {
          if (add && !this.element.classList.contains(x)) {
            this.element.classList.add(x);
          }
          if (!add && this.element.classList.contains(x)) {
            this.element.classList.remove(x);
          }
        });
        return this;
    }

    setStyle(css, replace=false) {
        if (replace) {
            this.element.setAttribute("style", css);
        }
        else {
            css.split(';').forEach(prop => {
                if (prop.indexOf(':') > -1) {
                    const attr = prop.split(':');
                    this.element.style.setProperty(attr[0].trim(), attr[1].trim());
                }
            });
        }
    }

    getData(key, defaultValue=undefined) { return this.data[key] || defaultValue; }
    setData(key, value) { this.data[key] = value; }
    addControl(ctl) { this.children.push(ctl); }
}

export class Input extends Control {
    constructor(element) {
        super(element)
    }

    onChange(callback, add=true) {
        add ? this.element.addEventListener('change', callback)
            : this.element.removeEventListener('change', callback);
    }

    get value() { return this.element.value; }
    set value(val) { this.element.value = val; }

    get checked() { return this.element.checked; }
    set checked(val) {this.element.checked = val; }
}


export class ListBox extends Input {
    constructor(element) {
        super(element)
    }
    get value() { return this.element.value; }
    get options() { return this.element.options; } 
    get length() { return this.element.length; }
    get selectedItems() { return this.option.where(x => x.selected); }

    selectValue(value, selected=true) {
        var option = this.options.first(x => x.value === value);
        if (option) {
            option.selected = selected;
        }
    }

    add(text, value) {
        var option = new Option(text, value, false, false);
        this.options[this.length] = option;
    }

    remove(index) {
        this.options[index] = null;
    }  
}

class Cell extends Control {
    get index() { return this.element.cellIndex;} 
    get row() { return new Row(this.element.parentElement); }
    get table() { return this.row.table; }
}

class Row extends Control {
    get index() { return this.element.rowIndex; }
    get table() { return this.element.parentElement.parentElement; }
    get cells() { return [...this.element.children].map(x => new Cell(x));}
    get hasCells() { return this.element.hasChildNodes() };
    get firstCell() { return this.hasCells ? new Cell(this.element.firstChild) : undefined; }
    get lastCell() { return this.hasCells ? new Cell(this.element.lastChild) : undefined; }
}

export class Table extends Control {
    constructor(element) {
        super(element);
        this._onSelectionChanged = undefined;
        this._selectionClass = undefined;
        this._selectedCell = undefined;
        this.onClick(evt => {
            const cell = evt.target.closest('td');
            if (cell) {
                this.selectCell(new Cell(cell))
            }
        })
    }

    get tableData() { return this.getData('tableData', []); }
    set tableData(val) { this.setData('tableData', val); }
    get selectedRow() { return this._selectedCell ? this._selectedCell.row : undefined }
    get hasRows() { return this.element.tBodies.length > 0 && this.element.tBodies[this.element.tBodies.length-1].hasChildNodes() };
    get firstRow() { return this.hasRows ? new Row(this.element.tBodies[this.element.tBodies.length-1].firstChild) : undefined; }
    get lastRow() { return this.hasRows ? new Row(this.element.tBodies[this.element.tBodies.length-1].lastChild) : undefined; }

    get selectedCell() {return this._selectedCell;}
    set selectedCell(cell) {return this._selectedCell = cell;}

    onSelectionChanged(callback, selectionClass) {
        this._onSelectionChanged = callback;
        this._selectionClass = selectionClass;
    }

    newRow() {
        const tbody = this.element.tBodies.length > 0
            ? this.element.tBodies[this.element.tBodies.length-1]
            : this.insertElement('tbody');
        return new Row(new Control(tbody).insertElement('tr'));
    }

    selectCell(cell) {
        const selectedOld = this._selectedCell;
        if (this._selectionClass && this._selectedCell) {
            this._selectedCell.row.setClass(this._selectionClass, false)
        }
        this._selectedCell = cell;
        if (this._selectionClass && this._selectedCell) {
            this._selectedCell.row.setClass(this._selectionClass, true)
        }
        if (this._onSelectionChanged && this._selectedCell) {
            this._onSelectionChanged(this._selectedCell, selectedOld);
        }
    }

    selectRow(row) { this.selectCell(row.firstCell); }
}

export class SingleSelect {
    constructor(controls) {
        this._items = controls;
        this._onSelectionChanged = undefined;
        this._selectionClass = undefined;
        this._selectedControl = undefined;
        this._items.forEach(item => this.bindItem(item));
    }

    bindItem(item) {
        item.onClick(() => this.onItemClick(item));
    }

    get items() { return this._items; }
    get selectedItem() { return this._selectedControl; }
    set selectedItem(item) { this._selectedControl = item; this.viewSelection(); }
    add(item) {
        this._items.push(item);
        this.bindItem(item);
    }

    onSelectionChanged(callback, selectionClass) {
        this._onSelectionChanged = callback;
        this._selectionClass = selectionClass;
    }

    onItemClick(item) {
        const selectedOld = this._selectedControl;
        this._selectedControl = item;
        this.viewSelection();

        if (this._onSelectionChanged) {
            this._onSelectionChanged(this._selectedControl, selectedOld);
        }
    }

    viewSelection() {
        if (this._selectionClass) {
            this._items.forEach(ctl => {
                ctl.setClass(this._selectionClass, ctl === this._selectedControl);
            });
        }
    }
}

export class MultiSelect extends SingleSelect{
    constructor(controls) {
        super(controls)
        this._selectedControls = [];
    }

    get selectedItems() { return this._selectedControls; }
    set selectedItems(items) { this._selectedControls = items; this.viewSelection(); }

    onItemClick(control) {
        const selectedOld = [...this._selectedControls];

        const index = this._selectedControls.indexOf(control);
        index === -1
            ? this._selectedControls.push(control)
            : this._selectedControls.splice(index, 1);

        this.viewSelection();

        if (this._onSelectionChanged) {
            this._onSelectionChanged(this._selectedControls, selectedOld);
        }
    }

    viewSelection() {
        if (this._selectionClass) {
            this._items.forEach(ctl => {
                ctl.setClass(this._selectionClass, this._selectedControls.indexOf(ctl) > -1);
            });
        }
    }
}
