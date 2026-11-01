// Shared on every page: navigation, footer, cart drawer, product cards.
import { PHONE_DISPLAY, PHONE_TEL, EMAIL, waLink } from './data.js';
import { initCart } from './cart.js';
import { renderProductCards } from './cards.js';
import { initEffects } from './effects.js';

const page = document.body.dataset.page;
const active = (name) => (page === name ? ' active' : '');

const nav = `
<nav class="nav-container">
  <a href="index.html" class="logo">Kunal Exe Coffee</a>
  <div class="nav-links">
    <a href="index.html" class="nav-link${active('home')}">Home</a>
    <a href="collections.html" class="nav-link${active('shop')}">Shop</a>
    <a href="blog.html" class="nav-link${active('journal')}">Journal</a>
  </div>
  <button type="button" class="cart-btn" data-cart-open aria-label="Open cart">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 20a1 1 0 100 2 1 1 0 000-2zm9 0a1 1 0 100 2 1 1 0 000-2zM1 1h2.79l1.9 15h13.1l1.2-11H5.25"/></svg>
    <span class="cart-count">0</span>
  </button>
</nav>`;

const chatText = 'Hi Kunal Exe Coffee! Mujhe aapki coffee ke baare mein puchna hai.';
const footer = `
<footer class="big-footer">
  <div class="footer-top">
    <div class="footer-col"><h4>Services</h4>
      <a href="${waLink('Hi! Mujhe wholesale coffee ke baare mein puchna hai.')}" target="_blank" rel="noopener">Wholesale</a>
      <a href="${waLink('Hi! Mujhe coffee subscription ke baare mein puchna hai.')}" target="_blank" rel="noopener">Subscriptions</a>
    </div>
    <div class="footer-col"><h4>Contact</h4>
      <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a>
      <a href="mailto:${EMAIL}">${EMAIL}</a>
    </div>
    <div class="footer-col"><h4>Connect</h4>
      <a href="${waLink(chatText)}" target="_blank" rel="noopener">WhatsApp</a>
      <a href="mailto:${EMAIL}">Email</a>
    </div>
    <div class="footer-col"><h4>Payment</h4>
      <div class="payment-icons"><span>Details on WhatsApp</span></div>
    </div>
  </div>
  <div class="footer-brand-title">KUNAL EXE</div>
  <div class="footer-bottom">
    <a class="chat-btn" href="${waLink(chatText)}" target="_blank" rel="noopener" style="text-decoration:none">Chat with us</a>
  </div>
</footer>`;

document.body.insertAdjacentHTML('afterbegin', nav);
document.body.insertAdjacentHTML('beforeend', footer);
initCart();
renderProductCards();

// Smooth scroll (Lenis is loaded from CDN on the home page)
let lenis;
if (window.Lenis) {
  lenis = new window.Lenis();
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

initEffects(lenis);
