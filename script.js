const textarea = document.createElement("textarea");
textarea.classList.add("textarea");
document.body.appendChild(textarea);
let pos = textarea.selectionStart;
let shift = 0;

let keyNum = 0, keyNumLast = 0;
let initialRec = 0;


const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: textarea.value,
        capsLock: false,
        selectionStart: pos,
        selectionEnd: pos,
        isRussian: false,
        shift: false,
        keyNum: 0
    },

    init() {
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key")
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                if (!this.properties.isHide) {
                    this.open(element.value, currentValue => {
                        element.value = currentValue;
                    });
                }
            });
        });

        this.elements.main.addEventListener('click', () => {
            this.properties.selectionEnd = textarea.selectionEnd = this.properties.selectionStart = textarea.selectionStart = pos;
            textarea.value = this.properties.value;
        })
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        let keyLayout = [];

        this.properties.isRussian ? keyLayout = keyLayout.concat(keyLayoutRu) : keyLayout = keyLayout.concat(keyLayoutEn);

        keyLayout.forEach(key => {
            const keyElement = document.createElement("div");
            let newLine = [];
            this.properties.isRussian ? newLine = newLine.concat(newLineRu) : newLine = newLine.concat(newLineEn);

            const insertLineBreak = newLine.indexOf(key) !== -1;

            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide", 'key__active', 'lower__symbol');
                    keyElement.textContent = "Back";
                    keyElement.addEventListener("click", () => {
                        textarea.value = this.properties.value;

                        this.properties.shift ? this._toggleShift() : this.properties.shift;

                        this.properties.selectionStart = textarea.selectionStart;
                        this.properties.selectionEnd = this.properties.selectionStart;

                        if (this.properties.value.length !== 0) {
                            if (this.properties.selectionStart !== 0) {
                                if (this.properties.selectionStart === this.properties.value.length) {
                                    this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                                    pos = textarea.selectionEnd = textarea.selectionStart = this.properties.selectionEnd = this.properties.selectionStart;

                                } else {
                                    let arr = this.properties.value.split('');
                                    arr.splice(this.properties.selectionStart - 1, 1);
                                    this.properties.value = arr.join('');

                                    this.properties.selectionStart--;
                                    pos = textarea.selectionEnd = textarea.selectionStart = this.properties.selectionEnd = this.properties.selectionStart;
                                }
                                this._triggerEvent("oninput");
                            }
                        }
                    });
                    this.hoverButtonEffect(8, keyElement);
                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", 'key__active', 'lower__symbol');
                    keyElement.textContent = "Caps";
                    keyElement.addEventListener("click", () => {
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });
                    window.onkeydown = () => {
                        if (keyNum === 20) {
                            this.properties.shift ? this._toggleShift() : this.properties.shift;
                            this._toggleCapsLock();
                            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                        }
                        if (keyNum === 16) {
                            this._toggleShift();
                            this._triggerEvent("oninput");
                        }
                    }
                    this.hoverButtonEffect(20, keyElement);
                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide", 'key__active', 'lower__symbol');
                    keyElement.textContent = "Enter";
                    keyElement.addEventListener("click", () => {
                        this.addLetter('\n');
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._triggerEvent("oninput");
                    });
                    this.hoverButtonEffect(13, keyElement);
                    break;

                case "language":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key-flex");

                    const enSymbol = document.createElement("div");
                    this.properties.isRussian ? enSymbol.classList.add('key__passive') : enSymbol.classList.add('key__active');
                    enSymbol.textContent = 'En';
                    keyElement.prepend(enSymbol);

                    const ruSymbol = document.createElement("div");
                    this.properties.isRussian ? ruSymbol.classList.add('key__active') : ruSymbol.classList.add('key__passive');
                    ruSymbol.textContent = 'Ru';
                    keyElement.append(ruSymbol);
                    keyElement.addEventListener("click", () => {
                        this.properties.isRussian = !this.properties.isRussian;
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._triggerEvent("oninput");
                        this.close();
                        this.init();

                        let clone = this.elements.main.previousElementSibling.cloneNode(true);
                        this.elements.main.previousElementSibling.replaceWith(clone);
                        this.elements.main.previousElementSibling.remove();
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide", 'key__active', 'lower__symbol');
                    keyElement.textContent = "|____________________|";
                    keyElement.addEventListener("click", () => {
                        this.addLetter(' ');
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._triggerEvent("oninput");
                    });
                    this.hoverButtonEffect(32, keyElement);
                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--wide", "key__passive", "shift", 'lower__symbol');
                    keyElement.textContent = 'Shift';
                    keyElement.addEventListener("click", () => {
                        this._toggleShift();
                        this._triggerEvent("oninput");
                    });
                    this.hoverButtonEffect(16, keyElement);
                    break;

                case "left":
                    keyElement.classList.add("keyboard__key--wide", 'key__active', 'lower__symbol');
                    keyElement.textContent = "<";
                    keyElement.addEventListener("click", () => {
                        textarea.value = this.properties.value;

                        this.properties.selectionStart = textarea.selectionStart;
                        this.properties.selectionEnd = textarea.selectionEnd;

                        console.log('pos left ' + pos);
                        pos = textarea.selectionStart

                        if (textarea.selectionStart !== 0) {
                            textarea.selectionStart--;
                            pos = textarea.selectionEnd = textarea.selectionStart;
                        }

                        this._triggerEvent("oninput");
                    });
                    this.hoverButtonEffect(37, keyElement);
                    break;

                case "right":
                    keyElement.classList.add("keyboard__key--wide", 'key__active', 'lower__symbol');
                    keyElement.textContent = ">";
                    keyElement.addEventListener("click", () => {
                        textarea.value = this.properties.value;

                        this.properties.selectionStart = textarea.selectionStart;
                        this.properties.selectionEnd = textarea.selectionEnd;

                        console.log('pos right ' + pos);
                        pos = textarea.selectionStart

                        if (textarea.selectionStart !== textarea.value.length) {
                            textarea.selectionStart++;
                            pos = textarea.selectionEnd = textarea.selectionStart;
                        }

                        this._triggerEvent("oninput");
                    });
                    this.hoverButtonEffect(39, keyElement);
                    break;

                default:
                    let symbols = key.split('');
                    const upperSymbols = document.createElement("div");
                    upperSymbols.classList.add('upper__symbols');

                    const upperSymbolLeft = document.createElement("div");
                    upperSymbolLeft.classList.add('upper__symbols-left', 'key__passive');
                    upperSymbolLeft.textContent = symbols[0].toLowerCase();
                    upperSymbols.append(upperSymbolLeft);

                    const upperSymbolRight = document.createElement("div");
                    upperSymbolRight.classList.add('upper__symbols-right');
                    upperSymbolRight.textContent = symbols[1].toLowerCase();
                    upperSymbols.append(upperSymbolRight);

                    keyElement.append(upperSymbols);

                    const lowerSymbol = document.createElement("div");
                    lowerSymbol.classList.add('lower__symbol', 'key__active');
                    lowerSymbol.textContent = symbols[2].toLowerCase();
                    keyElement.append(lowerSymbol);

                    keyElement.addEventListener("click", () => {
                        let letter = this.chooseLetter(keyElement, symbols);
                        this.addLetter(letter);
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._triggerEvent("oninput");
                    });
                    this.hoverButtonEffect(this.selectKeyNumber(symbols), keyElement);
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },
    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },
    keyPress(e) {
        if (window.event) {
            keyNumLast = keyNum;
            keyNum = window.event.keyCode;
        }
        else if (e) {
            keyNum = e.which;
        }
    },
    addLetter(letter) {
        textarea.value = this.properties.value;

        this.properties.selectionStart = textarea.selectionStart;
        this.properties.selectionEnd = this.properties.selectionStart;

        if (textarea.selectionStart !== textarea.value.length) {

            let arr = this.properties.value.split('');
            arr.splice(this.properties.selectionStart, 0, letter);
            this.properties.value = arr.join('');

            this.properties.selectionStart++;
            textarea.selectionEnd = textarea.selectionStart = this.properties.selectionEnd = this.properties.selectionStart = pos;

        } else {
            pos = ++this.properties.selectionStart;
            this.properties.value += letter;
        }
    },
    chooseLetter(keyElement, symbols) {
        let letter = 0;

        if (this.properties.capsLock || this.properties.shift) {
            const charCode = keyElement.lastChild.textContent.charCodeAt();
            if ((this.properties.shift && ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 1040 && charCode <= 1103))) || (this.properties.capsLock && !this.properties.shift)) {
                letter = keyElement.lastChild.lastChild.textContent;
            } else if ((this.properties.capsLock && this.properties.shift) || this.properties.shift) {
                letter = symbols[0];
            }
        } else letter = keyElement.lastChild.lastChild.textContent;

        return letter;
    },
    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        for (const key of this.elements.keys) {
            if (key.childElementCount === 2) {
                key.lastChild.textContent = this.properties.capsLock ? key.lastChild.textContent.toUpperCase() : key.lastChild.textContent.toLowerCase();
            }
        }
    },
    hoverButtonEffect(numCode, keyElement) {
        window.addEventListener("keydown", () => {
            if(numCode==20){
                if(this.properties.capsLock){
                    keyElement.classList.add('keyboard__key-hover');
                }else{
                    keyElement.classList.remove('keyboard__key-hover');
                }
            }else{
                if (keyNum === numCode) keyElement.classList.add('keyboard__key-hover');
            }
        });

        window.addEventListener("keyup", () => {
            if(numCode!=20){
                keyElement.classList.remove('keyboard__key-hover');
            }
        });
    },
    selectKeyNumber(symbols) {
        let code = 0;
        const charCode = symbols[2].toUpperCase().charCodeAt();

        if ((charCode >= 65 && charCode <= 90) || (charCode >= 48 && charCode <= 57)) code = charCode;
        else if (symbols.join('') === ',/.') code = 191;
        else code = keyCodes[symbols[2].toLowerCase()];

        return code;
    },
    _toggleShift() {
        this.properties.shift = !this.properties.shift;

        shift = document.querySelector('.shift');
        shift.classList.toggle("key__passive", !this.properties.shift);

        for (const key of this.elements.keys) {
            if (key.childElementCount === 2) {
                const charCode = key.lastChild.textContent.charCodeAt();
                if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 1040 && charCode <= 1103)) {
                    key.lastChild.textContent = key.lastChild.textContent === key.lastChild.textContent.toLowerCase() ? key.lastChild.textContent.toUpperCase() : key.lastChild.textContent.toLowerCase();
                } else {
                    key.firstChild.firstChild.classList.toggle('key__passive');
                    key.firstChild.firstChild.classList.toggle('key__active');

                    key.lastChild.classList.toggle('key__passive');
                    key.lastChild.classList.toggle('key__active');
                }

            }
        }
    },
    close() {
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    document.onkeydown = Keyboard.keyPress;
});

const keyLayoutEn = [
    '! 1', '@"2', '#№3', '$;4', '% 5', '^:6', '&?7', '* 8', '( 9', ') 0', '_ -', '+ =', "backspace",
    'й q', 'ц w', 'у e', 'к r', 'е t', 'н y', 'г u', 'ш i', 'щ o', 'з p', '{х[', '}ъ]', '| \\',
    "caps", 'ф a', 'ы s', 'в d', 'а f', 'п g', 'р h', 'о j', 'л k', 'д l', ':ж;', `"э'`, "enter",
    "shift", 'я z', 'ч x', 'с c', 'м v', 'и b', 'т n', 'ь m', '<б,', '>ю.', '?./',
    "language", "space", "left", "right",
];
const newLineEn = ["backspace", '| \\', "enter", '?./'];
const keyCodes = {'ф': 65,'и': 66,'с': 67,'в': 68,'у': 69,'а': 70,'п': 71,'р': 72,'ш': 73,'о': 74,'л': 75,
'д': 76,'ь': 77,'т': 78,'щ': 79,'з': 80,'й': 81,'к': 82,'ы': 83,'е': 84,'г': 85,'м': 86,'ц': 87,'ч': 88,
'н': 89,'ж': 186,'б': 188,'ю': 190,'х': 219,'ъ': 221,"э": 222,'я': 90,';': 186,'=': 187,',': 188,'-': 189,
'.': 190,'/': 191,'[': 219,'\\': 220,']': 221,"'": 222
}

const keyLayoutRu = [
    '! 1', '"@2', '№#3', ';$4', '% 5', ':^6', '?&7', '* 8', '( 9', ') 0', '_ -', '+ =', "backspace",
    'q й', 'w ц', 'e у', 'r к', 't е', 'y н', 'u г', 'i ш', 'o щ', 'p з', ' {х', ' }ъ', '/ \\',
    "caps", 'a ф', 's ы', 'd в', 'f а', 'g п', 'h р', 'j о', 'k л', 'l д', ' :ж', ' "э', "enter",
    "shift", 'z я', 'x ч', 'c с', 'v м', 'b и', 'n т', 'm ь', '<,б', '>.ю', ',/.',
    "language", "space", "left", "right",
];
const newLineRu = ["backspace", '/ \\', "enter", ',/.'];