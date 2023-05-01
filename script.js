
const textarea = document.createElement("textarea");
let pos = textarea.selectionStart;
let shift = 0;

let keyNum = 0, keyNumLast = 0;
let rec = null;
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
                if(!this.properties.isHide) {
                    this.open(element.value, currentValue => {
                        element.value = currentValue;
                    });
                }
            });
        });

        this.elements.main.addEventListener('click', () => {
            this.properties.selectionEnd = textarea.selectionEnd = this.properties.selectionStart = textarea.selectionStart = pos;
            this.properties.value = textarea.value;
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

            // Add attributes/classes
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");

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

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--wide", "key__passive", "shift");
                    keyElement.textContent = 'Shift';

                    break;

                case "left":
                    keyElement.classList.add("keyboard__key--wide");

                    break;

                case "right":
                    keyElement.classList.add("keyboard__key--wide");

                    break;

                default:
                    // Create key upper element
                    let symbols = key.split('');
                    const upperSymbols = document.createElement("div");
                    upperSymbols.classList.add('upper__symbols');

                    // Create Upper symbol left
                    const upperSymbolLeft = document.createElement("div");
                    upperSymbolLeft.classList.add('upper__symbols-left', 'key__passive');
                    upperSymbolLeft.textContent = symbols[0].toLowerCase();
                    upperSymbols.append(upperSymbolLeft);

                    // Create Upper symbol right
                    const upperSymbolRight = document.createElement("div");
                    upperSymbolRight.classList.add('upper__symbols-right');
                    upperSymbolRight.textContent = symbols[1].toLowerCase();
                    upperSymbols.append(upperSymbolRight);

                    keyElement.append(upperSymbols);

                    // Create key lower element
                    const lowerSymbol = document.createElement("div");
                    lowerSymbol.classList.add('lower__symbol' , 'key__active');
                    lowerSymbol.textContent = symbols[2].toLowerCase();
                    keyElement.append(lowerSymbol);

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    document.onkeydown = Keyboard.keyPress;
});

// English keyboard
const keyLayoutEn = [
    '! 1', '@"2', '#№3', '$;4', '% 5', '^:6', '&?7', '* 8', '( 9', ') 0', '_ -', '+ =', "backspace",
    'й q', 'ц w', 'у e', 'к r', 'е t', 'н y', 'г u', 'ш i', 'щ o', 'з p', '{х[', '}ъ]','| \\',
    "caps", 'ф a', 'ы s', 'в d', 'а f', 'п g', 'р h', 'о j', 'л k', 'д l', ':ж;', `"э'`, "enter",
    "shift", 'я z', 'ч x', 'с c', 'м v', 'и b', 'т n', 'ь m', '<б,', '>ю.', '?./',
    "language", "space", "left", "right",
];
const newLineEn = ["backspace", '| \\', "enter", '?./'];

const keyLayoutRu = [
    '! 1', '"@2', '№#3', ';$4', '% 5', ':^6', '?&7', '* 8', '( 9', ') 0', '_ -', '+ =', "backspace",
    'q й', 'w ц', 'e у', 'r к', 't е', 'y н', 'u г', 'i ш', 'o щ', 'p з', ' {х', ' }ъ','/ \\',
    "caps", 'a ф', 's ы', 'd в', 'f а', 'g п', 'h р', 'j о', 'k л', 'l д', ' :ж', ' "э', "enter",
    "shift", 'z я', 'x ч', 'c с', 'v м', 'b и', 'n т', 'm ь', '<,б', '>.ю', ',/.',
    "language","space", "left", "right",
];
const newLineRu = ["backspace", '/ \\', "enter", ',/.'];