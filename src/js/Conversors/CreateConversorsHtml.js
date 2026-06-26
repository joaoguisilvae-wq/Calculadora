import getConversors from "./GetConversors.js";

async function createConversors(containerSelector = "#conversors-container") {
  const data = await getConversors();
  const container = document.querySelector("#conversor-table");

  if (!Array.isArray(data)) return;

  data.forEach((conversor) => {
    const wrapper = document.createElement("div");
    wrapper.className = "conversor-theme";

    const btn = document.createElement("button");

    const name =
      typeof conversor.name === "string" ? conversor.name.trim() : "";
    const sanitized = name
      ? name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "")
      : "";
    btn.dataset.target = sanitized
      ? `conversor-${sanitized}`
      : `conversor-${conversor.id}`;

    const labelText =
      conversor.label || conversor.name || `Conversor ${conversor.id}`;
    btn.textContent = labelText;

    wrapper.appendChild(btn);
    container.appendChild(wrapper);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createConversors().catch((err) =>
    console.error("Create conversors error:", err),
  );
});

export default createConversors;
