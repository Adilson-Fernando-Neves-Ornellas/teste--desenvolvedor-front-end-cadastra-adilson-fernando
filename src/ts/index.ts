import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", function() {
  main();
  const buttonMaisCores = document.querySelector(".button_mais_cores");
  buttonMaisCores.addEventListener("click", adicionar_cores);

  const buttonOrder = document.querySelector(".button_order_produtos");
  buttonOrder.addEventListener("click", menu_ordem);

  const buttonExibirMais = document.querySelector(".exibir_mais_produtos_button");
  buttonExibirMais.addEventListener("click", exibirMaisProdutos);

  let maisRecentesChecked = false;
  let menorPrecoChecked = false;
  let maiorPrecoChecked = false;
  let produtosExibidos = 10;

  async function main() {
    const products = await fetchProducts();
    filterProducts(products);
  }

  function exibirMaisProdutos() {
    produtosExibidos += 2;
    main()
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
        const response = await fetch(`http://localhost:5000/products`);
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

  function filterProducts(products:Product[]){

    if (maisRecentesChecked) {
        products = products.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (menorPrecoChecked) {
        products = products.sort((a, b) => a.price - b.price);
    } else if (maiorPrecoChecked) {
        products = products.sort((a, b) => b.price - a.price);
    }

    renderProducts(products, produtosExibidos);
    
  }

  function renderProducts(products:Product[], numerosAmostrar: number) {
    const listContainer = document.querySelector('.listas_cards_produtos');
    const avisoTodosMostrados = document.querySelector('.aviso_todos_mostrados');
    if (!listContainer) return;

    listContainer.innerHTML = "";

    for (let i = 0; i < numerosAmostrar && i < products.length; i++)  {
      const product = products[i];
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
    };
    if (numerosAmostrar > products.length) {
      avisoTodosMostrados.textContent = "Não há mais produtos a serem mostrados";
    } else {
        avisoTodosMostrados.textContent = "";
    }
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

  function menu_ordem() {
    let divButtonOrdenar = document.querySelector('.div_button_ordenar');

    let existingCheckboxes = document.querySelectorAll('.checbox_ordem_produtos');
    existingCheckboxes.forEach(function(checkbox) {
        checkbox.remove();
    });
    let existingLabels = document.querySelectorAll('.label_checbox_ordem_produtos');
    existingLabels.forEach(function(label) {
        label.remove();
    });
    let existingDivs = document.querySelectorAll('.div_checbox_ordem');
    existingDivs.forEach(function(div) {
        div.remove();
    });

    if (existingLabels.length === 0 && existingCheckboxes.length === 0 && existingDivs.length === 0) {
        let divMaisRecentes = document.createElement('div');
        divMaisRecentes.className = 'div_checbox_ordem';

        let maisRecentes = document.createElement('input');
        maisRecentes.type = 'checkbox';
        maisRecentes.className = 'checbox_ordem_produtos';
        maisRecentes.id = 'maisRecentes';
        maisRecentes.checked = maisRecentesChecked;
        maisRecentes.addEventListener('change', function() {
            if (maisRecentes.checked) {
                menorPreco.checked = false;
                menorPrecoChecked = false;
                maiorPreco.checked = false;
                maiorPrecoChecked = false;
            }
            maisRecentesChecked = maisRecentes.checked; 
        });
        let labelMaisRecentes = document.createElement('label');
        labelMaisRecentes.htmlFor = 'maisRecentes';
        labelMaisRecentes.textContent = 'Mais Recentes';
        labelMaisRecentes.className = 'label_checbox_ordem_produtos';

        divMaisRecentes.appendChild(labelMaisRecentes);
        divMaisRecentes.appendChild(maisRecentes);

        let divMenorPreco = document.createElement('div');
        divMenorPreco.className = 'div_checbox_ordem';

        let menorPreco = document.createElement('input');
        menorPreco.type = 'checkbox';
        menorPreco.className = 'checbox_ordem_produtos';
        menorPreco.id = 'menorPreco';
        menorPreco.checked = menorPrecoChecked; 
        menorPreco.addEventListener('change', function() {
            if (menorPreco.checked) {
                maisRecentes.checked = false;
                maisRecentesChecked = false;
                maiorPreco.checked = false;
                maiorPrecoChecked = false;
            }
            menorPrecoChecked = menorPreco.checked; 
        });
        let labelMenorPreco = document.createElement('label');
        labelMenorPreco.htmlFor = 'menorPreco';
        labelMenorPreco.textContent = 'Menor preço';
        labelMenorPreco.className = 'label_checbox_ordem_produtos';

        divMenorPreco.appendChild(labelMenorPreco);
        divMenorPreco.appendChild(menorPreco);

        let divMaiorPreco = document.createElement('div');
        divMaiorPreco.className = 'div_checbox_ordem';

        let maiorPreco = document.createElement('input');
        maiorPreco.type = 'checkbox';
        maiorPreco.className = 'checbox_ordem_produtos';
        maiorPreco.id = 'maiorPreco';
        maiorPreco.checked = maiorPrecoChecked; 
        maiorPreco.addEventListener('change', function() {
            if (maiorPreco.checked) {
                maisRecentes.checked = false;
                maisRecentesChecked = false;
                menorPreco.checked = false;
                menorPrecoChecked = false;
            }
            maiorPrecoChecked = maiorPreco.checked;
        });
        let labelMaiorPreco = document.createElement('label');
        labelMaiorPreco.htmlFor = 'maiorPreco';
        labelMaiorPreco.textContent = 'Maior preço';
        labelMaiorPreco.className = 'label_checbox_ordem_produtos';

        divMaiorPreco.appendChild(labelMaiorPreco);
        divMaiorPreco.appendChild(maiorPreco);

        divButtonOrdenar.appendChild(divMaisRecentes);
        divButtonOrdenar.appendChild(divMenorPreco);
        divButtonOrdenar.appendChild(divMaiorPreco);
    }
    verificaChecboxOrder();
  }
  
  function verificaChecboxOrder(){
    const maisRecentesCheckbox = document.getElementById('maisRecentes');
    const maiorPrecoCheckbox = document.getElementById('maiorPreco');
    const menorPrecoCheckbox = document.getElementById('menorPreco');

    setTimeout(() => {
      maisRecentesCheckbox.addEventListener('change', function (event) {
        if (event.target instanceof HTMLInputElement) {
            let check =  event.target.checked;
            if(check){
              maisRecentesChecked = true
              menorPrecoChecked = false;
              maiorPrecoChecked = false;
            }
        }
      });

      maiorPrecoCheckbox.addEventListener('change', function (event) {
        if (event.target instanceof HTMLInputElement) {
            let check =  event.target.checked;
            if(check){
              maisRecentesChecked = false;
              menorPrecoChecked = true;
              maiorPrecoChecked = false;
            }
        }
      });

      menorPrecoCheckbox.addEventListener('change', function (event) {
        if (event.target instanceof HTMLInputElement) {
            let check =  event.target.checked;
            if(check){
              maisRecentesChecked = false;
              menorPrecoChecked = false;
              maiorPrecoChecked = true;
            }
        }
      });
      main();
      menu_ordem();
    }, 1500);
  }

});


