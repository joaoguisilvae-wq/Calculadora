
# 🧮 Calculadora + Conversores

Uma aplicação web multifuncional feita com **HTML, CSS e JavaScript puro**, contendo:

- Uma **calculadora completa** com histórico persistente
- **Conversores** de moeda, comprimento, massa e muito mais
- Interface responsiva e navegação por abas

Ideal para uso diário e como estudo de manipulação do DOM e organização de código com classes.

## ✨ Funcionalidades

### 🔢 Calculadora

- Operações básicas: `+`, `-`, `×`, `÷` e `%`
- Botões:
  - `AC` – limpar tudo
  - `DEL` – apagar último caractere
  - `=` – obter resultado da conta
- **Histórico de cálculos** salvo automaticamente no navegador (`localStorage`)
- Atualização em tempo real dos campos:
  - Operação atual
  - Operação anterior
  - Resultado final

### 🔄 Conversores

- **Moeda**: Real (BRL) ↔ Dólar (USD)
- **Comprimento**: metros, centímetros, quilômetros, polegadas, etc.
- **Massa**: gramas, quilogramas, libras, etc.
- Troca instantânea entre unidades com seleção em `<select>`

### 📚 Histórico

- Acesso rápido a todos os cálculos anteriores
- Cada entrada mostra: `expressão = resultado`
- Persistência mesmo após fechar o navegador

## 🛠 Tecnologias

- **HTML5** – Estrutura semântica
- **CSS3** – Layout flexível, transições suaves, design limpo
- **JavaScript puro (ES6+)** – Sem frameworks
  - Classes: `Calculator`, `Header`, `Converter`
  - Gerenciamento de estado com métodos como `updateScreen()`
  - Uso de `localStorage` para persistência
- Navegação entre telas com classes `.hide` e `.less-opacity`

## 📁 Estrutura do Projeto

```
CALCULADORA/
├── css/
│   └── styles.css          ← estilos globais
├── img/                    ← imagens (se utilizadas)
├── js/
│   └── scripts.js          ← todo o JavaScript (calculadora, conversores, histórico, navegação)
├── index.html              ← arquivo principal
└── README.md               ← este arquivo
```

---

## ▶️ Como Rodar

1. Clone ou baixe o projeto:  
   [https://github.com/joaoguisilvae-wq/Calculadora]
2. Abra o arquivo `index.html` diretamente no navegador **(recomendado: Opera)**  

## ⚠️ Limitações Conhecidas

- A calculadora **não avalia expressões complexas** (ex: `2 + 3 * 4` é calculado sequencialmente, não seguindo precedência matemática).
- O código apresenta **repetições desnecessárias**, o que pode dificultar manutenção futura.

## 🤝 Contribuições

Encontrou um bug? Tem uma ideia de melhoria?  
Me chame no Instagram: joaoguixz0

---

Feito com 💻 e café por [joaogui.silvae](https://github.com/joaoguisilvae-wq)

---
