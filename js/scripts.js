var conversorsInstances = {};

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

  addDigit(digit) {
    if (digit === "." && this.currentValue.includes(".")) return;
    this.currentValue += digit;
    this.inOperationText.innerText = this.currentValue;
  }

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

  updateScreen(
    operationValue = null,
    operation = null,
    current = null,
    previous = null,
  ) {
    if (operationValue === null) {
      this.inOperationText.innerText += this.inOperation;
    } else {
      if (previous === 0) {
        operationValue = current;
      }

      this.previousOperationText.innerText += ` ${operation}`;
      this.inOperationText.innerText = "";

      if (operation && current !== null && previous !== null) {
        this.saveOperationInLocal(previous, current, operation);
      }
    }
  }

  changeOperation(operation) {
    const mathOperations = ["*", "/", "+", "-"];
    if (!mathOperations.includes(operation)) return;
    this.previousOperationText.innerText =
      this.previousOperationText.innerText.slice(0, -1) + operation;
  }

  processDelOperator() {
    this.inOperationText.innerText = "";
  }

  processAcOperator() {
    this.previousOperationText.innerText = "";
    this.inOperationText.innerText = "";
  }

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
    localStorage.setItem("operation", JSON.stringify(operations));
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

    this.inOperationText.innerText = result;
    this.previousOperationText.innerText = "";
    this.doneOperationText.innerText = `${prev} ${this.operation} ${current}`;

    this.saveOperationInLocal(prev, current, this.operation);
    this.saveInHistory();
    this.currentValue = result.toString();
    this.previousValue = 0;
    this.operation = null;
  }

  reset() {
    this.currentValue = "";
    this.previousValue = 0;
    this.operation = null;
    this.inOperationText.innerText = "";
    this.previousOperationText.innerText = "";
    this.doneOperationText.innerText = "";
  }
}
class Header {
  constructor(headerContainerBtns) {
    this.headerContainerBtns = headerContainerBtns;
  }

  changeScreen(btn) {
    const isOnConversorDetail = [...conversors].some(
      (section) => !section.classList.contains("hide"),
    );

    const isMoreOptionsBtn = btn.dataset.action === "more-options";
    if (isOnConversorDetail && !isMoreOptionsBtn) return;
    this.headerContainerBtns.forEach((b) => b.classList.remove("focus"));
    btn.classList.add("focus");

    const screen = btn.dataset.screen;

    switch (screen) {
      case "calculator":
        calculator.classList.remove("hide", "less-opacity");
        history.classList.add("hide");
        conversorTable.classList.add("hide");
        conversors.forEach((section) => section.classList.add("hide"));
        moreOptionsContainer.classList.add("hide");
        break;

      case "conversor":
        conversorTable.classList.remove("hide", "less-opacity");
        calculator.classList.add("hide");
        history.classList.add("hide");
        conversors.forEach((section) => section.classList.add("hide"));
        moreOptionsContainer.classList.add("hide");
        break;

      case "history":
        history.classList.remove("hide", "less-opacity");
        calculator.classList.add("hide");
        conversorTable.classList.add("hide");
        conversors.forEach((section) => section.classList.add("hide"));
        moreOptionsContainer.classList.add("hide");
        break;

      case "swipe-screen":
        alert("Isso deixaria sua tela no modo janela");
        break;
      default:
        moreOptionsContainer.classList.toggle("hide");
        history.classList.toggle("less-opacity");
        calculator.classList.toggle("less-opacity");
        conversors.forEach((section) =>
          section.classList.toggle("less-opacity"),
        );
        conversorTable.classList.toggle("less-opacity");
        returnBTn.forEach((retBtn) => {
          retBtn.classList.toggle("hide");
        });
        return;
    }
  }
}

class Conversors {
  constructor(containerId, config) {
    this.container = document.querySelector(containerId);
    this.rates = config.rates || {};
    this.labels = config.labels || {};
    this.activeIndex = 0;

    this.updateConversorScreen();
  }

  updateConversorScreen() {
    const results = this.container.querySelectorAll(".result");
    const selects = this.container.querySelectorAll(
      "#options-container select",
    );

    selects.forEach((select) => {
      select.innerHTML = "";
      Object.keys(this.rates).forEach((unit) => {
        const opt = document.createElement("option");
        opt.value = unit;
        opt.textContent = this.getUnitLabel(unit);
        select.appendChild(opt);
      });
      select.value = Object.keys(this.rates)[0];
    });

    if (results[0]) {
      results[0].classList.add("click");
      results[0].textContent = "1";
    }

    results.forEach((result, i) => {
      result.addEventListener("click", () => {
        results.forEach((r) => r.classList.remove("click"));

        result.classList.add("click");
        result.textContent = "1";

        this.activeIndex = i;
        this.handleConversion();
      });
    });

    selects.forEach((select) => {
      select.addEventListener("change", () => this.handleConversion());
    });
  }

  getUnitLabel(unit) {
    return this.labels[unit] || unit;
  }

  convert(value, from, to) {
    if (from === to) return parseFloat(value);

    const fromRate = this.rates[from];
    const toRate = this.rates[to];

    const valueInBase = parseFloat(value) / fromRate;

    return valueInBase * toRate;
  }

  handleConversion() {
    const selects = this.container.querySelectorAll(
      "#options-container select",
    );
    const results = this.container.querySelectorAll(".result");

    const activeResult = results[this.activeIndex];

    const fromValue = parseFloat(activeResult?.textContent) || 1;
    const fromUnit = selects[this.activeIndex]?.value;

    if (!fromUnit) return;

    results.forEach((result, i) => {
      if (i === this.activeIndex) return;

      const toUnit = selects[i]?.value;

      if (!toUnit) return;

      const converted = this.convert(fromValue, fromUnit, toUnit);
      result.textContent = isNaN(converted)
        ? "0"
        : this.formatNumber(converted);
    });
  }

  formatNumber(num) {
    if (isNaN(num)) return "1";
    return num
      .toFixed(8)
      .replace(/\.?0+$/, "")
      .replace(/\.$/, "");
  }

  updateActiveValue(digit) {
    const results = this.container.querySelectorAll(".result");
    const activeResult = Array.from(results).find((result) =>
      result.classList.contains("click"),
    );

    if (!activeResult) return;

    let currentValue = activeResult.textContent.trim();

    if (digit === "DEL") {
      currentValue = currentValue.slice(0, -1);
      if (currentValue === "" || currentValue === "0") currentValue = "1";
    } else if (digit === "AC") {
      currentValue = "1";
    } else if (digit === ".") {
      if (currentValue.includes(".")) return;
      if (currentValue === "1") currentValue = "1.";
      else currentValue += ".";
    } else if (!isNaN(digit)) {
      if (currentValue === "1") {
        currentValue = digit;
      } else {
        currentValue += digit;
      }
    } else {
      return;
    }

    activeResult.textContent = currentValue;
    this.handleConversion();
  }
}

class ConversorCoin {
  constructor(
    conversorTable,
    conversorTablebtns,
    conversorResultBtn,
    coinApiKey,
  ) {
    this.conversorTable = conversorTable;
    this.conversorTablebtns = conversorTablebtns;
    this.activeResult = null;
    this.rates = {};
    this.fetchRates();
  }

  async fetchRates() {
    try {
      const response = await fetch(
        "https://v6.exchangerate-api.com/v6/80256d7727156d2472f5065b/latest/USD",
      );

      const data = await response.json();

      if (!data.conversion_rates) {
        throw new Error("Resposta da API inválida");
      }

      this.rates = data.conversion_rates;
      this.rates["USD"] = 1.0;
      this.handleCoinConversor();
    } catch (err) {
      console.error("Erro ao carregar cotações:", err);
    }
  }

  convertCoin(value, from, to) {
    if (from === to) return parseFloat(value);

    const fromRate = this.rates[from];
    const toRate = this.rates[to];

    if (from === "USD") {
      return parseFloat(value) * toRate;
    } else if (to === "USD") {
      return parseFloat(value) / fromRate;
    } else {
      const valueInUSD = parseFloat(value) / fromRate;
      return valueInUSD * toRate;
    }
  }

  handleCoinConversor() {
    const selects = document.querySelectorAll(
      "#conversor-coin #options-container select",
    );
    const results = document.querySelectorAll("#conversor-coin .result");

    if (selects.length !== 3 || results.length !== 3) return;

    let activeIndex = -1;

    for (let i = 0; i < results.length; i++) {
      if (results[i].classList.contains("click")) {
        activeIndex = i;
        break;
      }
    }

    if (activeIndex === -1) activeIndex = 0;

    const fromCurrency = selects[activeIndex].value;
    const fromValue = parseFloat(results[activeIndex].innerText) || 1.0;

    for (let i = 0; i < 3; i++) {
      if (i === activeIndex) continue;

      const toCurrency = selects[i].value;
      const converted = this.convertCoin(fromValue, fromCurrency, toCurrency);
      if (!isNaN(converted)) {
        results[i].innerText = converted.toFixed(4);
      }
    }
  }

  updateConversorCoinScreen() {
    const results = document.querySelectorAll("#conversor-coin .result");
    const selects = document.querySelectorAll(
      "#conversor-coin #options-container select",
    );

    results.forEach((result) => {
      result.addEventListener("click", () => {
        results.forEach((result) => result.classList.remove("click"));

        result.classList.add("click");
        this.activeResult = result;
        this.handleCoinConversor();
      });
    });

    selects.forEach((select) => {
      select.addEventListener("change", () => {
        this.handleCoinConversor();
      });
    });

    results.forEach((result) => {
      result.addEventListener("click", () => {
        result.innerText = "1";
        this.handleCoinConversor();
      });
    });
  }

  async getCoins() {
    const selects = document.querySelectorAll(
      "#conversor-coin #options-container select",
    );

    selects.forEach((select) => (select.innerHTML = ""));

    try {
      const response = await fetch(
        "https://v6.exchangerate-api.com/v6/80256d7727156d2472f5065b/latest/USD",
      );

      const data = await response.json();

      if (!data.conversion_rates) {
        throw new Error("Resposta da API inválida");
      }

      const currencyNames = {
        USD: "Dólar americano",
        AED: "Dirham dos Emirados Árabes Unidos",
        AFN: "Afegane afegão",
        ALL: "Lek albanês",
        AMD: "Dram armênio",
        ANG: "Florim das Antilhas Neerlandesas",
        AOA: "Kwanza angolano",
        ARS: "Peso argentino",
        AUD: "Dólar australiano",
        AWG: "Florim arubano",
        AZN: "Manat azeri",
        BAM: "Marco conversível da Bósnia e Herzegovina",
        BBD: "Dólar barbadense",
        BDT: "Taka bengali",
        BGN: "Lev búlgaro",
        BHD: "Dinar bareinita",
        BIF: "Franco burundiano",
        BMD: "Dólar das Bermudas",
        BND: "Dólar bruneano",
        BOB: "Boliviano",
        BRL: "Real brasileiro",
        BSD: "Dólar bahamense",
        BTN: "Ngultrum butanês",
        BWP: "Pula botsuanês",
        BYN: "Rublo bielorrusso",
        BZD: "Dólar belizenho",
        CAD: "Dólar canadense",
        CDF: "Franco congolês",
        CHF: "Franco suíço",
        CLF: "Unidade de Fomento chilena",
        CLP: "Peso chileno",
        CNH: "Yuan chinês (offshore)",
        CNY: "Yuan chinês (onshore)",
        COP: "Peso colombiano",
        CRC: "Colón costarriquenho",
        CUP: "Peso cubano",
        CVE: "Escudo cabo-verdiano",
        CZK: "Coroa tcheca",
        DJF: "Franco djiboutiano",
        DKK: "Coroa dinamarquesa",
        DOP: "Peso dominicano",
        DZD: "Dinar argelino",
        EGP: "Libra egípcia",
        ERN: "Nakfa eritreia",
        ETB: "Birr etíope",
        EUR: "Euro",
        FJD: "Dólar fijiano",
        FKP: "Libra das Ilhas Falkland",
        FOK: "Coroa feroesa",
        GBP: "Libra esterlina",
        GEL: "Lari georgiano",
        GGP: "Libra de Guernsey",
        GHS: "Cedi ganês",
        GIP: "Libra gibraltina",
        GMD: "Dalasi gambiano",
        GNF: "Franco guineano",
        GTQ: "Quetzal guatemalteco",
        GYD: "Dólar guianense",
        HKD: "Dólar de Hong Kong",
        HNL: "Lempira hondurenha",
        HRK: "Kuna croata",
        HTG: "Gourde haitiano",
        HUF: "Florim húngaro",
        IDR: "Rupia indonésia",
        ILS: "Novo shekel israelense",
        IMP: "Libra de Man",
        INR: "Rupia indiana",
        IQD: "Dinar iraquiano",
        IRR: "Rial iraniano",
        ISK: "Coroa islandesa",
        JEP: "Libra de Jersey",
        JMD: "Dólar jamaicano",
        JOD: "Dinar jordaniano",
        JPY: "Iene japonês",
        KES: "Xelim queniano",
        KGS: "Som quirguiz",
        KHR: "Riel cambojano",
        KID: "Dólar da Ilha Christmas",
        KMF: "Franco comoriano",
        KRW: "Won sul-coreano",
        KWD: "Dinar kuwaitiano",
        KYD: "Dólar das Ilhas Cayman",
        KZT: "Tenge cazaque",
        LAK: "Kip laosiano",
        LBP: "Libra libanesa",
        LKR: "Rupia do Sri Lanka",
        LRD: "Dólar liberiano",
        LSL: "Loti lesotiano",
        LYD: "Dinar líbio",
        MAD: "Dirham marroquino",
        MDL: "Leu moldavo",
        MGA: "Ariary malgaxe",
        MKD: "Denar macedônio",
        MMK: "Kyat birmanês",
        MNT: "Tugrik mongol",
        MOP: "Pataca de Macau",
        MRU: "Ouguiya mauritana",
        MUR: "Rupia mauriciana",
        MVR: "Rupia maldiva",
        MWK: "Kwacha malauiana",
        MXN: "Peso mexicano",
        MYR: "Ringgit malaio",
        MZN: "Metical moçambicano",
        NAD: "Dólar namibiano",
        NGN: "Naira nigeriana",
        NIO: "Córdoba nicaraguense",
        NOK: "Coroa norueguesa",
        NPR: "Rupia nepalesa",
        NZD: "Dólar neozelandês",
        OMR: "Rial omani",
        PAB: "Balboa panamenha",
        PEN: "Sol peruano",
        PGK: "Kina papuásia-nova-guineense",
        PHP: "Peso filipino",
        PKR: "Rupia paquistanesa",
        PLN: "Złoty polonês",
        PYG: "Guarani paraguaio",
        QAR: "Rial catariano",
        RON: "Leu romeno",
        RSD: "Dinar sérvio",
        RUB: "Rublo russo",
        RWF: "Franco ruandês",
        SAR: "Riyal saudita",
        SBD: "Dólar das Ilhas Salomão",
        SCR: "Rupia seichelense",
        SDG: "Libra sudanesa",
        SEK: "Coroa sueca",
        SGD: "Dólar singapuriano",
        SHP: "Libra de Santa Helena",
        SLE: "Leone do Serra Leoa",
        SLL: "Leone antigo do Serra Leoa",
        SOS: "Xelim somali",
        SRD: "Dólar surinamês",
        SSP: "Libra sul-sudanesa",
        STN: "Dobra de São Tomé e Príncipe",
        SYP: "Libra síria",
        SZL: "Lilangeni suazi",
        THB: "Baht tailandês",
        TJS: "Somoni tadjique",
        TMT: "Manat turcomeno",
        TND: "Dinar tunisiano",
        TOP: "Paʻanga tonganesa",
        TRY: "Lira turca",
        TTD: "Dólar de Trinidad e Tobago",
        TVD: "Dólar de Tuvalu",
        TWD: "Novo dólar taiwanês",
        TZS: "Xelim tanzaniano",
        UAH: "Hryvnia ucraniana",
        UGX: "Xelim ugandense",
        UYU: "Peso uruguaio",
        UZS: "Som uzbeque",
        VES: "Bolívar venezuelano",
        VND: "Dong vietnamita",
        VUV: "Vatu vanuatuense",
        WST: "Tala samoano",
        XAF: "Franco CFA BEAC",
        XCD: "Dólar do Caribe Oriental",
        XCG: "Florim das Antilhas Neerlandesas",
        XDR: "Direitos Especiais de Saque (FMI)",
        XOF: "Franco CFA BCEAO",
        XPF: "Franco CFP",
        YER: "Rial iemenita",
        ZAR: "Rand sul-africano",
        ZMW: "Kwacha zambiano",
        ZWG: "Dólar zimbabuano (gold)",
        ZWL: "Dólar zimbabuano (2009)",
      };

      for (let i = 0; i < selects.length; i++) {
        const select = selects[i];

        const brlOption = document.createElement("option");
        brlOption.value = "BRL";
        brlOption.textContent = "Real Brasileiro";
        select.appendChild(brlOption);

        for (const code of Object.keys(data.conversion_rates)) {
          const option = document.createElement("option");
          option.value = code;
          option.textContent = currencyNames[code] || code;
          select.appendChild(option);
        }
      }

      const firstResult = document.querySelector("#conversor-coin .result");
      if (firstResult) {
        firstResult.classList.add("click");
        firstResult.innerText = "1";
        this.activeResult = firstResult;
        this.handleCoinConversor();
      }
    } catch (err) {
      console.error("Erro ao carregar moedas:", err);
    }
  }
}

class DateCalculator {
  constructor() {
    this.init();
  }

  init() {
    this.fromInput = document.querySelector("#from");
    this.toInput = document.querySelector("#to");
    this.calcBtn = document.querySelector("#calculate");

    this.yearsSpan = document.querySelector(".date:nth-child(1) span");
    this.monthsSpan = document.querySelector(".date:nth-child(2) span");
    this.daysSpan = document.querySelector(".date:nth-child(3) span");

    if (this.calcBtn) {
      this.calcBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.calculateDifference();
      });
    }
  }

  calculateDifference() {
    const fromValue = this.fromInput.value;
    const toValue = this.toInput.value;

    if (!fromValue || !toValue) {
      alert("Selecione ambas as datas.");
      return;
    }

    const fromDate = new Date(fromValue);
    const toDate = new Date(toValue);

    if (fromDate > toDate) {
      alert("A data 'De' não pode ser maior que a data 'Até'.");
      return;
    }

    let years = toDate.getFullYear() - fromDate.getFullYear();
    let months = toDate.getMonth() - fromDate.getMonth();
    let days = toDate.getDate() - fromDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    this.yearsSpan.textContent = years;
    this.monthsSpan.textContent = months;
    this.daysSpan.textContent = days;
  }
}

class Discount {
  constructor() {
    this.container = document.querySelector("#conversor-discount");
    if (!this.container) return;

    const originalEl = this.container.querySelector("#original-price .result");
    const discountEl = this.container.querySelector("#discount .result");
    const finalEl = this.container.querySelector("#final-price .result");
    const elements = [originalEl, discountEl, finalEl];

    elements.forEach((element) => {
      element.addEventListener("click", () => {
        [originalEl, discountEl, finalEl].forEach((element) =>
          element.classList.remove("click"),
        );

        element.classList.add("click");
        this.performCalc();
      });
    });

    if (originalEl) {
      originalEl.classList.add("click");
    }
  }

  updateActiveValue(digit) {
    const activeEl = this.container.querySelector(".result.click");
    if (!activeEl) return;

    let currentValue = activeEl.textContent.trim();

    if (digit === "DEL") {
      currentValue = currentValue.slice(0, -1) || "1";
    } else if (digit === "AC") {
      currentValue = "1";
    } else if (digit === ".") {
      if (!currentValue.includes(".")) {
        currentValue += ".";
      }
    } else if (!isNaN(digit)) {
      if (currentValue === "1") {
        currentValue = digit;
      } else {
        currentValue += digit;
      }
    } else {
      return;
    }

    activeEl.textContent = currentValue;
    this.performCalc();
  }

  performCalc() {
    const originalEl = this.container.querySelector("#original-price .result");
    const discountEl = this.container.querySelector("#discount .result");
    const finalEl = this.container.querySelector("#final-price .result");
    const economyOf = document.querySelector("#conversor-discount p span");

    const original = parseFloat(originalEl.textContent) || 0;
    const discount = parseFloat(discountEl.textContent) || 0;
    const final = parseFloat(finalEl.textContent) || 0;

    const activeEl = this.container.querySelector(".result.click");

    if (activeEl === originalEl || activeEl === discountEl) {
      const newFinal = original - (discount / 100) * original;
      finalEl.textContent = this.formatNumber(newFinal);
      economyOf.textContent = original - newFinal;
    } else if (activeEl === finalEl) {
      if (original > 0) {
        const newDiscount = ((original - final) / original) * 100;
        discountEl.textContent = this.formatNumber(newDiscount);
        economyOf.textContent = original - final;
      }
    }
  }

  formatNumber(num) {
    if (isNaN(num)) return "1";
    return num
      .toFixed(8)
      .replace(/\.?0+$/, "")
      .replace(/\.$/, "");
  }
}

class NumberSistem {
  constructor() {
    this.container = document.querySelector("#number-sistem");
    this.results = this.container.querySelectorAll(".result");
    this.selects = this.container.querySelectorAll("select");

    this.activeIndex = 0;
    this.results[0]?.classList.add("click");

    this.bindEvents();
    this.handleConversion();
  }

  bindEvents() {
    this.results.forEach((result, i) => {
      result.addEventListener("click", () => {
        this.results.forEach((r) => r.classList.remove("click"));
        result.classList.add("click");
        this.activeIndex = i;
        this.handleConversion();
      });
    });

    this.selects.forEach((select) => {
      select.addEventListener("change", () => {
        const hexDigits = this.container.querySelectorAll(".hex-digit");
        const numbers = this.container.querySelectorAll(".number");

        const elementsToModify = [...hexDigits, ...numbers];

        elementsToModify.forEach((element) => {
          if (element && element.classList) {
            element.classList.add("less-opacity");
            this.changeTableVisibility();
          }
        });

        this.handleConversion();
      });
    });
  }

  toDecimal(value, fromBase) {
    try {
      if (fromBase === "dec") return parseInt(value, 10);
      if (fromBase === "bin") return parseInt(value, 2);
      if (fromBase === "oct") return parseInt(value, 8);
      if (fromBase === "hex") return parseInt(value, 16);
    } catch (e) {}
    return NaN;
  }

  fromDecimal(value, toBase) {
    if (isNaN(value)) return "0";
    if (toBase === "dec") return value.toString();
    if (toBase === "bin") return value.toString(2);
    if (toBase === "oct") return value.toString(8);
    if (toBase === "hex") return value.toString(16).toUpperCase();
    return "0";
  }

  isValidForBase(value, base) {
    if (value === "") return false;
    const regexMap = {
      bin: /^[01]+$/,
      oct: /^[0-7]+$/,
      dec: /^\d+$/,
      hex: /^[0-9A-Fa-f]+$/,
    };
    return regexMap[base]?.test(value) ?? false;
  }

  handleConversion() {
    const activeResult = this.results[this.activeIndex];
    const fromBase = this.selects[this.activeIndex]?.value;
    let inputValue = activeResult?.textContent.trim() || "0";

    if (inputValue.length > 1) {
      inputValue = inputValue.replace(/^0+(?=\d)/, "");
    }
    if (inputValue === "") inputValue = "0";

    if (!this.isValidForBase(inputValue, fromBase)) {
      this.results.forEach((r, i) => {
        if (i !== this.activeIndex) r.textContent = "0";
      });
      return;
    }

    // Converte para decimal
    const decimalValue = this.toDecimal(inputValue, fromBase);
    if (isNaN(decimalValue)) {
      this.results.forEach((r, i) => {
        if (i !== this.activeIndex) r.textContent = "0";
      });
      return;
    }

    this.results.forEach((result, i) => {
      if (i === this.activeIndex) return;
      const toBase = this.selects[i]?.value;
      result.textContent = this.fromDecimal(decimalValue, toBase);
    });
  }

  updateActiveValue(digit) {
    const activeResult = this.results[this.activeIndex];
    if (!activeResult) return;

    let currentValue = activeResult.textContent.trim();
    const currentBase = this.selects[this.activeIndex]?.value;

    const validDigits = {
      bin: "01",
      oct: "01234567",
      dec: "0123456789",
      hex: "0123456789ABCDEF",
    };

    const allowed = validDigits[currentBase] || "0123456789";

    if (digit === "DEL") {
      currentValue = currentValue.slice(0, -1) || "1";
    } else if (digit === "AC") {
      currentValue = "1";
    } else if (digit === ".") {
      return;
    } else if (digit === "00") {
      currentValue += digit;
    } else if (allowed.includes(digit.toUpperCase())) {
      if (currentValue === "1") {
        currentValue = digit;
      } else {
        currentValue += digit;
      }
    } else {
      return;
    }

    activeResult.textContent = currentValue;
    this.handleConversion();
  }

  changeTableVisibility() {
    const activeResult = this.results[this.activeIndex];

    if (!activeResult) {
      console.warn("Nenhum resultado ativo encontrado.");
      return null;
    }

    const index = this.activeIndex;

    const correspondingSelect = this.selects[index];

    if (!correspondingSelect) {
      console.warn(`Nenhum select encontrado para o índice ${index}.`);
      return null;
    }

    const selectedValue = correspondingSelect.value;

    switch (selectedValue) {
      case "bin":
        const validNumbersBin = [
          // Nome de variável diferente
          this.container.querySelector(".one"),
          this.container.querySelector(".zero"),
          this.container.querySelector(".double-zero"),
        ];
        validNumbersBin.forEach((num) => {
          if (num) {
            num.classList.remove("less-opacity");
          }
        });
        break;

      case "oct":
        const validNumbersOct = this.container.querySelectorAll(".number");
        validNumbersOct.forEach((button) => {
          if (button && button.classList) {
            button.classList.remove("less-opacity");
          }
        });

        const eight = this.container.querySelector(".eight");
        const nine = this.container.querySelector(".nine");

        const invalidNumbers = [eight, nine];

        invalidNumbers.forEach((num) => {
          if (num && num.classList) {
            num.classList.add("less-opacity");
          }
        });
        break;

      case "dec":
        const validNumbersDec = this.container.querySelectorAll(".number");
        validNumbersDec.forEach((num) => {
          if (num) {
            num.classList.remove("less-opacity");
          }
        });
        break;

      case "hex":
        const validNumbersHex = [
          this.container.querySelectorAll(".number"),
          this.container.querySelectorAll(".hex-digit"),
        ];

        validNumbersHex.forEach((classes) => {
          if (classes) {
            classes.forEach((num) => {
              num.classList.remove("less-opacity");
            });
          }
        });
        break;

      default:
        const elementsToModify = [
          ...this.container.querySelectorAll(".operation"),
          ...this.container.querySelectorAll(".hex-digit"),
          ...this.container.querySelectorAll(".number"),
        ];
        elementsToModify.forEach((el) => {
          if (el && el.classList) {
            el.classList.add("less-opacity");
          }
        });
        break;
    }
  }
}

class Temperature {
  constructor(temperatureTable) {
    this.temperatureTable = temperatureTable;
    this.activeIndex = 0;

    this.units = ["c", "f", "k", "r", "re"];
    this.labels = {
      c: "Celsius",
      f: "Fahrenheit",
      k: "Kelvin",
      r: "Rankine",
      re: "Réaumur",
    };

    this.updateConversorTempScreen();
  }

  updateConversorTempScreen() {
    const results = document.querySelectorAll("#conversor-temperature .result");
    const selects = document.querySelectorAll(
      "#conversor-temperature #options-container select",
    );

    selects.forEach((select) => {
      select.innerHTML = "";
      this.units.forEach((unit) => {
        const opt = document.createElement("option");
        opt.value = unit;
        opt.textContent = this.labels[unit];
        select.appendChild(opt);
      });
      select.value = "c";
    });

    if (results[0]) {
      results[0].classList.add("click");
      results[0].textContent = "1";
    }

    results.forEach((result, i) => {
      result.addEventListener("click", () => {
        results.forEach((r) => r.classList.remove("click"));
        result.classList.add("click");
        result.textContent = "1";
        this.activeIndex = i;
        this.performConversion();
      });
    });

    selects.forEach((select) => {
      select.addEventListener("change", () => {
        this.performConversion();
      });
    });
  }

  convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return parseFloat(value);

    let celsius;
    switch (fromUnit) {
      case "c":
        celsius = value;
        break;
      case "f":
        celsius = ((value - 32) * 5) / 9;
        break;
      case "k":
        celsius = value - 273.15;
        break;
      case "r":
        celsius = ((value - 491.67) * 5) / 9;
        break;
      case "re":
        celsius = (value * 5) / 4;
        break;
      default:
        return NaN;
    }

    switch (toUnit) {
      case "c":
        return celsius;
      case "f":
        return (celsius * 9) / 5 + 32;
      case "k":
        return celsius + 273.15;
      case "r":
        return ((celsius + 273.15) * 9) / 5;
      case "re":
        return (celsius * 4) / 5;
      default:
        return NaN;
    }
  }

  performConversion() {
    const selects = document.querySelectorAll(
      "#conversor-temperature #options-container select",
    );
    const results = document.querySelectorAll("#conversor-temperature .result");

    if (selects.length < 2 || results.length < 2) return;

    const activeResult = results[this.activeIndex];
    const fromValue = parseFloat(activeResult?.textContent) || 1;
    const fromUnit = selects[this.activeIndex]?.value;

    if (isNaN(fromValue) || !fromUnit) return;

    results.forEach((result, i) => {
      if (i === this.activeIndex) return;

      const toUnit = selects[i]?.value;
      if (!toUnit) return;

      const converted = this.convertTemperature(fromValue, fromUnit, toUnit);
      if (!isNaN(converted)) {
        result.textContent = this.formatNumber(converted);
      }
    });
  }

  updateActiveValue(digit) {
    const results = document.querySelectorAll("#conversor-temperature .result");
    const activeResult = Array.from(results).find((r) =>
      r.classList.contains("click"),
    );

    if (!activeResult) return;

    let currentValue = activeResult.textContent.trim();

    if (digit === "DEL") {
      currentValue = currentValue.slice(0, -1);
      if (currentValue === "" || currentValue === "0") currentValue = "1";
    } else if (digit === "AC") {
      currentValue = "1";
    } else if (digit === ".") {
      if (currentValue.includes(".")) return;
      if (currentValue === "1") currentValue = "1.";
      else currentValue += ".";
    } else if (!isNaN(digit)) {
      if (currentValue === "1") {
        currentValue = digit;
      } else {
        currentValue += digit;
      }
    } else {
      return;
    }

    activeResult.textContent = currentValue;
    this.performConversion();
  }
}

class IMC {
  constructor(imcTable, imcResultTable, imcTableAuxiliar) {
    this.imcTable = imcTable;
    this.imcResultTable = imcResultTable;
    this.imcTableAuxiliar = imcTableAuxiliar;

    this.heightInput = this.imcTable.querySelector("#height");
    this.weightInput = this.imcTable.querySelector("#weight");

    this.imcResultValue = this.imcResultTable.querySelector("#imc-result span");
    this.heightResult = this.imcResultTable.querySelector("#height-result");

    this.minWeightSuggestionResult =
      this.imcResultTable.querySelector("#min-weight");

    this.maxWeightSuggestionResult =
      this.imcResultTable.querySelector("#max-weight");

    this.label = this.imcResultTable.querySelector("#label");
    this.bar = this.imcResultTable.querySelector("#bar");

    this.height = null;
    this.weight = null;

    this.bindEvents();
  }

  bindEvents() {
    this.heightInput.addEventListener("input", (e) => {
      this.height = parseFloat(e.target.value) || null;
    });

    this.weightInput.addEventListener("input", (e) => {
      this.weight = parseFloat(e.target.value) || null;
    });

    const calculateBtn = this.imcTable.querySelector("#calculate");
    calculateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.calculateAndShow();
    });

    const returnButtons = this.imcResultTable.querySelectorAll(".return");
    returnButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.imcTableAuxiliar.classList.remove("hide");
        this.imcResultTable.classList.add("hide");
      });
    });
  }

  calculateAndShow() {
    if (
      this.height === null ||
      this.weight === null ||
      this.height <= 0 ||
      this.weight <= 0 ||
      this.height > 300 ||
      this.weight > 500
    ) {
      alert("Por favor, insira valores válidos para altura e peso.");
      return;
    }

    const heightInMeters = this.height / 100;
    const imc = this.weight / (heightInMeters * heightInMeters);

    if (imc > 50) {
      alert("Ou se ta morrendo ou mentiu");
      return;
    }

    this.imcResultValue.textContent = imc.toFixed(1);

    this.heightResult.textContent = this.height;

    const minIdealWeight = (19 * heightInMeters * heightInMeters).toFixed(1);
    this.minWeightSuggestionResult.textContent = minIdealWeight;

    const maxIdealWeight = (23 * heightInMeters * heightInMeters).toFixed(1);
    this.maxWeightSuggestionResult.textContent = maxIdealWeight;

    this.updateLabelOnBar(imc);

    this.imcTableAuxiliar.classList.add("hide");
    this.imcResultTable.classList.remove("hide");
  }

  updateLabelOnBar(imc) {
    const minIMC = 18.5;
    const maxIMC = 28.0;

    let clampedIMC = Math.min(Math.max(imc, minIMC), maxIMC);

    // Posição percentual na barra
    const percent = ((clampedIMC - minIMC) / (maxIMC - minIMC)) * 100;

    // Atualiza posição do balão
    this.label.style.left = `${percent}%`;

    // Atualiza texto conforme faixa
    let category = "Normal";
    if (imc >= 24.0 && imc < 28.0) {
      category = "Sobrepeso";
    } else if (imc >= 28.0) {
      category = "Obesidade";
    } else if (imc < 18.5) {
      category = "Magreza";
    }

    this.label.textContent = category;
  }
}

const doneOperationText = document.querySelector("#done-operation");
const previousOperationText = document.querySelector("#previous-operation");
const calcTable = document.querySelector("#calculate-table");
const inOperationText = document.querySelector("#in-operation");
const numsTable = document.querySelector(".numbers-table");
const numsTableBtns = document.querySelectorAll(".numbers-table button");

const headerContainerBtns = document.querySelectorAll(
  "#header-container button",
);
const calculator = document.querySelector("#calculator");
const conversorTable = document.querySelector("#conversor-table");
const moreOptionsContainer = document.querySelector("#more-options-container");
const history = document.querySelector("#history");
const toggleThemeBtn = document.querySelector("#toggle-theme-btn");

const conversorTablebtns = document.querySelectorAll("#conversor-table button");
const conversors = document.querySelectorAll(".conversor");
const returnBTn = document.querySelectorAll(".return");
const results = document.querySelectorAll(".conversor .result");

const temperatureTable = document.querySelector("#conversor-temperature");

const imcTable = document.querySelector("#imc-calculator");
const imcResultTable = document.querySelector("#imc-result-table");
const imcTableAuxiliar = document.querySelector("#auxiliar");

const conversorDiscount = document.querySelector("#conversor-discount");

const calc = new Calculator(
  previousOperationText,
  inOperationText,
  doneOperationText,
);

const header = new Header(headerContainerBtns);

const convCoinsOperations = new ConversorCoin(
  conversorTable,
  conversorTablebtns,
);

const dateCalculator = new DateCalculator();

const discount = new Discount();

const numberSistem = new NumberSistem();

const temp = new Temperature(temperatureTable);

const imc = new IMC(imcTable, imcResultTable, imcTableAuxiliar);

document.addEventListener("DOMContentLoaded", () => {
  conversorsInstances.length = new Conversors("#conversor-length", {
    rates: {
      km: 0.001,
      m: 1,
      dm: 10,
      cm: 100,
      mm: 1000,
      μm: 1000000,
      nm: 1000000000,
      pm: 1000000000000,
      nmi: 0.000539956803455723,
      mi: 0.000621371,
      fur: 0.004970969537898671,
      in: 39.3701,
      ft: 3.28084,
      yd: 1.09361,
      fathom: 0.546806649,
      li: 0.002,
      zhang: 0.333333333,
      chi: 3.333333333,
      cun: 33.33333333,
      hao: 33333.33333,
      parsec: 3.240779289e-17,
      lunar_distance: 2.6014e-9,
      au: 6.684587122e-12,
      light_year: 1.057000834e-16,
    },
    labels: {
      km: "Quilômetro (km)",
      m: "Metro (m)",
      dm: "Decímetro (dm)",
      cm: "Centímetro (cm)",
      mm: "Milímetro (mm)",
      μm: "Micrômetro (μm)",
      nm: "Nanômetro (nm)",
      pm: "Picômetro (pm)",
      nmi: "Milha náutica (nmi)",
      fur: "Furlong (fur)",
      fathom: "Fathom (ftm)",
      yd: "Jarda (yd)",
      ft: "Pé (ft)",
      in: "Polegada (in)",
      mi: "Milha (mi)",
      li: "Lí chinês (li)",
      zhang: "Zhang (zhang)",
      chi: "Chi chinês (chi)",
      cun: "Cun chinês (cun)",
      hao: "Hao chinês (hao)",
      parsec: "Parsec (pc)",
      lunar_distance: "Distância Lunar",
      au: "Unidade Astronômica (UA)",
      light_year: "Ano-luz (ly)",
    },
  });

  conversorsInstances.mass = new Conversors("#conversor-mass", {
    rates: {
      t: 0.001,
      kg: 1,
      g: 1000,
      mg: 1000000,
      µg: 1000000000,
      quintal: 0.01,
      lb: 2.2046226218,
      oz: 35.27396195,
      ct: 5000,
      gr: 15432.358352941431,
      "l.t": 0.0009842065276110607,
      "sh.t": 0.001102311310924388,
      cwt: 0.01968413055222122,
      cwtt: 0.022046226218487756,
      st: 0.15747304441776972,
      dr: 564.3833911932872,
      dan: 0.02,
      jin: 2,
      qian: 200,
      liang: 20,
      "jin-taiwan": 1.6666666666666667,
    },
    labels: {
      t: "Tonelada (t)",
      kg: "Quilograma (kg)",
      g: "Grama (g)",
      mg: "Miligrama (mg)",
      µg: "Micrograma (µg)",
      quintal: "Quintal (q)",
      lb: "Libra (lb)",
      oz: "Onça (oz)",
      ct: "Quilate (ct)",
      gr: "Grão (gr)",
      "l.t": "Tonelada Britânica (UK)",
      "sh.t": "Tonelada Norte Americana (US)",
      cwt: "Quintal britânico (cwt)",
      cwtt: "Quintal norte-americano (cwt)",
      st: "Pedra (st)",
      dr: "Dram (dr)",
      dan: "Dan (dan)",
      jin: "Jin (jin)",
      qian: "Qian (qian)",
      liang: "Liang (liang)",
      "jin-taiwan": "Jin (Taiwan) (Jin Taiwan)",
    },
  });

  conversorsInstances.area = new Conversors("#conversor-area", {
    rates: {
      km2: 1e-6,
      ha: 0.0001,
      a: 0.01,
      m2: 1,
      dm2: 100,
      cm2: 10000,
      mm2: 1000000,
      µm2: 1e12,
      ac: 0.00024710538146716536,
      milha2: 3.861021585e-7,
      jd2: 0.0005,
      ft2: 10.763910416709722,
      pol2: 1550.0031000062001,
      rd2: 0.03953686103474647,
      qing: 0.000015,
      mu: 0.0015,
      chi2: 9,
      cun2: 900,
    },
    labels: {
      km2: "Quilômetro quadrado (km²)",
      ha: "Hectare (ha)",
      a: "Are (a)",
      m2: "Metro quadrado (m²)",
      dm2: "Decímetro quadrado (dm²)",
      cm2: "Centímetro quadrado (cm²)",
      mm2: "Milímetro quadrado (mm²)",
      µm2: "Micrômetro quadrado (µm²)",
      ac: "Acre (ac)",
      milha2: "Milha quadrada (sq mi)",
      jd2: "Jarda quadrada (jd²)",
      ft2: "Pé quadrado (ft²)",
      pol2: "Polegada quadrada (in²)",
      rd2: "Vara quadrada (rd2)",
      qing: "Qing (qing)",
      mu: "Mu (mu)",
      chi2: "Chi quadrado (chi²)",
      cun2: "Cun quadrado (cun²)",
    },
  });

  conversorsInstances.time = new Conversors("#conversor-time", {
    rates: {
      a: 1 / 31557600,
      semana: 1 / 604800,
      d: 1 / 86400,
      h: 1 / 3600,
      min: 1 / 60,
      s: 1,
      ms: 1000,
      μs: 1000000,
      ps: 1000000000,
    },
    labels: {
      a: "Ano (a)",
      semana: "Semana",
      d: "Dia (d)",
      h: "Hora (h)",
      min: "Minuto (min)",
      s: "Segundo (s)",
      ms: "Milissegundo (ms)",
      μs: "Microssegundo (μs)",
      ps: "Picossegundo (ps)",
    },
  });

  conversorsInstances.data = new Conversors("#conversor-data", {
    rates: {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
      PB: 1024 ** 5,
    },
    labels: {
      B: "Byte (B)",
      KB: "Kibibyte (KiB)",
      MB: "Mebibyte (MiB)",
      GB: "Gibibyte (GiB)",
      TB: "Tebibyte (TiB)",
      PB: "Pebibyte (PiB)",
    },
  });

  conversorsInstances.volume = new Conversors("#conversor-volume", {
    rates: {
      m3: 1,
      dm3: 1000,
      mm3: 1000000000,
      hl: 10,
      L: 1000,
      mL: 1000000,
      ft3: 35.3147,
      in3: 61023.7,
      yd3: 1.30795,
      af3: 8.10714e-7,
    },
    labels: {
      m3: "Metro cúbico (m³)",
      dm3: "Decímetro cúbico (dm³)",
      mm3: "Milímetro cúbico (mm³)",
      hl: "Hectolitro (hl)",
      L: "Litro (L)",
      mL: "Mililitro (mL)",
      ft3: "Pé cúbico (ft³)",
      in3: "Polegada cúbica (in³)",
      yd3: "Jarda cúbica (yd³)",
      af3: "Acre-pé (af³)",
    },
  });

  conversorsInstances.velocity = new Conversors("#conversor-velocity", {
    rates: {
      "m/s": 1,
      c: 3.3356409519815205e-9,
      ma: 0.002938589719085654,
      "km/h": 3.6,
      "km/s": 0.001,
      kn: 1.94384,
      mph: 2.23694,
      ips: 39.3701,
      "ft/s": 3.28084,
    },
    labels: {
      "m/s": "Metro por segundo (m/s)",
      c: "Velocidade da luz (c)",
      ma: "Mach (Ma)",
      "km/h": "Quilômetro por hora (km/h)",
      "km/s": "Quilômetro por segundo (km/s)",
      kn: "Nó (kn)",
      mph: "Milha por hora (mph)",
      ips: "Polegada por segundo (ips)",
      "ft/s": "Pé por segundo (ft/s)",
    },
  });

  conversorsInstances.temperature = new Temperature("#conversor-temperature");

  conversorsInstances.date = new DateCalculator("#conversor-date");

  conversorsInstances.discount = new Discount("#conversor-discount");

  conversorsInstances["number-sistem"] = new NumberSistem("#number-sistem");
});

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

numsTableBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.innerText.trim();

    const visibleConversor = [...conversors].find(
      (section) =>
        !section.classList.contains("hide") && section.id !== "conversor-coin",
    );

    if (visibleConversor) {
      const type = visibleConversor.id;
      const instance = conversorsInstances[type];
      if (instance && typeof instance.updateActiveValue === "function") {
        instance.updateActiveValue(value);
        return;
      }
    }

    const isOnCoinConversor =
      document.querySelector("#conversor-coin")?.classList.contains("hide") ===
      false;

    if (isOnCoinConversor && convCoinsOperations.activeResult) {
      if (+value >= 0 || value === ".") {
        let currentText = convCoinsOperations.activeResult.innerText;
        if (value === ".") {
          if (currentText.includes(".")) return;
          if (currentText === "" || currentText === "1") currentText = "0";
        }
        if (currentText === "1" && !isNaN(value) && value !== ".") {
          currentText = value;
        } else {
          currentText += value;
        }
        convCoinsOperations.activeResult.innerText = currentText;
        setTimeout(() => convCoinsOperations.handleCoinConversor(), 0);
      } else if (value === "DEL") {
        let currentText = convCoinsOperations.activeResult.innerText;
        currentText = currentText.slice(0, -1) || "1";
        convCoinsOperations.activeResult.innerText = currentText;
        setTimeout(() => convCoinsOperations.handleCoinConversor(), 0);
      } else if (value === "AC") {
        convCoinsOperations.activeResult.innerText = "1";
        setTimeout(() => convCoinsOperations.handleCoinConversor(), 0);
      }
      return;
    }

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

conversorTablebtns.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    conversors.forEach((section) => section.classList.add("hide"));
    const targetSection = document.querySelector(`#${targetId}`);
    if (targetSection) {
      targetSection.classList.remove("hide");
      conversorTable.classList.add("hide");
    } else {
      console.error(`Seção não encontrada: ${targetId}`);
    }
  });
});

returnBTn.forEach((btn) => {
  btn.addEventListener("click", () => {
    conversors.forEach((section) => section.classList.add("hide"));
    conversorTable.classList.remove("hide");
  });
});

results.forEach((result) => {
  result.addEventListener("click", (e) => {
    const clicked = e.target;
    clicked.textContent = 1;
  });
});

convCoinsOperations.getCoins();
