export class Calculator {
  constructor(inOperationText, doneOperationText) {
    this.inOperationText = inOperationText;
    this.doneOperationText = doneOperationText;
    this.expression = "";
    this.uuid = crypto.randomUUID();
  }

  async calculate() {
    if (!this.expression) return;

    const response = await fetch("http://localhost:8080/calculation/makeCalc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression: this.expression, userId: this.uuid }),
    });

    const { result } = await response.json();
    this.doneOperationText.innerText = `${this.expression} =`;
    this.inOperationText.innerText = result;
    this.expression = String(result);
  }

  reset() {
    this.expression = "";
    this.inOperationText.innerText = "";
    this.doneOperationText.innerText = "";
  }
}
