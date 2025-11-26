

const PRODUCTS = [
  { id: 1, title: 'Copo de Vidro (300ml)', price: 12.90, image: 'https://images.tcdn.com.br/img/img_prod/788312/copo_de_vidro_tubo_300ml_caixa_com_24_pecas_ruvolo_80710_1_9c472de8b81dbd2a45b0fdcfcfe0e279.jpg' },
  { id: 2, title: 'Escova Multiuso (Cerdas Macias)', price: 19.99, image: 'https://http2.mlstatic.com/D_NQ_NP_911726-MLB81906641372_012025-O-escova-multiuso-limpeza-para-unha-manicure-cerdas-macias.webp' },
  { id: 3, title: 'Garrafa Térmica 500ml', price: 34.50, image: 'https://www.bagaggio.com.br/arquivos/ids/2343108_2/0160819588001---GARRAFA-TERM-500ML-HOLOGRAFICA--ROXO-U--1-.jpg' },
  { id: 4, title: 'Balde Plástico Dobrável', price: 25.00, image: 'https://m.media-amazon.com/images/I/51oaRSdhQhL._AC_UF894,1000_QL80_.jpg' },
  { id: 5, title: 'Panela Antiaderente Ø20cm', price: 49.99, image: 'https://cdn.awsli.com.br/600x700/1330/1330028/produto/188184427/d70c599356.jpg' },
  { id: 6, title: 'Jogo de Pratos (6 un. Porcelana)', price: 59.90, image: 'https://lavillecasa.vteximg.com.br/arquivos/ids/207617-1800-1800/501843.jpg?v=638564218769400000' },
  { id: 7, title: 'Organizador de Gavetas (3 und)', price: 29.90, image: 'https://images.cws.digital/produtos/gg/48/82/organizador-de-gaveta-3-divisoes-345x330x85mm-cinza-hafele-10278248-1717442293002.jpg' },
  { id: 8, title: 'Kit Pano de Prato (10 un. Microfibra)', price: 22.50, image: 'https://casadatoalha.cdn.magazord.com.br/img/2021/01/produto/539/122.jpg?ims=fit-in/600x600/filters:fill(white)' },
  { id: 9, title: 'Mini Mixer Elétrico', price: 39.90, image: 'https://cdn.awsli.com.br/761/761999/produto/163745290904dc1f18e.jpg' },
  { id: 10, title: 'Lixeira para Carro (Ecobag)', price: 10.00, image: 'https://www.sejaoza.com/images/produtos/0/0/0/ab589d983b7c66628bfa24e6c19f10dd/lixeira-para-carro-black.jpg' },
  { id: 11, title: 'Timer Digital de Cozinha', price: 18.00, image: 'https://images.tcdn.com.br/img/img_prod/1107012/timer_digital_de_cozinha_c_ima_lcd_6_5_x_4cm_weck_189_1_053ae14b14ea8594d21db01f93d921d2.jpg' },
  { id: 12, title: 'Escorredor de Louça Compacto', price: 79.90, image: 'https://73035.cdn.simplo7.net/static/73035/sku/11190120419.jpg' }
];


function formatBRL(n) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

function safeGet(id) {
  return document.getElementById(id) || null;
}

const CART_KEY = 'utilishop_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '{}');
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateNavCartCount();
}


function updateNavCartCount() {
  const el = safeGet('nav-cart-count');
  if (!el) return;
  const cart = getCart();
  const count = Object.values(cart).reduce((s, i) => s + (i.qty || 0), 0);
  el.textContent = count;
}


function renderCatalog(searchTerm = '') {
  const root = safeGet('catalog');
  if (!root) return;


  const lowerCaseSearch = searchTerm.toLowerCase().trim();
  const filteredProducts = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(lowerCaseSearch)
  );

  root.innerHTML = ''; 

  if (filteredProducts.length === 0) {
    root.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--muted); padding: 30px;">
        Nenhum produto encontrado para "${searchTerm}".
      </div>`;
  }

  for (const p of filteredProducts) {
    const div = document.createElement('div');
    div.className = 'produto';
    div.setAttribute('data-id', p.id); // Adiciona data-id para busca
    div.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <div class="preco">${formatBRL(p.price)}</div>
        <button data-id="${p.id}" class="add-btn">Adicionar ao carrinho</button>
      `;
    root.appendChild(div);
  }

  root.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      addToCart(id);
    });
  });

  updateNavCartCount();
}


function searchProducts() {
  const input = safeGet('searchInput');
  if (!input) return;
  const term = input.value;
  renderCatalog(term);
}


function addToCart(productId) {
 
  const key = String(productId);
  const p = PRODUCTS.find(x => String(x.id) === key);
  if (!p) { alert('Produto não encontrado'); return; }

  const cart = getCart();
  if (cart[key]) cart[key].qty = (cart[key].qty || 0) + 1;
  else cart[key] = { id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 };
  saveCart(cart);
  

}


function renderCartPage() {
  const root = safeGet('cart-list');
  const totalEl = safeGet('cart-total');
  
  if (!root || !totalEl) return;
  
  const cart = getCart();
  root.innerHTML = '';

  let total = 0;
  const keys = Object.keys(cart);
  
  if (keys.length === 0) {
    root.innerHTML = '<div class="muted" style="padding: 10px; text-align: center;">Seu carrinho está vazio.</div>';
    totalEl.textContent = formatBRL(0);
    updateNavCartCount();
    return;
  }

  for (const k of keys) {
    const it = cart[k];
    const itemTotal = it.price * it.qty;
    total += itemTotal;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center">
          <img src="${it.image}" style="width:72px;height:56px;object-fit:cover;border-radius:8px">
          <div>
            <div style="font-weight:700">${it.title}</div>
            <div style="color:var(--muted); font-size: 0.9em;">${formatBRL(it.price)} x ${it.qty}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
          <div style="font-weight:800; font-size: 1.1em;">${formatBRL(itemTotal)}</div>
          <div style="display:flex;gap:5px;">
            <button class="small" data-action="dec" data-id="${it.id}">-</button>
            <button class="small" data-action="inc" data-id="${it.id}">+</button>
            <button class="small remove" data-action="del" data-id="${it.id}">Remover</button>
          </div>
        </div>
      `;
    root.appendChild(li);
  }

  totalEl.textContent = formatBRL(total);

  root.querySelectorAll('button[data-action]').forEach(b => {
    b.addEventListener('click', () => {
      const act = b.dataset.action;
      const id = String(b.dataset.id);
      if (act === 'inc') changeQty(id, +1);
      else if (act === 'dec') changeQty(id, -1);
      else if (act === 'del') removeItem(id);
    });
  });

  updateNavCartCount();
}


function changeQty(id, delta) {
  const key = String(id);
  const cart = getCart();
  if (!cart[key]) return;
  cart[key].qty = (cart[key].qty || 0) + delta;
  if (cart[key].qty <= 0) delete cart[key];
  saveCart(cart);
  renderCartPage();
}

function removeItem(id) {
  const key = String(id);
  const cart = getCart();
  if (!cart[key]) return;
  delete cart[key];
  saveCart(cart);
  renderCartPage();
}


function checkout() {
  const cart = getCart();
  if (Object.keys(cart).length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }
  
  localStorage.removeItem(CART_KEY);
  updateNavCartCount();
  alert('Pedido realizado (simulação). Obrigado!');
  window.location.href = 'index.html';
}

function login(e) {
  if (e && e.preventDefault) e.preventDefault();


  window.location.href = 'index.html';
}

function cadastrar(e) {
  if (e && e.preventDefault) e.preventDefault();

  window.location.href = 'login.html';
}

window.addEventListener('DOMContentLoaded', () => {
  // Renderiza catálogo se existir (index) e anexa listener de busca
  const searchInput = safeGet('searchInput');
  const searchButton = safeGet('searchButton');
  if (searchInput) {
      renderCatalog(); // Renderiza catálogo completo na carga
      searchInput.addEventListener('input', searchProducts);
      // Opcional: permite busca ao pressionar Enter
      searchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              searchProducts();
          }
      });
  }
  if (searchButton) {
      searchButton.addEventListener('click', searchProducts);
  }

  renderCartPage();

  updateNavCartCount();

  // Atalho: ligar botão de checkout em pages onde existe
  const checkoutBtn = safeGet('checkout-button');
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

});

