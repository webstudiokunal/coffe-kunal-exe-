import { waLink } from './data.js';

const articles = {
  'art-of-pour': {
    title: 'The Art of the Pour',
    category: 'Brewing Guide',
    date: 'Oct 12, 2025',
    image: 'images/story-coffee-grinding.jpg',
    content: `
      <p>There is a moment of stillness just before the water hits the grounds. The kitchen is quiet, the kettle has settled, and the whole cup is still a promise.</p>
      <h2>Consistency is Key</h2>
      <p>Why does your morning cup sometimes taste divine, and sometimes just fine? Most of the time the answer is not the beans. It is the small things we stop measuring.</p>
      <blockquote>"Measure once, pour slowly, and let the coffee do the talking."</blockquote>
      <h2>A simple starting point</h2>
      <p>Start with about 1 part coffee to 16 parts water, fresh clean water just off the boil, and a grind that feels like coarse sand. Pour in slow circles, pause, and taste. Then change only one thing at a time.</p>`,
  },
  'sourcing-sustainability': {
    title: 'Sourcing with Sustainability',
    category: 'Behind the Beans',
    date: 'Sept 28, 2025',
    image: 'images/story-plantation-landscape.jpg',
    content: `
      <p>Great coffee starts at the source, long before it reaches the roaster. It starts with the soil, the shade, and the hands that pick each cherry.</p>
      <blockquote>"Sustainability isn't a buzzword. It is how we make sure there is coffee tomorrow."</blockquote>
      <h2>From plantation to cup</h2>
      <p>Cherries are picked by hand, dried in the sun, sorted, and only then roasted. Every step takes patience, and every step shows up in the final cup.</p>`,
  },
};

const handle = new URLSearchParams(window.location.search).get('handle');
const main = document.getElementById('article-main');
const art = articles[handle];

if (art) {
  document.title = `${art.title} | Kunal Exe Coffee`;
  main.innerHTML = `
    <a class="back-link" href="blog.html">&larr; Back to Journal</a>
    <div class="article-header">
      <span class="article-category">${art.category}</span>
      <h1 class="article-title">${art.title}</h1>
      <div class="article-meta">${art.date}</div>
    </div>
    <img src="${art.image}" alt="${art.title}" class="article-image" loading="lazy">
    <article class="article-content">${art.content}</article>
    <div class="article-cta">
      <p>Ready to taste it yourself?</p>
      <a class="btn-dark" href="collections.html">Shop our coffees</a>
      <a class="btn-wa" target="_blank" rel="noopener" href="${waLink('Hi Kunal Exe Coffee! Maine aapka journal article padha, mujhe coffee order karni hai.')}">WhatsApp us</a>
    </div>`;
} else {
  main.innerHTML = `
    <div class="article-header">
      <h1 class="article-title">Article nahi mila</h1>
      <p><a href="blog.html">Journal par wapas jayein</a></p>
    </div>`;
}
