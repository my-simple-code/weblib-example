class Point {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
}
class MoveElement {
    constructor(elementAnchor, elementContent = undefined) {
        this.elementAnchor = elementAnchor;
        this.elementContent = elementContent ?? elementAnchor;
        this.isMouseDown = false;
        this.startMousePosition = new Point();
        this.startElementPosition = new Point();
        this.elementAnchor.style.cursor = 'move';
        this.elementAnchor.style.userSelect = 'none';
        this.bind();
    }
    
    bind() {
        this.elementAnchor.addEventListener('mousedown', evt => this.onDragStart(evt));
        this.elementAnchor.addEventListener('mouseup', evt => this.onDragEnd(evt));
        document.addEventListener('mousemove', evt => this.onDrag(evt));
    }

    unbind() {
        this.elementAnchor.removeEventListener('mousedown', evt => this.onDragStart(evt));
        this.elementAnchor.removeEventListener('mouseup', evt => this.onDragEnd(evt));
        document.removeEventListener('mousemove', evt => this.onDrag(evt));
    }
  
    onDragStart(event) {
        this.isMouseDown = true;
        this.startMousePosition = new Point(event.clientX, event.clientY);
        const rect = this.elementContent.getBoundingClientRect();
        this.startElementPosition = new Point(rect.left, rect.top);
    }
  
    onDrag(event) {
        if (this.isMouseDown) {
            const offset = new Point(event.clientX - this.startMousePosition.x, event.clientY - this.startMousePosition.y);
            this.elementContent.style.position = 'absolute';
            this.elementContent.style.transform = '';
            this.elementContent.style.left = `${this.startElementPosition.x + offset.x}px`;
            this.elementContent.style.top = `${this.startElementPosition.y + offset.y}px`;
        }
    }
  
    onDragEnd() {
        this.isMouseDown = false;
    }
}

export class Modal {
    static defautTitle = 'Alert';
    static items = [];
    styles = {
        backdrop: 'display:block;position:fixed;top:0px;left:0px;width:100%;height:100%;background-color:rgb(0,0,0,0.2);',
        modal: 'position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);min-width:500px;max-width:90vw;background-color:#ffffff;border:1px solid #888888;border-radius:5px;box-shadow: 0 0 10px #888888;',
        header: 'padding:10px;background-color:#cccccc;border-top-left-radius:5px;border-top-right-radius:5px;',
        close: 'color:#0;float:right;cursor:pointer;font-weight:bold;',
        main: 'display:flex;flex-direction:column;justify-content:center;align-items:center;height:fit-content;min-height:100px;max-height:80vh;overflow: auto;padding:15px;border-top:1px solid #888888;border-bottom: 1px solid #888888;',
        footer: 'padding:5px;',
        button: 'float:right;margin: 0px 0px 5px 10px;'
    }
    constructor() {
        this._id = `modal${new Date().getTime().toString(16)}`;
        this._title = undefined;
        this._buttons = [];
        this._component = undefined;
        this._showHeader = true;
        this._showFooter = true;
        this._dom_elements = { buttons: [] };
        this.title(Modal.defautTitle);
        Modal.items.push(this._id);
    }

    title(text, showCloseButton = false) { this._title = { text, showCloseButton }; return this; };
    button(text, action = undefined) { this._buttons.push({ text, action }); return this; }
    component(comp, showHeader = true, showFooter = true) { 
        this._component = comp;  
        this._showHeader = showHeader;
        this._showFooter = showFooter;
        return this;
    }
    get id() { return this._id; }
    get dom() { return this._dom_elements; }

    appendHeader(div_modal) {
        if (this._showHeader) {
            const div_header = document.createElement('div');
            div_header.setAttribute('style', this.styles.header);

            const caption = document.createElement('span');
            caption.innerText = this._title.text;
            div_header.appendChild(caption);

            if (this._title.showCloseButton) {
                const btn = document.createElement('span');
                btn.innerHTML = ' &times;'
                btn.setAttribute('style', this.styles.close);
                btn.addEventListener('click', () => Modal.close(this._id));
                div_header.appendChild(btn);
            }
            div_modal.appendChild(div_header);
            this._dom_elements['div_header'] = div_header;
        }
    }

    appendMain(div_modal, message) {
        const div_main = document.createElement('div');
        div_main.setAttribute('style', this.styles.main);

        if (this._component === undefined) {
            div_main.innerHTML = message;
        }
        else {
            div_main.innerHTML = this._component.templateHtml;
            this._component._setParent(undefined, div_main);
            this._component.onInit();
        }
        div_modal.appendChild(div_main);
        this._dom_elements['div_main'] = div_main;
    }

    appendFooter(div_modal) {
        if (this._showFooter) {
            const div_footer = document.createElement('div');
            div_footer.setAttribute('style', this.styles.footer);

            if (this._buttons.length === 0) {
                this.button('Ok');
            }

            this._buttons.toReversed().forEach(b => {
                if (b.action === undefined) {
                    b.action = () => Modal.close(this._id)
                };
                const button = document.createElement('button');
                button.className = 'btn btn-primary';
                button.setAttribute('style', this.styles.button);
                button.innerText = b.text;
                button.addEventListener('click', b.action);
                div_footer.appendChild(button);
                this._dom_elements.buttons.unshift(button);
            });
            div_modal.appendChild(div_footer);
            this._dom_elements['div_footer'] = div_footer;
        }
    }

    show(message = '') {
        // Background
        const div_backdrop = document.createElement('div');
        div_backdrop.setAttribute('id', `${this._id}`);
        div_backdrop.setAttribute('style', `z-index:${990 + Modal.items.length};` + this.styles.backdrop);

        // Modal-Window
        const div_modal = document.createElement('div');
        div_modal.setAttribute('style', this.styles.modal);

        // Modal-Content
        this.appendHeader(div_modal)
        this.appendMain(div_modal, message)
        this.appendFooter(div_modal)

        document.body.appendChild(div_backdrop).appendChild(div_modal);
        this._dom_elements['div_backdrop'] = div_backdrop;
        this._dom_elements['div_modal'] = div_modal;
        if (this._showHeader) {
            this.mover = new MoveElement(this._dom_elements['div_header'], div_modal);
        }
        return this;
    }

    static close(id = undefined) {
        id = (id === undefined && Modal.items.length > 0) ? Modal.items[Modal.items.length - 1] : id;
        if (id !== undefined) {
            Modal.items = Modal.items.filter(x => x !== id);
            const el = document.getElementById(id);
            if (el) {
                el.remove();
            }
        }
    }
}
