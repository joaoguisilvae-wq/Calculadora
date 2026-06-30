import "./style.css";
//HTML
import calculatorHtml from "./html/pages/calculator.html?raw";
import conversorsHtml from "./html/pages/conversors.html?raw";
//JS
import { CalculatorClicks } from "./js/Calculator/CalculatorClicks.mjs";
import { renderKeyboard } from "./js/Screen/keyBoards.js";
import createConversors from "./js/Conversors/CreateConversorsHtml.js";

import changeScreen from "./js/Screen/PageChange.js";

import { setColor } from "./js/Screen/ColorChange.js";

//Renderizando paginas
changeScreen(calculatorHtml, true);
renderKeyboard(document.getElementById("calculator-keyboard"));

document.addEventListener("click", (e) => {
  const btn = e.target.closest("#calc-option, #conv-options, #more-options");
  if (!btn) return;

  if (btn.id === "calc-option") {
    changeScreen(calculatorHtml, true);
    renderKeyboard(document.getElementById("calculator-keyboard"));
  }
  if (btn.id === "conv-options") {
    changeScreen(conversorsHtml, true);
    createConversors();
  }
  if (btn.id === "more-options") {
    const moreOptionsContainer = document.querySelector(
      "#more-options-container",
    );
    moreOptionsContainer.classList.toggle("hide");
  }
});

// Mudança de cores
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#light, #dark, #right, #left");
  if (!btn) return;

  setColor(btn.id);
});

// const conversorTable = document.querySelector("#conversor-table");

// var conversorsInstances = {};

// const calc = new CalculatorClicks(
//   document.querySelector("#in-operation"),
//   document.querySelector("#done-operation"),
// );

// Objetos

// class Conversors {
//   constructor(containerId, config) {
//     this.container = document.querySelector(containerId);
//     this.rates = config.rates || {};
//     this.labels = config.labels || {};
//     this.activeIndex = 0;

//     this.updateConversorScreen();
//   }

//   updateConversorScreen() {
//     const results = this.container.querySelectorAll(".result");
//     const selects = this.container.querySelectorAll(
//       "#options-container select",
//     );

//     selects.forEach((select) => {
//       select.innerHTML = "";
//       Object.keys(this.rates).forEach((unit) => {
//         const opt = document.createElement("option");
//         opt.value = unit;
//         opt.textContent = this.getUnitLabel(unit);
//         select.appendChild(opt);
//       });
//       select.value = Object.keys(this.rates)[0];
//     });

//     if (results[0]) {
//       results[0].classList.add("click");
//       results[0].textContent = "1";
//     }

//     results.forEach((result, i) => {
//       result.addEventListener("click", () => {
//         results.forEach((r) => r.classList.remove("click"));

//         result.classList.add("click");
//         result.textContent = "1";

//         this.activeIndex = i;
//         this.handleConversion();
//       });
//     });

//     selects.forEach((select) => {
//       select.addEventListener("change", () => this.handleConversion());
//     });
//   }

//   getUnitLabel(unit) {
//     return this.labels[unit] || unit;
//   }

//   convert(value, from, to) {
//     if (from === to) return parseFloat(value);

//     const fromRate = this.rates[from];
//     const toRate = this.rates[to];

//     const valueInBase = parseFloat(value) / fromRate;

//     return valueInBase * toRate;
//   }

//   handleConversion() {
//     const selects = this.container.querySelectorAll(
//       "#options-container select",
//     );
//     const results = this.container.querySelectorAll(".result");

//     const activeResult = results[this.activeIndex];

//     const fromValue = parseFloat(activeResult?.textContent) || 1;
//     const fromUnit = selects[this.activeIndex]?.value;

//     if (!fromUnit) return;

//     results.forEach((result, i) => {
//       if (i === this.activeIndex) return;

//       const toUnit = selects[i]?.value;

//       if (!toUnit) return;

//       const converted = this.convert(fromValue, fromUnit, toUnit);
//       result.textContent = isNaN(converted)
//         ? "0"
//         : this.formatNumber(converted);
//     });
//   }

//   formatNumber(num) {
//     if (isNaN(num)) return "1";
//     return num
//       .toFixed(8)
//       .replace(/\.?0+$/, "")
//       .replace(/\.$/, "");
//   }

//   updateActiveValue(digit) {
//     const results = this.container.querySelectorAll(".result");
//     const activeResult = Array.from(results).find((result) =>
//       result.classList.contains("click"),
//     );

//     if (!activeResult) return;

//     let currentValue = activeResult.textContent.trim();

//     if (digit === "DEL") {
//       currentValue = currentValue.slice(0, -1);
//       if (currentValue === "" || currentValue === "0") currentValue = "1";
//     } else if (digit === "AC") {
//       currentValue = "1";
//     } else if (digit === ".") {
//       if (currentValue.includes(".")) return;
//       if (currentValue === "1") currentValue = "1.";
//       else currentValue += ".";
//     } else if (!isNaN(digit)) {
//       if (currentValue === "1") {
//         currentValue = digit;
//       } else {
//         currentValue += digit;
//       }
//     } else {
//       return;
//     }

//     activeResult.textContent = currentValue;
//     this.handleConversion();
//   }
// }

// class ConversorCoin {
//   constructor(
//     conversorTable,
//     conversorTablebtns,
//     conversorResultBtn,
//     coinApiKey,
//   ) {
//     this.conversorTable = conversorTable;
//     this.conversorTablebtns = conversorTablebtns;
//     this.activeResult = null;
//     this.rates = {};
//     this.fetchRates();
//   }

//   async fetchRates() {
//     try {
//       const response = await fetch(
//         "https://v6.exchangerate-api.com/v6/80256d7727156d2472f5065b/latest/USD",
//       );

//       const data = await response.json();

//       if (!data.conversion_rates) {
//         throw new Error("Resposta da API inválida");
//       }

//       this.rates = data.conversion_rates;
//       this.rates["USD"] = 1.0;
//       this.handleCoinConversor();
//     } catch (err) {
//       console.error("Erro ao carregar cotações:", err);
//     }
//   }

//   convertCoin(value, from, to) {
//     if (from === to) return parseFloat(value);

//     const fromRate = this.rates[from];
//     const toRate = this.rates[to];

//     if (from === "USD") {
//       return parseFloat(value) * toRate;
//     } else if (to === "USD") {
//       return parseFloat(value) / fromRate;
//     } else {
//       const valueInUSD = parseFloat(value) / fromRate;
//       return valueInUSD * toRate;
//     }
//   }

//   handleCoinConversor() {
//     const selects = document.querySelectorAll(
//       "#conversor-coin #options-container select",
//     );
//     const results = document.querySelectorAll("#conversor-coin .result");

//     if (selects.length !== 3 || results.length !== 3) return;

//     let activeIndex = -1;

//     for (let i = 0; i < results.length; i++) {
//       if (results[i].classList.contains("click")) {
//         activeIndex = i;
//         break;
//       }
//     }

//     if (activeIndex === -1) activeIndex = 0;

//     const fromCurrency = selects[activeIndex].value;
//     const fromValue = parseFloat(results[activeIndex].innerText) || 1.0;

//     for (let i = 0; i < 3; i++) {
//       if (i === activeIndex) continue;

//       const toCurrency = selects[i].value;
//       const converted = this.convertCoin(fromValue, fromCurrency, toCurrency);
//       if (!isNaN(converted)) {
//         results[i].innerText = converted.toFixed(4);
//       }
//     }
//   }

//   updateConversorCoinScreen() {
//     const results = document.querySelectorAll("#conversor-coin .result");
//     const selects = document.querySelectorAll(
//       "#conversor-coin #options-container select",
//     );

//     results.forEach((result) => {
//       result.addEventListener("click", () => {
//         results.forEach((result) => result.classList.remove("click"));

//         result.classList.add("click");
//         this.activeResult = result;
//         this.handleCoinConversor();
//       });
//     });

//     selects.forEach((select) => {
//       select.addEventListener("change", () => {
//         this.handleCoinConversor();
//       });
//     });

//     results.forEach((result) => {
//       result.addEventListener("click", () => {
//         result.innerText = "1";
//         this.handleCoinConversor();
//       });
//     });
//   }

//   async getCoins() {
//     const selects = document.querySelectorAll(
//       "#conversor-coin #options-container select",
//     );

//     selects.forEach((select) => (select.innerHTML = ""));

//     try {
//       const response = await fetch(
//         "https://v6.exchangerate-api.com/v6/80256d7727156d2472f5065b/latest/USD",
//       );

//       const data = await response.json();

//       if (!data.conversion_rates) {
//         throw new Error("Resposta da API inválida");
//       }

//       for (let i = 0; i < selects.length; i++) {
//         const select = selects[i];

//         const brlOption = document.createElement("option");
//         brlOption.value = "BRL";
//         brlOption.textContent = "Real Brasileiro";
//         select.appendChild(brlOption);

//         for (const code of Object.keys(data.conversion_rates)) {
//           const option = document.createElement("option");
//           option.value = code;
//           option.textContent = currencyNames[code] || code;
//           select.appendChild(option);
//         }
//       }

//       const firstResult = document.querySelector("#conversor-coin .result");
//       if (firstResult) {
//         firstResult.classList.add("click");
//         firstResult.innerText = "1";
//         this.activeResult = firstResult;
//         this.handleCoinConversor();
//       }
//     } catch (err) {
//       console.error("Erro ao carregar moedas:", err);
//     }
//   }
// }

// class DateCalculator {
//   constructor() {
//     this.init();
//   }

//   init() {
//     this.fromInput = document.querySelector("#from");
//     this.toInput = document.querySelector("#to");
//     this.calcBtn = document.querySelector("#calculate");

//     this.yearsSpan = document.querySelector(".date:nth-child(1) span");
//     this.monthsSpan = document.querySelector(".date:nth-child(2) span");
//     this.daysSpan = document.querySelector(".date:nth-child(3) span");

//     if (this.calcBtn) {
//       this.calcBtn.addEventListener("click", (e) => {
//         e.preventDefault();
//         this.calculateDifference();
//       });
//     }
//   }

//   calculateDifference() {
//     const fromValue = this.fromInput.value;
//     const toValue = this.toInput.value;

//     if (!fromValue || !toValue) {
//       alert("Selecione ambas as datas.");
//       return;
//     }

//     const fromDate = new Date(fromValue);
//     const toDate = new Date(toValue);

//     if (fromDate > toDate) {
//       alert("A data 'De' não pode ser maior que a data 'Até'.");
//       return;
//     }

//     let years = toDate.getFullYear() - fromDate.getFullYear();
//     let months = toDate.getMonth() - fromDate.getMonth();
//     let days = toDate.getDate() - fromDate.getDate();

//     if (days < 0) {
//       months--;
//       const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
//       days += prevMonth.getDate();
//     }

//     if (months < 0) {
//       years--;
//       months += 12;
//     }

//     this.yearsSpan.textContent = years;
//     this.monthsSpan.textContent = months;
//     this.daysSpan.textContent = days;
//   }
// }

// class Discount {
//   constructor() {
//     this.container = document.querySelector("#conversor-discount");
//     if (!this.container) return;

//     const originalEl = this.container.querySelector("#original-price .result");
//     const discountEl = this.container.querySelector("#discount .result");
//     const finalEl = this.container.querySelector("#final-price .result");
//     const elements = [originalEl, discountEl, finalEl];

//     elements.forEach((element) => {
//       element.addEventListener("click", () => {
//         [originalEl, discountEl, finalEl].forEach((element) =>
//           element.classList.remove("click"),
//         );

//         element.classList.add("click");
//         this.performCalc();
//       });
//     });

//     if (originalEl) {
//       originalEl.classList.add("click");
//     }
//   }

//   updateActiveValue(digit) {
//     const activeEl = this.container.querySelector(".result.click");
//     if (!activeEl) return;

//     let currentValue = activeEl.textContent.trim();

//     if (digit === "DEL") {
//       currentValue = currentValue.slice(0, -1) || "1";
//     } else if (digit === "AC") {
//       currentValue = "1";
//     } else if (digit === ".") {
//       if (!currentValue.includes(".")) {
//         currentValue += ".";
//       }
//     } else if (!isNaN(digit)) {
//       if (currentValue === "1") {
//         currentValue = digit;
//       } else {
//         currentValue += digit;
//       }
//     } else {
//       return;
//     }

//     activeEl.textContent = currentValue;
//     this.performCalc();
//   }

//   performCalc() {
//     const originalEl = this.container.querySelector("#original-price .result");
//     const discountEl = this.container.querySelector("#discount .result");
//     const finalEl = this.container.querySelector("#final-price .result");
//     const economyOf = document.querySelector("#conversor-discount p span");

//     const original = parseFloat(originalEl.textContent) || 0;
//     const discount = parseFloat(discountEl.textContent) || 0;
//     const final = parseFloat(finalEl.textContent) || 0;

//     const activeEl = this.container.querySelector(".result.click");

//     if (activeEl === originalEl || activeEl === discountEl) {
//       const newFinal = original - (discount / 100) * original;
//       finalEl.textContent = this.formatNumber(newFinal);
//       economyOf.textContent = original - newFinal;
//     } else if (activeEl === finalEl) {
//       if (original > 0) {
//         const newDiscount = ((original - final) / original) * 100;
//         discountEl.textContent = this.formatNumber(newDiscount);
//         economyOf.textContent = original - final;
//       }
//     }
//   }

//   formatNumber(num) {
//     if (isNaN(num)) return "1";
//     return num
//       .toFixed(8)
//       .replace(/\.?0+$/, "")
//       .replace(/\.$/, "");
//   }
// }

// class NumberSistem {
//   constructor() {
//     this.container = document.querySelector("#number-sistem");
//     this.results = this.container.querySelectorAll(".result");
//     this.selects = this.container.querySelectorAll("select");

//     this.activeIndex = 0;
//     this.results[0]?.classList.add("click");

//     this.bindEvents();
//     this.handleConversion();
//   }

//   bindEvents() {
//     this.results.forEach((result, i) => {
//       result.addEventListener("click", () => {
//         this.results.forEach((r) => r.classList.remove("click"));
//         result.classList.add("click");
//         this.activeIndex = i;
//         this.handleConversion();
//       });
//     });

//     this.selects.forEach((select) => {
//       select.addEventListener("change", () => {
//         const hexDigits = this.container.querySelectorAll(".hex-digit");
//         const numbers = this.container.querySelectorAll(".number");

//         const elementsToModify = [...hexDigits, ...numbers];

//         elementsToModify.forEach((element) => {
//           if (element && element.classList) {
//             element.classList.add("less-opacity");
//             this.changeTableVisibility();
//           }
//         });

//         this.handleConversion();
//       });
//     });
//   }

//   toDecimal(value, fromBase) {
//     try {
//       if (fromBase === "dec") return parseInt(value, 10);
//       if (fromBase === "bin") return parseInt(value, 2);
//       if (fromBase === "oct") return parseInt(value, 8);
//       if (fromBase === "hex") return parseInt(value, 16);
//     } catch (e) {}
//     return NaN;
//   }

//   fromDecimal(value, toBase) {
//     if (isNaN(value)) return "0";
//     if (toBase === "dec") return value.toString();
//     if (toBase === "bin") return value.toString(2);
//     if (toBase === "oct") return value.toString(8);
//     if (toBase === "hex") return value.toString(16).toUpperCase();
//     return "0";
//   }

//   isValidForBase(value, base) {
//     if (value === "") return false;
//     const regexMap = {
//       bin: /^[01]+$/,
//       oct: /^[0-7]+$/,
//       dec: /^\d+$/,
//       hex: /^[0-9A-Fa-f]+$/,
//     };
//     return regexMap[base]?.test(value) ?? false;
//   }

//   handleConversion() {
//     const activeResult = this.results[this.activeIndex];
//     const fromBase = this.selects[this.activeIndex]?.value;
//     let inputValue = activeResult?.textContent.trim() || "0";

//     if (inputValue.length > 1) {
//       inputValue = inputValue.replace(/^0+(?=\d)/, "");
//     }
//     if (inputValue === "") inputValue = "0";

//     if (!this.isValidForBase(inputValue, fromBase)) {
//       this.results.forEach((r, i) => {
//         if (i !== this.activeIndex) r.textContent = "0";
//       });
//       return;
//     }

//     // Converte para decimal
//     const decimalValue = this.toDecimal(inputValue, fromBase);
//     if (isNaN(decimalValue)) {
//       this.results.forEach((r, i) => {
//         if (i !== this.activeIndex) r.textContent = "0";
//       });
//       return;
//     }

//     this.results.forEach((result, i) => {
//       if (i === this.activeIndex) return;
//       const toBase = this.selects[i]?.value;
//       result.textContent = this.fromDecimal(decimalValue, toBase);
//     });
//   }

//   updateActiveValue(digit) {
//     const activeResult = this.results[this.activeIndex];
//     if (!activeResult) return;

//     let currentValue = activeResult.textContent.trim();
//     const currentBase = this.selects[this.activeIndex]?.value;

//     const validDigits = {
//       bin: "01",
//       oct: "01234567",
//       dec: "0123456789",
//       hex: "0123456789ABCDEF",
//     };

//     const allowed = validDigits[currentBase] || "0123456789";

//     if (digit === "DEL") {
//       currentValue = currentValue.slice(0, -1) || "1";
//     } else if (digit === "AC") {
//       currentValue = "1";
//     } else if (digit === ".") {
//       return;
//     } else if (digit === "00") {
//       currentValue += digit;
//     } else if (allowed.includes(digit.toUpperCase())) {
//       if (currentValue === "1") {
//         currentValue = digit;
//       } else {
//         currentValue += digit;
//       }
//     } else {
//       return;
//     }

//     activeResult.textContent = currentValue;
//     this.handleConversion();
//   }

//   changeTableVisibility() {
//     const activeResult = this.results[this.activeIndex];

//     if (!activeResult) {
//       console.warn("Nenhum resultado ativo encontrado.");
//       return null;
//     }

//     const index = this.activeIndex;

//     const correspondingSelect = this.selects[index];

//     if (!correspondingSelect) {
//       console.warn(`Nenhum select encontrado para o índice ${index}.`);
//       return null;
//     }

//     const selectedValue = correspondingSelect.value;

//     switch (selectedValue) {
//       case "bin":
//         const validNumbersBin = [
//           // Nome de variável diferente
//           this.container.querySelector(".one"),
//           this.container.querySelector(".zero"),
//           this.container.querySelector(".double-zero"),
//         ];
//         validNumbersBin.forEach((num) => {
//           if (num) {
//             num.classList.remove("less-opacity");
//           }
//         });
//         break;

//       case "oct":
//         const validNumbersOct = this.container.querySelectorAll(".number");
//         validNumbersOct.forEach((button) => {
//           if (button && button.classList) {
//             button.classList.remove("less-opacity");
//           }
//         });

//         const eight = this.container.querySelector(".eight");
//         const nine = this.container.querySelector(".nine");

//         const invalidNumbers = [eight, nine];

//         invalidNumbers.forEach((num) => {
//           if (num && num.classList) {
//             num.classList.add("less-opacity");
//           }
//         });
//         break;

//       case "dec":
//         const validNumbersDec = this.container.querySelectorAll(".number");
//         validNumbersDec.forEach((num) => {
//           if (num) {
//             num.classList.remove("less-opacity");
//           }
//         });
//         break;

//       case "hex":
//         const validNumbersHex = [
//           this.container.querySelectorAll(".number"),
//           this.container.querySelectorAll(".hex-digit"),
//         ];

//         validNumbersHex.forEach((classes) => {
//           if (classes) {
//             classes.forEach((num) => {
//               num.classList.remove("less-opacity");
//             });
//           }
//         });
//         break;

//       default:
//         const elementsToModify = [
//           ...this.container.querySelectorAll(".operation"),
//           ...this.container.querySelectorAll(".hex-digit"),
//           ...this.container.querySelectorAll(".number"),
//         ];
//         elementsToModify.forEach((el) => {
//           if (el && el.classList) {
//             el.classList.add("less-opacity");
//           }
//         });
//         break;
//     }
//   }
// }

// class Temperature {
//   constructor(temperatureTable) {
//     this.temperatureTable = temperatureTable;
//     this.activeIndex = 0;

//     this.units = ["c", "f", "k", "r", "re"];
//     this.labels = {
//       c: "Celsius",
//       f: "Fahrenheit",
//       k: "Kelvin",
//       r: "Rankine",
//       re: "Réaumur",
//     };

//     this.updateConversorTempScreen();
//   }

//   updateConversorTempScreen() {
//     const results = document.querySelectorAll("#conversor-temperature .result");
//     const selects = document.querySelectorAll(
//       "#conversor-temperature #options-container select",
//     );

//     selects.forEach((select) => {
//       select.innerHTML = "";
//       this.units.forEach((unit) => {
//         const opt = document.createElement("option");
//         opt.value = unit;
//         opt.textContent = this.labels[unit];
//         select.appendChild(opt);
//       });
//       select.value = "c";
//     });

//     if (results[0]) {
//       results[0].classList.add("click");
//       results[0].textContent = "1";
//     }

//     results.forEach((result, i) => {
//       result.addEventListener("click", () => {
//         results.forEach((r) => r.classList.remove("click"));
//         result.classList.add("click");
//         result.textContent = "1";
//         this.activeIndex = i;
//         this.performConversion();
//       });
//     });

//     selects.forEach((select) => {
//       select.addEventListener("change", () => {
//         this.performConversion();
//       });
//     });
//   }

//   convertTemperature(value, fromUnit, toUnit) {
//     if (fromUnit === toUnit) return parseFloat(value);

//     let celsius;
//     switch (fromUnit) {
//       case "c":
//         celsius = value;
//         break;
//       case "f":
//         celsius = ((value - 32) * 5) / 9;
//         break;
//       case "k":
//         celsius = value - 273.15;
//         break;
//       case "r":
//         celsius = ((value - 491.67) * 5) / 9;
//         break;
//       case "re":
//         celsius = (value * 5) / 4;
//         break;
//       default:
//         return NaN;
//     }

//     switch (toUnit) {
//       case "c":
//         return celsius;
//       case "f":
//         return (celsius * 9) / 5 + 32;
//       case "k":
//         return celsius + 273.15;
//       case "r":
//         return ((celsius + 273.15) * 9) / 5;
//       case "re":
//         return (celsius * 4) / 5;
//       default:
//         return NaN;
//     }
//   }

//   performConversion() {
//     const selects = document.querySelectorAll(
//       "#conversor-temperature #options-container select",
//     );
//     const results = document.querySelectorAll("#conversor-temperature .result");

//     if (selects.length < 2 || results.length < 2) return;

//     const activeResult = results[this.activeIndex];
//     const fromValue = parseFloat(activeResult?.textContent) || 1;
//     const fromUnit = selects[this.activeIndex]?.value;

//     if (isNaN(fromValue) || !fromUnit) return;

//     results.forEach((result, i) => {
//       if (i === this.activeIndex) return;

//       const toUnit = selects[i]?.value;
//       if (!toUnit) return;

//       const converted = this.convertTemperature(fromValue, fromUnit, toUnit);
//       if (!isNaN(converted)) {
//         result.textContent = this.formatNumber(converted);
//       }
//     });
//   }

//   updateActiveValue(digit) {
//     const results = document.querySelectorAll("#conversor-temperature .result");
//     const activeResult = Array.from(results).find((r) =>
//       r.classList.contains("click"),
//     );

//     if (!activeResult) return;

//     let currentValue = activeResult.textContent.trim();

//     if (digit === "DEL") {
//       currentValue = currentValue.slice(0, -1);
//       if (currentValue === "" || currentValue === "0") currentValue = "1";
//     } else if (digit === "AC") {
//       currentValue = "1";
//     } else if (digit === ".") {
//       if (currentValue.includes(".")) return;
//       if (currentValue === "1") currentValue = "1.";
//       else currentValue += ".";
//     } else if (!isNaN(digit)) {
//       if (currentValue === "1") {
//         currentValue = digit;
//       } else {
//         currentValue += digit;
//       }
//     } else {
//       return;
//     }

//     activeResult.textContent = currentValue;
//     this.performConversion();
//   }
// }

// class IMC {
//   constructor(imcTable, imcResultTable, imcTableAuxiliar) {
//     this.imcTable = imcTable;
//     this.imcResultTable = imcResultTable;
//     this.imcTableAuxiliar = imcTableAuxiliar;

//     this.heightInput = this.imcTable.querySelector("#height");
//     this.weightInput = this.imcTable.querySelector("#weight");

//     this.imcResultValue = this.imcResultTable.querySelector("#imc-result span");
//     this.heightResult = this.imcResultTable.querySelector("#height-result");

//     this.minWeightSuggestionResult =
//       this.imcResultTable.querySelector("#min-weight");

//     this.maxWeightSuggestionResult =
//       this.imcResultTable.querySelector("#max-weight");

//     this.label = this.imcResultTable.querySelector("#label");
//     this.bar = this.imcResultTable.querySelector("#bar");

//     this.height = null;
//     this.weight = null;

//     this.bindEvents();
//   }

//   bindEvents() {
//     this.heightInput.addEventListener("input", (e) => {
//       this.height = parseFloat(e.target.value) || null;
//     });

//     this.weightInput.addEventListener("input", (e) => {
//       this.weight = parseFloat(e.target.value) || null;
//     });

//     const calculateBtn = this.imcTable.querySelector("#calculate");
//     calculateBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       this.calculateAndShow();
//     });

//     const returnButtons = this.imcResultTable.querySelectorAll(".return");
//     returnButtons.forEach((btn) => {
//       btn.addEventListener("click", () => {
//         this.imcTableAuxiliar.classList.remove("hide");
//         this.imcResultTable.classList.add("hide");
//       });
//     });
//   }

//   calculateAndShow() {
//     if (
//       this.height === null ||
//       this.weight === null ||
//       this.height <= 0 ||
//       this.weight <= 0 ||
//       this.height > 300 ||
//       this.weight > 500
//     ) {
//       alert("Por favor, insira valores válidos para altura e peso.");
//       return;
//     }

//     const heightInMeters = this.height / 100;
//     const imc = this.weight / (heightInMeters * heightInMeters);

//     if (imc > 50) {
//       alert("Ou se ta morrendo ou mentiu");
//       return;
//     }

//     this.imcResultValue.textContent = imc.toFixed(1);

//     this.heightResult.textContent = this.height;

//     const minIdealWeight = (19 * heightInMeters * heightInMeters).toFixed(1);
//     this.minWeightSuggestionResult.textContent = minIdealWeight;

//     const maxIdealWeight = (23 * heightInMeters * heightInMeters).toFixed(1);
//     this.maxWeightSuggestionResult.textContent = maxIdealWeight;

//     this.updateLabelOnBar(imc);

//     this.imcTableAuxiliar.classList.add("hide");
//     this.imcResultTable.classList.remove("hide");
//   }

//   updateLabelOnBar(imc) {
//     const minIMC = 18.5;
//     const maxIMC = 28.0;

//     let clampedIMC = Math.min(Math.max(imc, minIMC), maxIMC);

//     // Posição percentual na barra
//     const percent = ((clampedIMC - minIMC) / (maxIMC - minIMC)) * 100;

//     // Atualiza posição do balão
//     this.label.style.left = `${percent}%`;

//     // Atualiza texto conforme faixa
//     let category = "Normal";
//     if (imc >= 24.0 && imc < 28.0) {
//       category = "Sobrepeso";
//     } else if (imc >= 28.0) {
//       category = "Obesidade";
//     } else if (imc < 18.5) {
//       category = "Magreza";
//     }

//     this.label.textContent = category;
//   }
// }

// const doneOperationText = document.querySelector("#done-operation");
// const previousOperationText = document.querySelector("#previous-operation");
// const calcTable = document.querySelector("#calculate-table");
// const inOperationText = document.querySelector("#in-operation");
// const numsTable = document.querySelector(".numbers-table");
// const numsTableBtns = document.querySelectorAll(".numbers-table button");

// const headerContainerBtns = document.querySelectorAll(
//   "#header-container button",
// );
// const moreOptionsContainer = document.querySelector("#more-options-container");
// const history = document.querySelector("#history");
// const toggleThemeBtn = document.querySelector("#toggle-theme-btn");

// const conversorTablebtns = document.querySelectorAll("#conversor-table button");
// const conversors = document.querySelectorAll(".conversor");
// const returnBTn = document.querySelectorAll(".return");
// const results = document.querySelectorAll(".conversor .result");

// const temperatureTable = document.querySelector("#conversor-temperature");

// const imcTable = document.querySelector("#imc-calculator");
// const imcResultTable = document.querySelector("#imc-result-table");
// const imcTableAuxiliar = document.querySelector("#auxiliar");

// const conversorDiscount = document.querySelector("#conversor-discount");

// toggleThemeBtn.addEventListener("click", () => {
//   document.body.classList.toggle("light");
// });

// numsTableBtns.forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     const value = e.target.innerText.trim();

//     const visibleConversor = [...conversors].find(
//       (section) =>
//         !section.classList.contains("hide") && section.id !== "conversor-coin",
//     );

//     if (visibleConversor) {
//       const type = visibleConversor.id;
//       const instance = conversorsInstances[type];
//       if (instance && typeof instance.updateActiveValue === "function") {
//         instance.updateActiveValue(value);
//         return;
//       }
//     }

//     const isOnCoinConversor =
//       document.querySelector("#conversor-coin")?.classList.contains("hide") ===
//       false;

//     if (isOnCoinConversor && convCoinsOperations.activeResult) {
//       if (+value >= 0 || value === ".") {
//         let currentText = convCoinsOperations.activeResult.innerText;
//         if (value === ".") {
//           if (currentText.includes(".")) return;
//           if (currentText === "" || currentText === "1") currentText = "0";
//         }
//         if (currentText === "1" && !isNaN(value) && value !== ".") {
//           currentText = value;
//         } else {
//           currentText += value;
//         }
//         convCoinsOperations.activeResult.innerText = currentText;
//         setTimeout(() => convCoinsOperations.handleCoinConversor(), 0);
//       } else if (value === "DEL") {
//         let currentText = convCoinsOperations.activeResult.innerText;
//         currentText = currentText.slice(0, -1) || "1";
//         convCoinsOperations.activeResult.innerText = currentText;
//         setTimeout(() => convCoinsOperations.handleCoinConversor(), 0);
//       } else if (value === "AC") {
//         convCoinsOperations.activeResult.innerText = "1";
//         setTimeout(() => convCoinsOperations.handleCoinConversor(), 0);
//       }
//       return;
//     }

//     if (+value >= 0 || value === ".") {
//       calc.addDigit(value);
//     } else {
//       calc.processOperations(value);
//     }
//   });
// });

// headerContainerBtns.forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     header.changeScreen(btn);
//   });
// });

// conversorTablebtns.forEach((button) => {
//   button.addEventListener("click", () => {
//     const targetId = button.dataset.target;
//     conversors.forEach((section) => section.classList.add("hide"));
//     const targetSection = document.querySelector(`#${targetId}`);
//     if (targetSection) {
//       targetSection.classList.remove("hide");
//       conversorTable.classList.add("hide");
//     } else {
//       console.error(`Seção não encontrada: ${targetId}`);
//     }
//   });
// });

// returnBTn.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     conversors.forEach((section) => section.classList.add("hide"));
//     conversorTable.classList.remove("hide");
//   });
// });

// results.forEach((result) => {
//   result.addEventListener("click", (e) => {
//     const clicked = e.target;
//     clicked.textContent = 1;
//   });
// });
