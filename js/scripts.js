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
    previous = null
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
      (section) => !section.classList.contains("hide")
    );

    const isMoreOptionsBtn = btn.dataset.action === "more-options";
    if (isOnConversorDetail && !isMoreOptionsBtn) return;
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
      "#options-container select"
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
      "#options-container select"
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
        : converted.toFixed(6).replace(/\.?0+$/, "");
    });
  }

  updateActiveValue(digit) {
    const results = this.container.querySelectorAll(".result");
    const activeResult = Array.from(results).find((result) =>
      result.classList.contains("click")
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
      "#conversor-coin #options-container select"
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
      "#conversor-coin #options-container select"
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
        firstResult.innerText = "1";
        this.activeResult = firstResult;
        this.handleCoinConversor();
      }
    } catch (err) {
      console.error("Erro ao carregar moedas:", err);
    }
  }
}

class IMC {
  constructor(imcTable, imcTableBtns) {
    (this.imcTable = imcTable), (this.imcTableBtns = imcTableBtns);
  }
}

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
const results = document.querySelectorAll(".conversor .result");

const calc = new Calculator(
  previousOperationText,
  inOperationText,
  doneOperationText
);

const header = new Header(headerContainerBtns);
const convCoinsOperations = new ConversorCoin(
  conversorTable,
  conversorTablebtns
);

let conversorsInstances = {};

document.addEventListener("DOMContentLoaded", () => {
  conversorsInstances.length = new Conversors("#conversor-length", {
    rates: {
      m: 1,
      km: 0.001,
      cm: 100,
      mm: 1000,
      in: 39.3701,
      ft: 3.28084,
      yd: 1.09361,
      mi: 0.000621371,
    },
    labels: {
      m: "Metro (m)",
      km: "Quilômetro (km)",
      cm: "Centímetro (cm)",
      mm: "Milímetro (mm)",
      in: "Polegada (in)",
      ft: "Pé (ft)",
      yd: "Jarda (yd)",
      mi: "Milha (mi)",
    },
  });

  conversorsInstances.mass = new Conversors("#conversor-mass", {
    rates: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274, t: 0.001 },
    labels: {
      kg: "Quilograma (kg)",
      g: "Grama (g)",
      mg: "Miligrama (mg)",
      lb: "Libra (lb)",
      oz: "Onça (oz)",
      t: "Tonelada (t)",
    },
  });

  conversorsInstances.area = new Conversors("#conversor-area", {
    rates: {
      m2: 1,
      km2: 1e-6,
      cm2: 10000,
      mm2: 1000000,
      ha: 0.0001,
      ft2: 10.7639,
      in2: 1550,
      acre: 0.000247105,
    },
    labels: {
      m2: "Metro² (m²)",
      km2: "Quilômetro² (km²)",
      cm2: "Centímetro² (cm²)",
      mm2: "Milímetro² (mm²)",
      ha: "Hectare (ha)",
      ft2: "Pé² (ft²)",
      in2: "Polegada² (in²)",
      acre: "Acre",
    },
  });

  conversorsInstances.time = new Conversors("#conversor-time", {
    rates: {
      s: 1,
      min: 1 / 60,
      h: 1 / 3600,
      dia: 1 / 86400,
      semana: 1 / 604800,
      ms: 1000,
    },
    labels: {
      s: "Segundo (s)",
      min: "Minuto (min)",
      h: "Hora (h)",
      dia: "Dia",
      semana: "Semana",
      ms: "Milissegundo (ms)",
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
      L: 1000,
      mL: 1000000,
      cm3: 1000000,
      ft3: 35.3147,
      in3: 61023.7,
      gal_US: 264.172,
      gal_UK: 219.969,
    },
    labels: {
      m3: "Metro³ (m³)",
      L: "Litro (L)",
      mL: "Mililitro (mL)",
      cm3: "Centímetro³ (cm³)",
      ft3: "Pé³ (ft³)",
      in3: "Polegada³ (in³)",
      gal_US: "Galão (EUA)",
      gal_UK: "Galão (UK)",
    },
  });

  conversorsInstances.velocity = new Conversors("#conversor-velocity", {
    rates: {
      "m/s": 1,
      "km/h": 3.6,
      mph: 2.23694,
      "ft/s": 3.28084,
      kt: 1.94384,
    },
    labels: {
      "m/s": "Metro/segundo (m/s)",
      "km/h": "Quilômetro/hora (km/h)",
      mph: "Milha/hora (mph)",
      "ft/s": "Pé/segundo (ft/s)",
      kt: "Nó (kt)",
    },
  });
});

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

numsTableBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.innerText.trim();

    const visibleConversor = [...conversors].find(
      (section) =>
        !section.classList.contains("hide") && section.id !== "conversor-coin"
    );

    if (visibleConversor) {
      const type = visibleConversor.id.replace("conversor-", "");
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

convCoinsOperations.getCoins();
