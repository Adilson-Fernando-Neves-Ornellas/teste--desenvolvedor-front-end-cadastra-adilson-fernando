import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
  console.log(serverUrl);
}

document.addEventListener("DOMContentLoaded", function() {
  main();
  const buttonMaisCores = document.querySelector(".button_mais_cores");
  buttonMaisCores.addEventListener("click", adicionar_cores);

  function adicionar_cores() {
    const sectionMenuCores = document.querySelector(".section_menu_options_cors");
    
    const coresAdicionais = ["Verde", "Vermelho", "Preto", "Rosa", "Vinho"];
  
    coresAdicionais.forEach(cor => {
        const divCheckbox = document.createElement("div");
        divCheckbox.classList.add("div_checbox_cors");
  
        const inputCheckbox = document.createElement("input");
        inputCheckbox.classList.add("checbox_cors");
        inputCheckbox.type = "checkbox";
        inputCheckbox.id = `cor_${cor.toLowerCase()}`;
        inputCheckbox.name = `cor_${cor.toLowerCase()}`;
  
        const labelCheckbox = document.createElement("label");
        labelCheckbox.classList.add("label_checbox_cors");
        labelCheckbox.htmlFor = `cor_${cor.toLowerCase()}`;
        labelCheckbox.textContent = cor;
  
        divCheckbox.appendChild(inputCheckbox);
        divCheckbox.appendChild(labelCheckbox);
        sectionMenuCores.appendChild(divCheckbox);
    });
    buttonMaisCores.remove();
  }
});


