import getConversors from "./GetConversors.js";
import othersConversors from "../../html/pages/conversors.html?raw";

const icons = [
  "fi fi-ts-laptop-code",
  "fi fi-ts-equality",
  "fi fi-tr-pencil-ruler",
  "fi fi-ts-clock-three",
  "fi fi-tr-envelope-open-text",
  "fi fi-tr-calendar-minus",
  "fi fi-ts-badge-percent",
  "fi fi-ts-coin",
  "fi fi-ts-coins",
  "fi fi-tr-arrows-repeat",
  "fi fi-tr-running",
  "fi fi-ts-temperature-high",
  "fi fi-tr-restaurant",
];

async function createConversors() {
  const data = await getConversors();
  const container = document.querySelector("#conversor-table");

  if (!container) {
    console.error("Elemento #conversor-table não encontrado.");
    return null;
  }

  if (!Array.isArray(data)) return container;

  data.forEach((conversor, i) => {
    const div = document.createElement("div");
    div.className = "conversors";

    const btn = document.createElement("button");

    const name = conversor.name;

    btn.dataset.target = name;
    btn.dataset.conversionId = conversor.conversionTypeId ?? i + 1;

    const label = conversor.label;

    const icon = document.createElement("i");
    icon.className = icons[i];

    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(` ${label}`));
    div.appendChild(btn);
    container.appendChild(div);
  });

  return container;
}

export default createConversors;
