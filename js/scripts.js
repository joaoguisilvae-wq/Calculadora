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
        this.saveInHistory();
        break;
      case "-":
        operationValue = previous - current;
        this.updateScreen(operationValue, operation, current, previous);
        this.saveInHistory();
        break;
      case "/":
        operationValue = previous / current;
        this.updateScreen(operationValue, operation, current, previous);
        this.saveInHistory();
        break;
      case "*":
        operationValue = previous * current;
        this.updateScreen(operationValue, operation, current, previous);
        this.saveInHistory();
        break;
      case "%":
        operationValue = (previous * current) / 100;
        this.updateScreen(operationValue, operation, current, previous);
        this.saveInHistory();
        break;
      case "DEL":
        this.processDelOperator();
        break;
      case "AC":
        this.processAcOperator();
        break;
      case "=":
        this.processEqualOperator();
        this.updateScreen(operationValue, operation);
        this.saveInHistory();
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
const calc = new Calculator(previousOperationText, inOperationText);
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
