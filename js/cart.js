import { getProduct, money, waLink, mailLink, EMAIL } from './data.js';

const KEY = 'kunal-exe-cart-v1';
let items = load();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(raw) ? raw.filter((i) => getProduct(i.id) && i.qty > 0) : [];
  } catch {
    return [];
  }
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage blocked */ }
  renderDrawer();
  updateBadge();
}

export function addItem(id, qty = 1) {
  const found = items.find((i) => i.id === id);
  if (found) found.qty += qty;
  else items.push({ id, qty });
  save();
}

export function setQty(id, qty) {
  if (qty <= 0) items = items.filter((i) => i.id !== id);
  else items.find((i) => i.id === id).qty = qty;
  save();
}

const lines = () => items.map((i) => ({ p: getProduct(i.id), qty: i.qty }));
export const count = () => items.reduce((n, i) => n + i.qty, 0);
export const total = () => lines().reduce((s, l) => s + l.p.price * l.qty, 0);

function orderText() {
  const name = document.getElementById('cart-name')?.value.trim();
  const address = document.getElementById('cart-address')?.value.trim();
  const rows = lines().map(
    (l, n) => `${n + 1}. ${l.p.name} (${l.p.unit}) x ${l.qty} = ${money(l.p.price * l.qty)}`
  );
  return [
    'Hi Kunal Exe Coffee! Mujhe ye order karna hai:',
    '',
    ...rows,
    '',
    `Total: ${money(total())}`,
    '',
    `Naam: ${name || '-'}`,
    `Address: ${address || '-'}`,
  ].join('\n');
}

export const openCart = () => document.body.classList.add('cart-open');
export const closeCart = () => document.body.classList.remove('cart-open');

function updateBadge() {
  document.querySelectorAll('.cart-count').forEach((el) => {
    const n = count();
    el.textContent = n;
    el.classList.toggle('has-items', n > 0);
  });
}

function updateLinks() {
  const wa = document.getElementById('cart-wa');
  const mail = document.getElementById('cart-mail');
  if (!wa || !mail) return;
  const empty = items.length === 0;
  wa.classList.toggle('is-disabled', empty);
  mail.classList.toggle('is-disabled', empty);
  if (empty) return;
  const text = orderText();
  wa.href = waLink(text);
  mail.href = mailLink('New order - Kunal Exe Coffee', text);
}

function renderDrawer() {
  const box = document.getElementById('cart-lines');
  if (!box) return;
  if (!items.length) {
    box.innerHTML = `<div class="cart-empty"><p>Aapka cart abhi khali hai.</p><a href="collections.html">Coffees dekhein &rarr;</a></div>`;
  } else {
    box.innerHTML = lines()
      .map(
        ({ p, qty }) => `
      <div class="cart-line">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div>
          <h4>${p.name}</h4>
          <div class="meta">${money(p.price)} / ${p.unit}</div>
          <div class="cart-qty">
            <button type="button" data-dec="${p.id}" aria-label="Kam karein">&minus;</button>
            <span>${qty}</span>
            <button type="button" data-inc="${p.id}" aria-label="Badhayein">+</button>
          </div>
        </div>
        <div>
          <div class="line-total">${money(p.price * qty)}</div>
          <button type="button" class="remove" data-remove="${p.id}">Hatayein</button>
        </div>
      </div>`
      )
      .join('');
  }
  const t = document.getElementById('cart-total');
  if (t) t.textContent = money(total());
  updateLinks();
}

function injectDrawer() {
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div class="cart-overlay" data-cart-close></div>
    <aside class="cart-drawer" aria-label="Shopping cart">
      <div class="cart-head">
        <h3>Your Cart</h3>
        <button type="button" class="cart-close" data-cart-close aria-label="Close cart">&times;</button>
      </div>
      <div class="cart-lines" id="cart-lines" data-lenis-prevent></div>
      <div class="cart-foot">
        <div class="cart-total"><span>Total</span><span id="cart-total">${money(0)}</span></div>
        <input class="cart-field" id="cart-name" type="text" placeholder="Aapka naam (optional)" autocomplete="name">
        <textarea class="cart-field" id="cart-address" rows="2" placeholder="Delivery address (optional)" autocomplete="street-address"></textarea>
        <a class="btn-wa" id="cart-wa" target="_blank" rel="noopener">Order on WhatsApp</a>
        <a class="btn-outline" id="cart-mail">Order by Email (${EMAIL})</a>
        <p class="cart-note">Order bhejne ke baad payment aur delivery ki baat WhatsApp par hogi.</p>
      </div>
    </aside>`
  );
}

export function initCart() {
  injectDrawer();
  renderDrawer();
  updateBadge();

  document.addEventListener('input', (e) => {
    if (e.target.matches('#cart-name, #cart-address')) updateLinks();
  });

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-add],[data-cart-open],[data-cart-close],[data-inc],[data-dec],[data-remove]');
    if (!t) return;
    if (t.dataset.add) {
      const qtyEl = document.getElementById('qty-value');
      addItem(t.dataset.add, qtyEl ? Number(qtyEl.textContent) || 1 : 1);
      openCart();
    } else if (t.hasAttribute('data-cart-open')) openCart();
    else if (t.hasAttribute('data-cart-close')) closeCart();
    else if (t.dataset.inc) setQty(t.dataset.inc, items.find((i) => i.id === t.dataset.inc).qty + 1);
    else if (t.dataset.dec) setQty(t.dataset.dec, items.find((i) => i.id === t.dataset.dec).qty - 1);
    else if (t.dataset.remove) setQty(t.dataset.remove, 0);
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });
  // keep multiple tabs in sync
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) { items = load(); renderDrawer(); updateBadge(); }
  });
}
