import { Calculator } from "./Calculator.mjs";
export class CalculatorScreen extends Calculator {
  constructor(inOperationText, doneOperationText) {
    super(inOperationText, doneOperationText);
  }

  updateScreen() {
    this.inOperationText.innerText = this.expression;
  }

  changeOperation(operation) {
    const mathOperations = ["+", "-", "*", "/", "%"];
    if (!mathOperations.includes(operation)) return;

    this.expression = this.expression
      .trimEnd()
      .replace(/[\+\-\*\/%]$/, "")
      .trimEnd();
    this.expression += ` ${operation} `;
    this.updateScreen();
  }

  processDelOperator() {
    this.expression = this.expression.trimEnd().slice(0, -1);
    this.updateScreen();
  }

  processAcOperator() {
    this.reset();
  }

  processEqualOperator() {
    this.calculate();
  }
}
