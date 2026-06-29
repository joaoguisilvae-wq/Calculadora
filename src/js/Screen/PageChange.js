// class Header {
//   constructor(headerContainerBtns) {
//     this.headerContainerBtns = headerContainerBtns;
//   }

//   changeScreen(btn) {
//     const isOnConversorDetail = [...conversors].some(
//       (section) => !section.classList.contains("hide"),
//     );

//     const isMoreOptionsBtn = btn.dataset.action === "more-options";
//     if (isOnConversorDetail && !isMoreOptionsBtn) return;
//     this.headerContainerBtns.forEach((b) => b.classList.remove("focus"));
//     btn.classList.add("focus");

//     const screen = btn.dataset.screen;

//     switch (screen) {
//       case "calculator":
//         calculator.classList.remove("hide", "less-opacity");
//         history.classList.add("hide");
//         conversorTable.classList.add("hide");
//         conversors.forEach((section) => section.classList.add("hide"));
//         moreOptionsContainer.classList.add("hide");
//         break;

//       case "conversor":
//         conversorTable.classList.remove("hide", "less-opacity");
//         calculator.classList.add("hide");
//         history.classList.add("hide");
//         conversors.forEach((section) => section.classList.add("hide"));
//         moreOptionsContainer.classList.add("hide");
//         break;

//       case "history":
//         history.classList.remove("hide", "less-opacity");
//         calculator.classList.add("hide");
//         conversorTable.classList.add("hide");
//         conversors.forEach((section) => section.classList.add("hide"));
//         moreOptionsContainer.classList.add("hide");
//         break;

//       case "swipe-screen":
//         alert("Isso deixaria sua tela no modo janela");
//         break;
//       default:
//         moreOptionsContainer.classList.toggle("hide");
//         history.classList.toggle("less-opacity");
//         calculator.classList.toggle("less-opacity");
//         conversors.forEach((section) =>
//           section.classList.toggle("less-opacity"),
//         );
//         conversorTable.classList.toggle("less-opacity");
//         returnBTn.forEach((retBtn) => {
//           retBtn.classList.toggle("hide");
//         });
//         return;
//     }
//   }
// }
import headerHtml from "../../html/components/header.html?raw";

const app = document.getElementById("app");

export default function changeScreen(page = "", haveHeader = false) {
  page;
  if (page && haveHeader === true) {
    app.innerHTML = headerHtml + page;
  } else if (page) {
    app.innerHTML = page;
  } else {
    app.innerHTML = "<h1>Problemas ao carregar a Página</h1>";
  }
}
