import { PRODUCTS, getProduct, money, waLink, mailLink, EMAIL } from './data.js';

const params = new URLSearchParams(window.location.search);
const id = params.get('id') || params.get('handle');
const p = getProduct(id);
const root = document.getElementById('product-root');

if (!p) {
  root.innerHTML = `
    <div style="text-align:center;padding:80px 0">
      <h1 style="font-family:'Playfair Display',serif">Product nahi mila</h1>
      <p>Ye coffee available nahi hai. <a href="collections.html">Saari coffees dekhein</a>.</p>
    </div>`;
} else {
  document.title = `${p.name} | Kunal Exe Coffee`;
  const others = PRODUCTS.filter((x) => x.id !== p.id);

  root.innerHTML = `
    <div class="breadcrumb"><a href="index.html">Home</a> / <a href="collections.html">Shop</a> / ${p.name}</div>
    <div class="product-layout">
      <div class="product-gallery"><img src="${p.image}" alt="${p.name} coffee pack" loading="lazy"></div>
      <div class="product-info">
        <span class="badge">${p.badge}</span>
        <h1>${p.name}</h1>
        <p class="tagline">${p.tagline}</p>
        <div class="price">${money(p.price)} <small>/ ${p.unit}</small></div>
        <p class="desc">${p.description}</p>
        <ul class="notes">${p.notes.map((n) => `<li>${n}</li>`).join('')}</ul>
        <div class="qty">
          <button type="button" id="qty-minus" aria-label="Kam karein">&minus;</button>
          <span id="qty-value">1</span>
          <button type="button" id="qty-plus" aria-label="Badhayein">+</button>
        </div>
        <div class="product-actions">
          <button type="button" class="btn-dark btn-block" data-add="${p.id}">Add to cart</button>
          <a class="btn-wa btn-block" id="pd-wa" target="_blank" rel="noopener">Order on WhatsApp</a>
          <a class="btn-outline btn-block" id="pd-mail">Email us (${EMAIL})</a>
        </div>
      </div>
    </div>
    <section class="related">
      <h2>You may also like</h2>
      <div class="products-grid">
        ${others
          .map(
            (o) => `
          <article class="product-card">
            <a class="product-card__link" href="product.html?id=${o.id}">
              <div class="product-card__image-wrapper"><img src="${o.image}" alt="${o.name}" loading="lazy"></div>
              <div class="product-card__content">
                <h3 class="product-card__title">${o.name}</h3>
                <div class="product-card__price">${money(o.price)} <small>/ ${o.unit}</small></div>
              </div>
            </a>
          </article>`
          )
          .join('')}
      </div>
    </section>`;

  const qtyEl = document.getElementById('qty-value');
  const waEl = document.getElementById('pd-wa');
  const mailEl = document.getElementById('pd-mail');
  let qty = 1;

  const refresh = () => {
    qtyEl.textContent = qty;
    const text = `Hi Kunal Exe Coffee! Mujhe ${p.name} (${p.unit}) x ${qty} order karni hai. Total: ${money(p.price * qty)}`;
    waEl.href = waLink(text);
    mailEl.href = mailLink(`Order - ${p.name}`, text);
  };
  document.getElementById('qty-minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); refresh(); });
  document.getElementById('qty-plus').addEventListener('click', () => { qty = Math.min(20, qty + 1); refresh(); });
  refresh();
}
