const right = document.querySelector(".toggle-color-btn #right");
const left = document.querySelector(".toggle-color-btn #left");
const light = document.querySelector(".toggle-base-btn #light");
const dark = document.querySelector(".toggle-base-btn #dark");

const colors = [
  "principal",
  "minimal",
  "neon",
  "pastel",
  "matrix",
  "purple",
  "orange",
  "ocean",
  "pink",
];

let i = 0;
let color = "principal";
let theme = "dark";

let colorTheme = "principal-dark";

export function setColor(id) {
  if (id === "right") {
    i = (i + 1) % colors.length;
    color = colors[i];
  } else if (id === "left") {
    i = (i - 1 + colors.length) % colors.length;
    color = colors[i];
  } else if (id === "dark") {
    theme = "dark";
  } else if (id === "light") {
    theme = "light";
  } else {
    console.log("Passe uma entrada valida");
    theme = "dark";
    color = colors[i];
  }

  colorTheme = `${color}-${theme}`;

  colorChange(colorTheme);
}

function colorChange(colorValue) {
  document.documentElement.setAttribute("data-theme", colorValue);
}
