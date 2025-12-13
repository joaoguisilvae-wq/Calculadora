// Seleção de elementos
const calcTable = document.querySelector("#calculate-table");
const inOperation = document.querySelector("#in-operation");
const numsTable = document.querySelector("#numbers-table");
const numsTableBtns = document.querySelectorAll("#numbers-table button");

// Funções
numsTableBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.innerHTML;

    console.log(value);
  });
});
function sum(a, b) {
  const sumBtn = document.querySelector("#sum-btn");

  sumBtn.addEventListener("click", () => {
    console.log(a + b);
  });
}

function subtraction(a, b) {
  const subtractionBtn = document.querySelector("#subtraction-btn");

  subtractionBtn.addEventListener("click", () => {
    console.log(a - b);
  });
}

function multiplicator(a, b) {
  const multiplicatortn = document.querySelector("#multiplication-btn");

  multiplicatortn.addEventListener("click", () => {
    console.log(a * b);
  });
}

function divider(a, b) {
  const dividerBtn = document.querySelector("#divider-btn");

  dividerBtn.addEventListener("click", () => {
    console.log(a / b);
  });
}

function percetage(a, b) {
  const percetageBtn = document.querySelector("#percentage-btn");

  percetageBtn.addEventListener("click", () => {
    console.log((a * b) / 100);
  });
}

function clearAllOperation() {
  const clearAllBtn = document.querySelector("#ac-btn");

  clearAllBtn.addEventListener("click", () => {
    inOperation.innerHTML = "0";
  });
}

// Eventos
sum(10, 20);
subtraction(10, 20);
multiplicator(10, 20);
divider(10, 20);
percetage(10, 20);
