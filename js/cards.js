import { PRODUCTS, money, waLink } from './data.js';

// Renders the product grid wherever a <div id="products-grid"> exists.
export function renderProductCards() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(
    (p) => `
    <article class="product-card">
      <a class="product-card__link" href="product.html?id=${p.id}">
        <div class="product-card__image-wrapper">
          <span class="product-card__badge">${p.badge}</span>
          <img src="${p.image}" alt="${p.name} coffee pack" loading="lazy">
        </div>
        <div class="product-card__content">
          <h3 class="product-card__title">${p.name}</h3>
          <p class="product-card__description">${p.tagline}</p>
          <div class="product-card__price">${money(p.price)} <small>/ ${p.unit}</small></div>
        </div>
      </a>
      <div class="product-card__actions">
        <button type="button" class="btn-dark" data-add="${p.id}">Add to cart</button>
        <a class="btn-wa" target="_blank" rel="noopener"
           href="${waLink(`Hi Kunal Exe Coffee! Mujhe ${p.name} (${p.unit}) order karni hai.`)}">WhatsApp</a>
      </div>
    </article>`
  ).join('');
}
