import keyboardHtml from "../../html/components/keyBoard.html?raw";

export function renderKeyboard(container) {
  try {
    if (container) {
      container.innerHTML = keyboardHtml;
    }
  } catch (e) {
    console.log(e);
  }
}
