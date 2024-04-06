import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
  console.log(serverUrl);
}

document.addEventListener("DOMContentLoaded", function() {
  main();
  const buttonMaisCores = document.querySelector(".button_mais_cores");
  buttonMaisCores.addEventListener("click", adicionar_cores);

  async function main() {
    const products = await fetchProducts();
    renderProducts(products);
  }

  interface Product {
    id: string;
    name: string;
    price: number;
    parcelamento: [number, number];
    color: string;
    image: string;
    size: string[];
    date: string;
  }

  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:5000/products');
      if (!response.ok) {
        throw new Error('Erro ao obter os produtos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao obter os produtos:', error);
      return [];
    }
  }

  function renderProducts(products:Product[]) {
    const listContainer = document.querySelector('.listas_cards_produtos');
    if (!listContainer) return;

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('card_produto');

      const image = document.createElement('img');
      image.classList.add('card_produto_imagem');
      image.src = product.image;
      image.alt = product.name;

      const title = document.createElement('p');
      title.classList.add('card_produto_titulo');
      title.textContent = product.name.toUpperCase();

      const price = document.createElement('p');
      price.classList.add('card_produto_preco');
      price.textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

      const parcelas = document.createElement('p');
      parcelas.classList.add('card_produto_parcelas');
      parcelas.textContent = `até ${product.parcelamento[0]}x de R$ ${product.parcelamento[1].toFixed(2).replace('.', ',')}`;

      const button = document.createElement('button');
      button.classList.add('button_add_carrinho');
      button.textContent = 'COMPRAR';

      card.appendChild(image);
      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(parcelas);
      card.appendChild(button);

      listContainer.appendChild(card);
    });
  }

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


