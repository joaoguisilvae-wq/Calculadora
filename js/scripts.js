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
    const isOnConversorDetail = [...conversors].some(
      (section) => !section.classList.contains("hide")
    );

    const isMoreOptionsBtn = btn.dataset.action === "more-options";

    if (isOnConversorDetail && !isMoreOptionsBtn) {
      return;
    }

    this.headerContainerBtns.forEach((b) => b.classList.remove("focus"));
    btn.classList.add("focus");

    const buttonText = btn.innerText.trim();

    switch (buttonText) {
      case "Calculadora":
        calculator.classList.remove("hide", "less-opacity");
        history.classList.add("hide");
        conversorTable.classList.add("hide");
        conversors.forEach((section) => section.classList.add("hide"));
        moreOptionsContainer.classList.add("hide");
        break;

      case "Conversor":
        conversorTable.classList.remove("hide", "less-opacity");
        calculator.classList.add("hide");
        history.classList.add("hide");
        conversors.forEach((section) => section.classList.add("hide"));
        moreOptionsContainer.classList.add("hide");
        break;

      case "Histórico":
        history.classList.remove("hide", "less-opacity");
        calculator.classList.add("hide");
        conversorTable.classList.add("hide");
        conversors.forEach((section) => section.classList.add("hide"));
        moreOptionsContainer.classList.add("hide");
        break;

      default:
        moreOptionsContainer.classList.toggle("hide");
        history.classList.toggle("less-opacity");
        calculator.classList.toggle("less-opacity");
        conversors.forEach((section) =>
          section.classList.toggle("less-opacity")
        );
        conversorTable.classList.toggle("less-opacity");
        return;
    }
  }
}

class Conversor {
  constructor(
    conversorTable,
    conversorTablebtns,
    conversorResultBtn,
    coinApiKey
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
        "https://v6.exchangerate-api.com/v6/80256d7727156d2472f5065b/latest/USD"
      );
      const data = await response.json();

      if (!data.conversion_rates) {
        throw new Error("Resposta da API inválida");
      }

      this.rates = data.conversion_rates;
      this.rates["USD"] = 1.0;

      this.handleConversion();
    } catch (err) {
      console.error("Erro ao carregar cotações:", err);
    }
  }

  convert(value, from, to) {
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

  handleConversion() {
    const selects = document.querySelectorAll(
      "#conversor-coin #options-container select"
    );
    const conversorResultBtn = document.querySelectorAll(
      "#conversor-coin .result"
    );

    if (selects.length !== 3 || conversorResultBtn.length !== 3) return;

    let activeIndex = -1;
    for (let i = 0; i < conversorResultBtn.length; i++) {
      if (conversorResultBtn[i].classList.contains("click")) {
        activeIndex = i;
        break;
      }
    }

    if (activeIndex === -1) activeIndex = 0;

    const fromCurrency = selects[activeIndex].value;
    const fromValue =
      parseFloat(conversorResultBtn[activeIndex].innerText) || 1.0;

    for (let i = 0; i < 3; i++) {
      if (i === activeIndex) continue;

      const toCurrency = selects[i].value;
      const converted = this.convert(fromValue, fromCurrency, toCurrency);

      if (!isNaN(converted)) {
        conversorResultBtn[i].innerText = converted.toFixed(4);
      }
    }
  }

  updateConversorScreen() {
    const results = document.querySelectorAll("#conversor-coin .result");
    const selects = document.querySelectorAll(
      "#conversor-coin #options-container select"
    );

    results.forEach((result) =>
      result.addEventListener("click", (e) => {
        results.forEach((result) => result.classList.remove("click"));

        result.classList.add("click");
        this.activeResult = result;
        this.handleConversion();
      })
    );

    selects.forEach((select) => {
      select.addEventListener("change", () => {
        this.handleConversion();
      });
    });
  }

  async getCoins() {
    const selects = document.querySelectorAll(
      "#conversor-coin #options-container select"
    );

    selects.forEach((select) => (select.innerHTML = ""));

    try {
      const response = await fetch(
        "https://v6.exchangerate-api.com/v6/80256d7727156d2472f5065b/latest/USD"
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
        firstResult.innerText = "1.00";
        this.activeResult = firstResult;
        this.handleConversion();
      }
    } catch (err) {
      console.error("Erro ao carregar moedas:", err);
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

const conversorTablebtns = document.querySelectorAll("#conversor-table button");
const conversors = document.querySelectorAll(".conversor");
const returnBTn = document.querySelectorAll(".return");
const conversorResultBtn = document.querySelectorAll(".conversor .result");

// Eventos
const calc = new Calculator(
  previousOperationText,
  inOperationText,
  doneOperationText
);
const header = new Header(headerContainerBtns);
const convOperations = new Conversor(conversorTable, conversorTablebtns);

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

numsTableBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.innerText;

    const isOnConversorDetail = [...conversors].some(
      (section) => !section.classList.contains("hide")
    );

    if (isOnConversorDetail && convOperations.activeResult) {
      if (+value >= 0 || value === ".") {
        let currentText = convOperations.activeResult.innerText;
        if (value === ".") {
          if (currentText.includes(".")) return;
          if (currentText === "") currentText = "0";
        }

        convOperations.activeResult.innerText += value;
        setTimeout(() => convOperations.handleConversion(), 0);
      } else if (value === "DEL") {
        let currentText = convOperations.activeResult.innerText;
        convOperations.activeResult.innerText = currentText.slice(0, -1) || "1";
        setTimeout(() => convOperations.handleConversion(), 0);
      } else if (value === "AC") {
        convOperations.activeResult.innerText = "1";
        setTimeout(() => convOperations.handleConversion(), 0);
      }
      // Futuramente adiconar + - / *
    } else {
      if (+value >= 0 || value === ".") {
        calc.addDigit(value);
      } else {
        calc.processOperations(value);
      }
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

    conversors.forEach((section) => {
      section.classList.add("hide");
    });

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
    conversors.forEach((section) => {
      section.classList.add("hide");
    });

    conversorTable.classList.remove("hide");
  });
});

convOperations.getCoins().then(() => {
  convOperations.updateConversorScreen();

  const firstResult = document.querySelector("#conversor-coin .result");
  if (firstResult) {
    firstResult.classList.add("click");
    convOperations.activeResult = firstResult;
  }
});
