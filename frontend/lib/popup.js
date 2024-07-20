export class Popup {
    static defautTitle = 'Alert';
    static items = [];
    styles = {
        modal: 'display:block;position:fixed;top:0px;left:0px;width:100%;height:100%;background-color:rgb(0,0,0,0.2);',
        popup: 'position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);min-width:500px;max-width:90vw;background-color:#ffffff;border:1px solid #888888;border-radius:5px;box-shadow: 0 0 10px #888888;',
        header: 'padding:10px;background-color:#cccccc;border-top-left-radius:5px;border-top-right-radius:5px;',
        close: 'color:#0;float:right;cursor:pointer;font-weight:bold;',
        main: 'display:flex;flex-direction:column;justify-content:center;align-items:center;height:fit-content;min-height:100px;max-height:80vh;overflow: auto;padding:15px;border-top:1px solid #888888;border-bottom: 1px solid #888888;',
        footer: 'padding:5px;',
        button: 'float:right;margin: 0px 0px 5px 10px;'
    }
    constructor() {
        this._id = `popup${new Date().getTime().toString(16)}`;
        this._title = undefined;
        this._buttons = [];
        this._component = undefined;
        this._showHeader = true;
        this._showFooter = true;
        this._dom_elements = { buttons: [] };
        this.title(Popup.defautTitle);
        Popup.items.push(this._id);
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

    appendHeader(div_popup) {
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
                btn.addEventListener('click', () => Popup.close(this._id));
                div_header.appendChild(btn);
            }
            div_popup.appendChild(div_header);
            this._dom_elements['div_header'] = div_header;
        }
    }

    appendMain(div_popup, message) {
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
        div_popup.appendChild(div_main);
        this._dom_elements['div_main'] = div_main;
    }

    appendFooter(div_popup) {
        if (this._showFooter) {
            const div_footer = document.createElement('div');
            div_footer.setAttribute('style', this.styles.footer);

            if (this._buttons.length === 0) {
                this.button('Ok');
            }

            this._buttons.toReversed().forEach(b => {
                if (b.action === undefined) {
                    b.action = () => Popup.close(this._id)
                };
                const button = document.createElement('button');
                button.className = 'btn btn-primary';
                button.setAttribute('style', this.styles.button);
                button.innerText = b.text;
                button.addEventListener('click', b.action);
                div_footer.appendChild(button);
                this._dom_elements.buttons.unshift(button);
            });
            div_popup.appendChild(div_footer);
            this._dom_elements['div_footer'] = div_footer;
        }
    }

    show(message = '') {
        // Background
        const div_modal = document.createElement('div');
        div_modal.setAttribute('id', `${this._id}`);
        div_modal.setAttribute('style', `z-index:${990 + Popup.items.length};` + this.styles.modal);

        // Popup-Window
        const div_popup = document.createElement('div');
        div_popup.setAttribute('style', this.styles.popup);

        // Popup-Content
        this.appendHeader(div_popup)
        this.appendMain(div_popup, message)
        this.appendFooter(div_popup)

        document.body.appendChild(div_modal).appendChild(div_popup);
        this._dom_elements['div_modal'] = div_modal;
        this._dom_elements['div_popup'] = div_popup;
        return this;
    }

    static close(id = undefined) {
        id = (id === undefined && Popup.items.length > 0) ? Popup.items[Popup.items.length - 1] : id;
        if (id !== undefined) {
            Popup.items = Popup.items.filter(x => x !== id);
            const el = document.getElementById(id);
            if (el) {
                el.remove();
            }
        }
    }
}
