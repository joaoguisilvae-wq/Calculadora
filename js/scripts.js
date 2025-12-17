// Objetos
class Calculator {
  constructor(previousOperationText, inOperationText, doneOperationText) {
    this.previousOperationText = previousOperationText;
    this.inOperationText = inOperationText;
    this.doneOperationText = doneOperationText;
    this.inOperation = "";
    this.currentValue = "";
    this.previousValue = "";
    this.operation = null;
  }

  // Colorcar número na tela da calculadora
  addDigit(digit) {
    if (digit === "." && this.currentValue.includes(".")) return;
    this.currentValue += digit;
    this.inOperationText.innerText = this.currentValue;
  }

  // Processar operações
  processOperations(op) {
    if (op === "AC") {
      this.currentValue = "";
      this.previousValue = 0;
      this.operation = null;
      this.inOperationText.innerText = "";
      this.previousOperationText.innerText = "";
      return;
    }

    if (["+", "-", "*", "/", "%"].includes(op)) {
      if (this.operation !== null) {
        this.operation = op;
        this.previousOperationText.innerText = `${this.previousValue} ${op}`;
        return;
      }
      this.previousValue = parseFloat(this.currentValue) || 0;
      this.currentValue = "";
      this.operation = op;
      this.previousOperationText.innerText = `${this.previousValue} ${op}`;
      this.inOperationText.innerText = "";
      return;
    }

    if (op === "=") {
      this.calculate();
      return;
    }

    if (op === "DEL") {
      this.currentValue = this.currentValue.slice(0, -1);
      this.inOperationText.innerText = this.currentValue || "";
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
    if (operationValue === null) {
      this.inOperationText.innerText += this.inOperation;
    } else {
      // Se previous = 0, adicionar current
      if (previous === 0) {
        operationValue = current;
      }

      // Colorcar o valor de current para previous
      this.previousOperationText.innerText += ` ${operation}`;
      this.inOperationText.innerText = "";

      if (operation && current !== null && previous !== null) {
        this.saveOperationInLocal(previous, current, operation);
      }
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
    const operationText = this.previousOperationText.innerText;
    if (!operationText) return;

    const parts = operationText.split(" ");

    if (parts.length < 2) return;

    const operation = parts[1];

    this.processOperations(operation);
  }

  saveOperationInLocal(previous, current, symbol) {
    const operations = JSON.parse(localStorage.getItem("operation") || "[]");

    const newOperation = {
      previousOp: previous,
      currentOp: current,
      symbolOp: symbol,
    };
    operations.push(newOperation);

    const operationInLocalStorage = localStorage.setItem(
      "operation",
      JSON.stringify(operations)
    );
  }

  saveInHistory() {
    if (!history) return;

    const operations = JSON.parse(localStorage.getItem("operation") || "[]");

    history.innerHTML = "";

    if (!Array.isArray(operations) || operations.length === 0) {
      history.innerHTML = "<h2>Nenhuma operação salva.</h2>";
      return;
    }

    [...operations].reverse().forEach((op) => {
      if (
        typeof op.previousOp !== "number" ||
        typeof op.currentOp !== "number" ||
        !op.symbolOp
      )
        return;

      const div = document.createElement("div");
      div.classList.add("history-operation");

      let operationResult;
      switch (op.symbolOp) {
        case "+":
          operationResult = op.previousOp + op.currentOp;
          break;
        case "-":
          operationResult = op.previousOp - op.currentOp;
          break;
        case "*":
          operationResult = op.previousOp * op.currentOp;
          break;
        case "/":
          operationResult = op.previousOp / op.currentOp;
          break;
        case "%":
          operationResult = (op.previousOp * op.currentOp) / 100;
          break;
        default:
          return;
      }

      history.appendChild(div);

      const h3 = document.createElement("h3");
      h3.textContent = `${op.previousOp} ${op.symbolOp} ${op.currentOp}`;
      div.appendChild(h3);

      const h2 = document.createElement("h2");
      h2.textContent = `${operationResult}`;
      div.appendChild(h2);
    });
  }

  calculate() {
    let result = 0;
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        if (current === 0) {
          this.inOperationText.innerText = "Erro";
          this.reset();
          return;
        }
        result = prev / current;
        break;
      case "%":
        result = (prev * current) / 100;
        break;
      default:
        return;
    }

    // Atualiza a tela com o resultado
    this.inOperationText.innerText = result;
    this.previousOperationText.innerText = "";
    this.doneOperationText.innerText = `${prev} ${this.operation} ${current}`;
    // Salva a operação no localStorage
    this.saveOperationInLocal(prev, current, this.operation);
    this.saveInHistory(prev, current, this.operation);

    // Atualiza o estado interno
    this.currentValue = result.toString();
    this.previousValue = 0;
    this.operation = null;
  }
}

class Header {
  constructor(headerContainerBtns) {
    this.headerContainerBtns = headerContainerBtns;
  }

  changeScreen(btn) {
    this.headerContainerBtns.forEach((btn) => {
      btn.classList.remove("focus");
    });

    btn.classList.add("focus");

    const buttonText = btn.innerText.trim();

    switch (buttonText) {
      case "Calculadora":
        calculator.classList.remove("hide");
        calculator.classList.remove("less-opacity");
        history.classList.add("hide");
        conversorTable.classList.add("hide");
        moreOptionsContainer.classList.add("hide");
        break;
      case "Conversor":
        conversorTable.classList.remove("hide");
        conversorTable.classList.remove("less-opacity");
        calculator.classList.add("hide");
        history.classList.add("hide");
        moreOptionsContainer.classList.add("hide");
        break;
      case "Histórico":
        history.classList.remove("hide");
        history.classList.remove("less-opacity");
        conversorTable.classList.add("hide");
        calculator.classList.add("hide");
        moreOptionsContainer.classList.add("hide");
        break;
      default:
        moreOptionsContainer.classList.toggle("hide");
        history.classList.toggle("less-opacity");
        calculator.classList.toggle("less-opacity");
        conversorTable.classList.toggle("less-opacity");
        return;
    }
  }
}
// Seleção de elementos
const doneOperationText = document.querySelector("#done-operation");
const previousOperationText = document.querySelector("#previous-operation");
const calcTable = document.querySelector("#calculate-table");
const inOperationText = document.querySelector("#in-operation");
const numsTable = document.querySelector("#numbers-table");
const numsTableBtns = document.querySelectorAll("#numbers-table button");

const headerContainerBtns = document.querySelectorAll(
  "#header-container button"
);
const calculator = document.querySelector("#calculator");
const conversorTable = document.querySelector("#conversor-table");
const moreOptionsContainer = document.querySelector("#more-options-container");
const history = document.querySelector("#history");
const toggleThemeBtn = document.querySelector("#toggle-theme-btn");

// Eventos
const calc = new Calculator(
  previousOperationText,
  inOperationText,
  doneOperationText
);
const header = new Header(headerContainerBtns);

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

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
calc.saveInHistory();

headerContainerBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    header.changeScreen(btn);
  });
});
