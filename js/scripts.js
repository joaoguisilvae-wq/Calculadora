// Objetos
class Calculator {
  constructor(previousOperationText, inOperationText) {
    this.previousOperationText = previousOperationText;
    this.inOperationText = inOperationText;
    this.inOperation = "";
  }

  // Colorcar número na tela da calculadora
  addDigit(digit) {
    // Checar se ja esxiste virgula na operação
    if (digit === "." && this.inOperationText.innerText.includes(".")) {
      return;
    }

    this.inOperation = digit;
    this.updateScreen();
  }

  // Processar operações
  processOperations(operation) {
    // Checar se o current esta vazio ou é AC
    if (this.inOperationText.innerText === "" && operation !== "AC") {
      if (this.previousOperationText.innerText !== "") {
        // Mudar operação
        this.changeOperation(operation);
      }
      return;
    }

    // Pegar valor atual e anterior
    let operationValue;
    const previous = +this.previousOperationText.innerText.split(" ")[0];
    const current = +this.inOperationText.innerText;

    switch (operation) {
      case "+":
        operationValue = previous + current;
        this.updateScreen(operationValue, operation, current, previous);
        break;
      case "-":
        operationValue = previous - current;
        this.updateScreen(operationValue, operation, current, previous);
        break;
      case "/":
        operationValue = previous / current;
        this.updateScreen(operationValue, operation, current, previous);
        break;
      case "*":
        operationValue = previous * current;
        this.updateScreen(operationValue, operation, current, previous);
        break;
      case "%":
        operationValue = (previous * current) / 100;
        this.updateScreen(operationValue, operation, current, previous);
        break;
      case "DEL":
        this.processDelOperator();
        break;
      case "AC":
        this.processAcOperator();
        break;
      case "=":
        this.processEqualOperator();
        break;
      default:
        return;
    }
  }

  // Atulaizar tela da calculadora
  updateScreen(
    operationValue = null,
    operation = null,
    current = null,
    previous = null
  ) {
    console.log(operationValue, operation, current, previous);

    if (operationValue === null) {
      this.inOperationText.innerText += this.inOperation;
    } else {
      // Se previous = 0, adicionar current
      if (previous === 0) {
        operationValue = current;
      }

      // Colorcar o valor de current para previous
      this.previousOperationText.innerText = `${operationValue} ${operation}`;
      this.inOperationText.innerText = "";
    }
  }

  // Mudar operação
  changeOperation(operation) {
    const mathOperations = ["*", "/", "+", "-"];

    if (!mathOperations.includes(operation)) {
      return;
    }

    this.previousOperationText.innerText =
      this.previousOperationText.innerText.slice(0, -1) + operation;
  }

  // Deletando operação atual
  processDelOperator() {
    this.inOperationText.innerText = "";
  }

  // Deletando operações atuais
  processAcOperator() {
    this.previousOperationText.innerText = "";
    this.inOperationText.innerText = "";
  }

  // Processar a operação
  processEqualOperator() {
    const operation = previousOperationText.innerText.split(" ")[1];

    this.processOperations(operation);
  }
}

// Seleção de elementos
const previousOperationText = document.querySelector("#previous-operation");
const calcTable = document.querySelector("#calculate-table");
const inOperationText = document.querySelector("#in-operation");
const numsTable = document.querySelector("#numbers-table");
const numsTableBtns = document.querySelectorAll("#numbers-table button");

// Eventos
const calc = new Calculator(previousOperationText, inOperationText);

numsTableBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.innerText;

    if (+value >= 0 || value === ".") {
      calc.addDigit(value);
    } else {
      calc.processOperations(value);
    }
  });
});
