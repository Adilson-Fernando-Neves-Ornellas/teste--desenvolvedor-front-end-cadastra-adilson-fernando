import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", function() {

  async function main() {
    const products = await fetchProducts();
    filterProducts(products);
  }

  main();

  let carrinhoDeCompras: Product[] = [];

  let coresSelecionadas: string[] = [];
  let tamanhosSelecionados: string[] = [];
  let faixasPrecoSelecionadas: string[] = [];

  // evento de click do button de abrir o menu desktop de mais cores
  const buttonMaisCores = document.querySelector(".button_mais_cores");
  buttonMaisCores.addEventListener("click", adicionar_cores_opcao_filtro);
  // evento de abrir o modal pequeno de ordem desktop
  const buttonOrder = document.querySelector(".button_order_produtos");
  buttonOrder.addEventListener("click", abrir_menu_ordem);
  // evento de mostrar mais produtos
  const buttonExibirMais = document.querySelector(".exibir_mais_produtos_button");
  buttonExibirMais.addEventListener("click", exibirMaisProdutos);
  // evento de abrir o modal mobile de filtro de produtos
  const buttonFiltrarMenuMobile = document.querySelector('.button_filter_produtos_mobile');
  buttonFiltrarMenuMobile.addEventListener("click", handleMenuFiltrarMobile);
  // evento de fechar o modal de filtro de produtos mobile
  const buttonFecharFiltrarMenuMobile = document.querySelector('.button_close_menu_filter_mobile');
  buttonFecharFiltrarMenuMobile.addEventListener("click", fecharELimparMenuFiltrarMobile);
  // evento de abrir o modal mobile de ordem de produtos
  const buttonOrdemMenuMobile = document.querySelector('.button_order_produtos_mobile');
  buttonOrdemMenuMobile.addEventListener("click", handleMenuOrdemMobile);
  // evento de fechar o modal mobile de ordem de produtos
  const buttonFecharOrdemMenuMobile = document.querySelector('.button_close_menu_ordem_mobile');
  buttonFecharOrdemMenuMobile.addEventListener("click", handleMenuOrdemMobile);  
  // evento que seleciona vê as cores selecionadas
  const checkboxesCores = document.querySelectorAll('.checbox_cors');
  checkboxesCores.forEach((checkbox: HTMLInputElement) => {
    checkbox.addEventListener('change', handleColorChange);
  });

  // evento de abre o modal mobile de cor dentro do modal de filtro de produtos
  const buttonAbrirCoresFiltroMenuMobile = document.querySelector('.button_menu_filter_mobile_cores');
  buttonAbrirCoresFiltroMenuMobile.addEventListener("click", handleAbrirCoresFiltroMenuMobile);

  // evento de abre o modal mobile de tamanhos dentro do modal de filtro de produtos
  const buttonAbrirTamanhosFiltroMenuMobile = document.querySelector('.button_menu_filter_mobile_tamanhos');
  buttonAbrirTamanhosFiltroMenuMobile.addEventListener("click", handleAbrirTamanhosFiltroMenuMobile);

  // evento de abre o modal mobile de faixa de cor dentro do modal de filtro de produtos
  const buttonAbrirFaixaPrecosFiltroMenuMobile = document.querySelector('.button_menu_filter_mobile_precos');
  buttonAbrirFaixaPrecosFiltroMenuMobile.addEventListener("click", handleAbrirFaixaPrecosFiltroMenuMobile);
  
  // evento quando clica em aplicar no modal mobile de filtro de produtos
  const buttonAplicarFiltroMenuMobile = document.querySelector('.button_aplicar_filtro_produtos');
  buttonAplicarFiltroMenuMobile.addEventListener("click", handleMenuFiltrarMobile);

  // evento quando clica em limpar no modal mobile de filtro de produtos
  const buttonLimparFiltroMenuMobile = document.querySelector('.button_limpar_filtro_produtos');
  buttonLimparFiltroMenuMobile.addEventListener("click", fecharELimparMenuFiltrarMobile);

  function handleColorChange() {
    main();
  }

  const checkboxesTamanhos = document.querySelectorAll('.checbox_tamanho');
  checkboxesTamanhos.forEach((checkbox: HTMLInputElement) => {
      checkbox.addEventListener('change', () => {
          main();
      });
  });

  const checkboxesPreco = document.querySelectorAll('.checbox_preco');
  checkboxesPreco.forEach((checkbox: HTMLInputElement) => {
      checkbox.addEventListener('change', () => {
          main();
      });
  });

  const checkboxesOrdem = document.querySelectorAll('.checbox_ordem_produtos');
  checkboxesOrdem.forEach((checkbox: HTMLInputElement) => {
    checkbox.addEventListener('change', handleOrdemChange);
  });

  function handleOrdemChange() {
    main();
  }
  
  function handleTamanhosChange() {
    main();
  }

  function handleFaixaPrecosChange() {
    main();
  }

  let maisRecentesChecked = false;
  let menorPrecoChecked = false;
  let maiorPrecoChecked = false;
  let produtosExibidos = 10;

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
    let filteredProducts = products;

    coresSelecionadas = obterCoresSelecionadas();
    if (coresSelecionadas.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const colorLowerCase = product.color.toLowerCase();
        return coresSelecionadas.includes(colorLowerCase);
      });
    }
    
    tamanhosSelecionados = obterTamanhosSelecionados();
    if (tamanhosSelecionados.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return product.size.some(size => tamanhosSelecionados.includes(size));
        });
    }


    faixasPrecoSelecionadas = obterFaixasPrecoSelecionadas();
    if (faixasPrecoSelecionadas.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            const preco = product.price;
            return faixasPrecoSelecionadas.some(faixa => {
                switch (faixa) {
                    case 'PRECO_0_50':
                        return preco >= 0 && preco <= 50;
                    case 'PRECO_51_150':
                        return preco >= 51 && preco <= 150;
                    case 'PRECO_151_300':
                        return preco >= 151 && preco <= 300;
                    case 'PRECO_301_500':
                        return preco >= 301 && preco <= 500;
                    case 'PRECO_500_MAIS':
                        return preco >= 500;
                    default:
                        return false;
                }
            });
        });
    }

    if (maisRecentesChecked) {
        filteredProducts = filteredProducts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (menorPrecoChecked) {
        filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (maiorPrecoChecked) {
        filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    renderizarProducts(filteredProducts, produtosExibidos);
  }

  function obterCoresSelecionadas() {
    const checkboxes = document.querySelectorAll('.checbox_cors:checked');
    coresSelecionadas = [];
    checkboxes.forEach((checkbox: HTMLInputElement) => {
      const cor = checkbox.name.split('_')[1];
      coresSelecionadas.push(cor);
    });
    return coresSelecionadas;
  }
 
  function obterTamanhosSelecionados(): string[] {
    const checkboxes = document.querySelectorAll('.checbox_tamanho:checked');
    coresSelecionadas = [];
    tamanhosSelecionados = Array.from(checkboxes).map((checkbox: HTMLInputElement) => {
        return checkbox.id.slice('TAMANHO_'.length).toUpperCase(); 
    });
    return tamanhosSelecionados;
  }

  function obterFaixasPrecoSelecionadas(): string[] {
    const checkboxes = document.querySelectorAll('.checbox_preco:checked');
    faixasPrecoSelecionadas = [];
    faixasPrecoSelecionadas = Array.from(checkboxes).map((checkbox: HTMLInputElement) => {
        return checkbox.id.toUpperCase(); 
    });
    return faixasPrecoSelecionadas;
  }

  function renderizarProducts(products:Product[], numerosAmostrar: number) {
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

      button.addEventListener('click', () => {
        adicionarAoCarrinho(product);
      });

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

  function adicionarAoCarrinho(product: Product) {
    carrinhoDeCompras.push(product);
    alert(`Produto "${product.name}" adicionado ao carrinho de compras!`)
    console.log("Segue abaixo seu carrinho de compra: ")
    console.log(carrinhoDeCompras)
  }

  function adicionar_cores_opcao_filtro() {
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
        inputCheckbox.addEventListener('change', handleColorChange);
    });

    buttonMaisCores.remove();
  }

  function abrir_menu_ordem() {
    let divButtonOrdenar = document.querySelector('.div_button_ordenar');
    let existingCheckboxes = document.querySelectorAll('.checbox_ordem_produtos');
    let existingLabels = document.querySelectorAll('.label_checbox_ordem_produtos');
    let existingDivs = document.querySelectorAll('.div_checbox_ordem');

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
        maisRecentes.addEventListener('change', handleOrdemChange);

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
        menorPreco.addEventListener('change', handleOrdemChange);

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
        maiorPreco.addEventListener('change', handleOrdemChange);
        
        divMaiorPreco.appendChild(labelMaiorPreco);
        divMaiorPreco.appendChild(maiorPreco);

        divButtonOrdenar.appendChild(divMaisRecentes);
        divButtonOrdenar.appendChild(divMenorPreco);
        divButtonOrdenar.appendChild(divMaiorPreco);

    }else{
      fechar_menu_ordem();
    }
  }

  function fechar_menu_ordem() {
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
  }

  function handleMenuFiltrarMobile() {
    const modal = document.getElementsByClassName('modal_filter_produtos')[0] as HTMLElement;

    if (modal.style.display === "block") {
        modal.style.display = "none"; 
    } else {
        modal.style.display = "block"; 
    }
  }

  function handleMenuOrdemMobile() {
    const modal = document.getElementsByClassName('modal_ordem_produtos')[0] as HTMLElement;

    if (modal.style.display === "block") {
        modal.style.display = "none";
        fechar_menu_ordem_mobile();
      } else {
        modal.style.display = "block";
        abrir_menu_ordem_mobile();
    }
  }
  
  function abrir_menu_ordem_mobile() {
    let divButtonOrdenar = document.querySelector('.main_menu_ordem_mobile');
    let existingCheckboxes = document.querySelectorAll('.checbox_ordem_produtos');
    let existingLabels = document.querySelectorAll('.label_checbox_ordem_produtos');
    let existingDivs = document.querySelectorAll('.div_checbox_ordem');

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
        maisRecentes.addEventListener('change', handleOrdemChange);

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
        menorPreco.addEventListener('change', handleOrdemChange);

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
        maiorPreco.addEventListener('change', handleOrdemChange);
        
        divMaiorPreco.appendChild(labelMaiorPreco);
        divMaiorPreco.appendChild(maiorPreco);

        divButtonOrdenar.appendChild(divMaisRecentes);
        divButtonOrdenar.appendChild(divMenorPreco);
        divButtonOrdenar.appendChild(divMaiorPreco);

    }else{
      fechar_menu_ordem_mobile();
    }
  }

  function fechar_menu_ordem_mobile() {
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
  }

  let secaoCoresAberta = false
  function handleAbrirCoresFiltroMenuMobile() {
    const sectionMenuCores = document.querySelector(".section_menu_mobile_filter_cores");

    const coresAdicionais = ["Amarelo", "Azul", "Branco", "Cinza", "Laranja", "Verde", "Vermelho", "Preto", "Rosa", "Vinho"];
  
    while (sectionMenuCores.firstChild) {
      sectionMenuCores.removeChild(sectionMenuCores.firstChild);
    }
  
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
      
      if (coresSelecionadas.includes(cor.toLowerCase())) {
        inputCheckbox.checked = true;
      }
  
      inputCheckbox.addEventListener('change', handleColorChange);
    });
  
    secaoCoresAberta = !secaoCoresAberta;
    if(secaoCoresAberta==false){
      while (sectionMenuCores.firstChild) {
        sectionMenuCores.removeChild(sectionMenuCores.firstChild);
      }
    }
    apagarSectionButtonSeTodosSubMenusFechado();
  }

  let secaoTamanhosAberta = false;
  function handleAbrirTamanhosFiltroMenuMobile() {
    const sectionMenuTamanhos = document.querySelector(".section_menu_mobile_filter_tamanhos");
  
    const sectionButtons = document.querySelector(".section_limpar_aplicar_filtro_produtos") as HTMLElement;
    sectionButtons.style.display = "flex";

    const tamanhos = ["P", "M", "G", "GG", "U", "36", "38", "40", "42", "44", "46"];
  
    while (sectionMenuTamanhos.firstChild) {
      sectionMenuTamanhos.removeChild(sectionMenuTamanhos.firstChild);
    }
  
    tamanhos.forEach(tamanho => {
      const divCheckbox = document.createElement("div");
      divCheckbox.classList.add("div_checbox_tamanho");
  
      const inputCheckbox = document.createElement("input");
      inputCheckbox.classList.add("checbox_tamanho");
      inputCheckbox.type = "checkbox";
      inputCheckbox.id = `tamanho_${tamanho.toLowerCase()}`;
      inputCheckbox.name = `tamanho_${tamanho.toLowerCase()}`;
  
      const labelCheckbox = document.createElement("label");
      labelCheckbox.classList.add("label_checbox_tamanho");
      labelCheckbox.htmlFor = `tamanho_${tamanho.toLowerCase()}`;
      labelCheckbox.textContent = tamanho;
  
      divCheckbox.appendChild(inputCheckbox);
      divCheckbox.appendChild(labelCheckbox);
      sectionMenuTamanhos.appendChild(divCheckbox);
      inputCheckbox.addEventListener('change', handleTamanhosChange);
    });
  
    secaoTamanhosAberta = !secaoTamanhosAberta;
    if(secaoTamanhosAberta==false){
      while (sectionMenuTamanhos.firstChild) {
        sectionMenuTamanhos.removeChild(sectionMenuTamanhos.firstChild);
      }
    }
    apagarSectionButtonSeTodosSubMenusFechado();
  }

  let secaoFaixaPrecosAberta = false;
  function handleAbrirFaixaPrecosFiltroMenuMobile() {
    const sectionMenuFaixaPrecos = document.querySelector(".section_menu_mobile_filter_faixa_precos");

    const sectionButtons = document.querySelector(".section_limpar_aplicar_filtro_produtos") as HTMLElement;
    sectionButtons.style.display = "flex";

    const faixasPrecos = [
      { id: "preco_0_50", label: "de R$0 até R$50" },
      { id: "preco_51_150", label: "de R$51 até R$150" },
      { id: "preco_151_300", label: "de R$151 até R$300" },
      { id: "preco_301_500", label: "de R$301 até R$500" },
      { id: "preco_500_mais", label: "a partir de R$500" }
    ];
  
    while (sectionMenuFaixaPrecos.firstChild) {
      sectionMenuFaixaPrecos.removeChild(sectionMenuFaixaPrecos.firstChild);
    }

    faixasPrecos.forEach(faixa => {
      const divCheckbox = document.createElement("div");
      divCheckbox.classList.add("div_checbox_preco");
  
      const inputCheckbox = document.createElement("input");
      inputCheckbox.classList.add("checbox_preco");
      inputCheckbox.type = "checkbox";
      inputCheckbox.id = faixa.id;
      inputCheckbox.name = faixa.id;
  
      const labelCheckbox = document.createElement("label");
      labelCheckbox.classList.add("label_checbox_preco");
      labelCheckbox.htmlFor = faixa.id;
      labelCheckbox.textContent = faixa.label;
  
      divCheckbox.appendChild(inputCheckbox);
      divCheckbox.appendChild(labelCheckbox);
      sectionMenuFaixaPrecos.appendChild(divCheckbox);
      inputCheckbox.addEventListener('change', handleFaixaPrecosChange);
    });
  
    secaoFaixaPrecosAberta = !secaoFaixaPrecosAberta;
    if(secaoFaixaPrecosAberta==false){
      while (sectionMenuFaixaPrecos.firstChild) {
        sectionMenuFaixaPrecos.removeChild(sectionMenuFaixaPrecos.firstChild);
      }
    }
    apagarSectionButtonSeTodosSubMenusFechado();
  }

  function apagarSectionButtonSeTodosSubMenusFechado(){
    const sectionButtons = document.querySelector(".section_limpar_aplicar_filtro_produtos") as HTMLElement;
    if(secaoFaixaPrecosAberta === false && secaoTamanhosAberta === false && secaoCoresAberta === false){
      sectionButtons.style.display = "none";
    }else{
      sectionButtons.style.display = "flex";
    }
  }

  function fecharELimparMenuFiltrarMobile() {
    const modal = document.getElementsByClassName('modal_filter_produtos')[0] as HTMLElement;
  
    coresSelecionadas = [];
    tamanhosSelecionados = [];
    faixasPrecoSelecionadas = [];

    const checkboxesPreco = document.querySelectorAll('.checbox_preco');
    checkboxesPreco.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });
  
    const checkboxesTamanhos = document.querySelectorAll('.checbox_tamanho');
    checkboxesTamanhos.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });
  
    const checkboxesCores = document.querySelectorAll('.checbox_cors');
    checkboxesCores.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });

    const sectionMenuFaixaPrecos = document.querySelector(".section_menu_mobile_filter_faixa_precos");
    while (sectionMenuFaixaPrecos.firstChild) {
      sectionMenuFaixaPrecos.removeChild(sectionMenuFaixaPrecos.firstChild);
    }
    const sectionMenuTamanhos = document.querySelector(".section_menu_mobile_filter_tamanhos");
    while (sectionMenuTamanhos.firstChild) {
      sectionMenuTamanhos.removeChild(sectionMenuTamanhos.firstChild);
    }
    const sectionMenuCores = document.querySelector(".section_menu_mobile_filter_cores");
    while (sectionMenuCores.firstChild) {
      sectionMenuCores.removeChild(sectionMenuCores.firstChild);
    }

    const sectionButtons = document.querySelector(".section_limpar_aplicar_filtro_produtos") as HTMLElement;
    sectionButtons.style.display = "none";

    modal.style.display = (modal.style.display === "block") ? "none" : "block";
  
    main();
  }
  
});


