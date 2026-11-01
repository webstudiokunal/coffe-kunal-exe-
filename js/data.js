// ===================================================
//  SITE SETTINGS - yahin se number / email / products badlo
// ===================================================
export const WHATSAPP = '919793428152';          // country code + number, bina + ya space ke
export const PHONE_DISPLAY = '+91 97934 28152';
export const PHONE_TEL = '+919793428152';
export const EMAIL = 'me@kunalexe.in';

export const PRODUCTS = [
  {
    id: 'dark-espresso',
    name: 'Dark Espresso',
    price: 899,
    unit: '250g',
    badge: 'Signature Blend',
    image: 'images/product-dark-espresso.jpg',
    tagline: 'Bold, intense, unforgettable.',
    description:
      'Rich Arabica beans roasted dark for a deep, powerful cup. Made for strong espresso shots and anyone who likes their coffee with a serious kick.',
    notes: ['Dark roast', 'Arabica', 'Bold & intense'],
  },
  {
    id: 'vanilla-french',
    name: 'Vanilla French',
    price: 999,
    unit: '250g',
    badge: 'Premium Roast',
    image: 'images/product-french-vanilla.jpg',
    tagline: 'Smooth, sweet, elegant.',
    description:
      'A smooth, softly sweet roast with a gentle vanilla finish. Easy to drink black, and lovely with a little milk.',
    notes: ['Vanilla finish', 'Smooth', 'Sweet & elegant'],
  },
  {
    id: 'hazelnut-brew',
    name: 'Hazelnut Brew',
    price: 999,
    unit: '250g',
    badge: 'Seasonal',
    image: 'images/product-hazelnut-brew.jpg',
    tagline: 'Warm, nutty, comforting.',
    description:
      'A cozy seasonal blend with a warm hazelnut character. Perfect for slow mornings and cold evenings.',
    notes: ['Hazelnut', 'Seasonal', 'Warm & nutty'],
  },
];

export const money = (n) => '₹' + Number(n).toLocaleString('en-IN');

export const waLink = (text) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export const mailLink = (subject, body) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
