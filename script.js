const keyLayoutRu = [
    '! 1', '"@2', '№#3', ';$4', '% 5', ':^6', '?&7', '* 8', '( 9', ') 0', '_ -', '+ =', "backspace",
    'q й', 'w ц', 'e у', 'r к', 't е', 'y н', 'u г', 'i ш', 'o щ', 'p з', ' {х', ' }ъ','/ \\',
    "caps", 'a ф', 's ы', 'd в', 'f а', 'g п', 'h р', 'j о', 'k л', 'l д', ' :ж', ' "э', "enter",
    "shift", 'z я', 'x ч', 'c с', 'v м', 'b и', 'n т', 'm ь', '<,б', '>.ю', ',/.',
    "hide", "mic", "volume", "language","space", "left", "right",
];
const keyLayoutEn = [
    '! 1', '@"2', '#№3', '$;4', '% 5', '^:6', '&?7', '* 8', '( 9', ') 0', '_ -', '+ =', "backspace",
    'й q', 'ц w', 'у e', 'к r', 'е t', 'н y', 'г u', 'ш i', 'щ o', 'з p', '{х[', '}ъ]','| \\',
    "caps", 'ф a', 'ы s', 'в d', 'а f', 'п g', 'р h', 'о j', 'л k', 'д l', ':ж;', `"э'`, "enter",
    "shift", 'я z', 'ч x', 'с c', 'м v', 'и b', 'т n', 'ь m', '<б,', '>ю.', '?./',
    "hide", "mic", "volume", "language", "space", "left", "right",
];
let currentLanguage = "ru";

const inputArea = document.createElement("textarea");
inputArea.className = "input-area";
document.body.appendChild(inputArea);


function generateKeyboard(lang) {
    // Create the keyboard container
    const keyboard = document.createElement("div");
    keyboard.classList.add("keyboard");
    // Create the keys
    lang.forEach(key => {
        const keyElement = document.createElement("button");
        keyElement.classList.add("key");
        keyElement.textContent = key;
        keyboard.appendChild(keyElement);
        // Add event listeners for the mouse and keyboard
        keyElement.addEventListener("mousedown", () => {
          keyElement.classList.add("active");
          typeKey(key);
        });
        keyElement.addEventListener("mouseup", () => {
          keyElement.classList.remove("active");
        });
        keyElement.addEventListener("mouseleave", () => {
          keyElement.classList.remove("active");
        });
      });
    document.body.appendChild(keyboard);
  }
  window.addEventListener("load", () => {
    generateKeyboard(keyLayoutRu);
    // Add event listener for switching the language
    const langButton = document.createElement("button");
    langButton.textContent = "EN";
    langButton.classList.add("lang-button");
    langButton.addEventListener("click", () => {
      switchLanguage();
      langButton.textContent = currentLanguage.toUpperCase();
    });
    document.body.appendChild(langButton);
    // Add event listener for typing on the physical keyboard
    document.addEventListener("keydown", event => {
      const key = event.key;
      const keyElement = document.querySelector(`.key:contains(${key})`);
      if (keyElement) {
        keyElement.classList.add("active");
      }
      if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        typeKey(key);
      }
    });
    document.addEventListener("keyup", event => {
      const key = event.key;
      const keyElement = document.querySelector(`.key:contains(${key})`);
      if (keyElement) {
        keyElement.classList.remove("active");
      }
    });
  });

function switchLanguage() {
  if (currentLanguage === "en") {
    currentLanguage = "ru";
    updateKeyboard(keyLayoutRu);
  } else {
    currentLanguage = "en";
    updateKeyboard(keyLayoutEn);
  }
}

function updateKeyboard(keys) {
  const keyboard = document.querySelector(".keyboard");
  document.body.removeChild(keyboard);
  generateKeyboard(keys);
}

