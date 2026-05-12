import { CalculatorScreen } from "./CalculatorScreen.mjs";
export class CalculatorClicks extends CalculatorScreen {
  constructor(inOperationText, doneOperationText) {
    super(inOperationText, doneOperationText);
  }
  addDigit(digit) {
    if (
      digit === "." &&
      this.expression
        .split(/[\+\-\*\/]/)
        .pop()
        .includes(".")
    )
      return;
    this.expression += digit;
    this.updateScreen();
  }

  processOperations(op) {
    if (op === "AC") {
      this.reset();
      return;
    } else if (["+", "-", "*", "/", "%"].includes(op)) {
      if (!this.expression) return;
      this.expression += ` ${op} `;
      this.updateScreen();
      return;
    } else if (op === "DEL") {
      this.expression = this.expression.trimEnd().slice(0, -1);
      this.updateScreen();
      return;
    } else if (op === "=" && this.expression !== 0) {
      this.processEqualOperator();
    }
  }
}
