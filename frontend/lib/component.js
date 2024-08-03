class PropertyBinding {
    constructor(obj, attr) {
        var _this = this;
        this.actions = [];
        this.value = obj[attr];

        Object.defineProperty(obj, attr, {
            get: () => { return _this.value; },
            set: (val) => { var old = _this.value; _this.value = val; _this.actions.forEach(action => action(val, old)); }
        });
    }

    addPropertyListener(action = (val) => { }, executeImmediately=true) {
        this.actions.push(action);
        if (executeImmediately) { action(this.value, this.value) };
    };

    removePropertyListener(action = (val) => { }) {
        this.actions =this.actions.filter( x=> x !== action);
    }
}

class Bindings {
    static _objects = [];
    static _propertyBindings = {};

    _eventBindings = [];
    _propertyBindings = [];

    constructor(componentId) {
        this.componentId = componentId;
    }

    _getObjectId(obj) {
        var ndx = Bindings._objects.indexOf(obj);
        return ndx > -1 ? ndx + 1 : Bindings._objects.push(obj);
    }

    onElementEvent(element, eventName, action = (evt) => action(evt)) {
        element.addEventListener(eventName, (evt) => action(evt));
        this._eventBindings.push({element, eventName, action});
    }
    
    onPropertyChanged(obj, attr, action = (evt) => action(evt), executeImmediately=true) {
        const propertyId = `obj:${this._getObjectId(obj)}-attr:${attr}`;
        if (!(propertyId in Bindings._propertyBindings)) {;
            Bindings._propertyBindings[propertyId] = new PropertyBinding(obj, attr);
        }
        Bindings._propertyBindings[propertyId].addPropertyListener(action, executeImmediately);
        this._propertyBindings.push({propertyId, action});
    }

    removeBindings() {
        this._eventBindings.forEach(binding => binding.element.removeEventListener(binding.eventName, binding.action));
        this._eventBindings = [];
        this._propertyBindings.forEach(binding => Bindings._propertyBindings[binding.propertyId].removePropertyListener(binding.action));
        this._propertyBindings = [];
    }
}

export class Component {
    static template = {};
    constructor() {
        this.bindings = new Bindings();
        this.parent_element = undefined;
        this.parent_component = undefined;
        this.child_component_map = {};
        this.child_elem_id_list = [];
        this.templateIsStatic = true;
    }
    
    get name() { return `${this.constructor.name}`; }
    get path() { return this.parent_component === undefined ? 'document' : `${this.parent_component.path}.${this.parent_element.id}`; }
    get fullname() { return `${this.path}.${this.name}`; }
 
    set templateUrl(value) { Component.template[`${this.name}.url`] = value; }
    get templateUrl() { return Component.template[`${this.name}.url`]; }

    set templateHtml(value) { Component.template[`${this.name}.html`] = value; }
    get templateHtml() { return Component.template[`${this.name}.html`]; }

    set templateIsStatic(value) { Component.template[`${this.name}.isStatic`] = value; }
    get templateIsStatic() { return Component.template[`${this.name}.isStatic`]; }

    _removeBindings() {
        this.bindings.removeBindings(this.fullname);
    }

    _setParent(component, element) {
        this.parent_component = component
        this.parent_element = element;
    }

    _getElementById(node, id) {
        if (node.id === id) {
            return node;
        }
        var target;
        node = node.firstChild;
        while (node) {
            if (node.id === id) {
                return node;
            }
            if (!this.child_elem_id_list.includes(node.id)) {
                target = this._getElementById(node, id);
                if (target) {
                    return target;
                }
            }
            node = node.nextSibling;
        }
        return undefined;
    }

    onInit() {}

    onDestroy() {}

    onPropertyChanged(obj, attr, action = (evt) => action(evt), executeImmediately=true) {
        this.bindings.onPropertyChanged(obj, attr, action, executeImmediately);
    }

    onElementEvent(el, eventName, action = (evt) => action(evt)) {
        this.bindings.onElementEvent(el, eventName, action, this.fullname);
    }

    el(element) { return (typeof element === "string") ? this._getElementById(this.parent_element, element) : element; }

    bindDocument() {
        this._setParent(undefined, document);
        this.bindings.onElementEvent(document, "DOMContentLoaded", (evt) => this.onInit());
        return this;
    }

    selectAllComponents() {
        // return self and all child components
        const result = [this];
        Object.keys(this.child_component_map).forEach(key => result.push(...this.child_component_map[key].selectAllComponents()));
        return result;
    }

    unloadComponent(elem) {
        if (elem.id in this.child_component_map) {
            const childComponents = this.child_component_map[elem.id].selectAllComponents();
            childComponents.forEach(x => {
                x.onDestroy();
                x._removeBindings();
            });
        }
        elem.innerHTML = '';
    }

    async loadComponent(elem, component) {
        if (!this.child_elem_id_list.includes(elem.id)) {
            this.child_elem_id_list.push(elem.id);
        }
        // if the element already contains a component -> remove it
        this.unloadComponent(elem);
        const html = await component.loadTemplate();

        if (html !== undefined) {
            elem.innerHTML = html;
        }

        this.child_component_map[elem.id] = component;
        component._setParent(this, elem);
        component.onInit();
        return component;
    }

    async loadTemplate() {
        // load template html
        let html = this.templateHtml;
        if (html === undefined && this.templateUrl !== undefined) {
            const response = await fetch(this.templateUrl, { method: "GET" });
            html = await response.text();
            if (this.templateIsStatic === true) {
                this.templateHtml = html;
            }
        }
        return html;
    }
}
