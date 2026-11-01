// Tune particle counts, parallax strength, reveal delays, and steam wisps here.
const PARTICLE_COUNT = 16;
const MOBILE_PARTICLE_COUNT = 10;
const STEAM_WISP_COUNT = 6;
const DESKTOP_PARALLAX_STRENGTH = 0.08;
const MOBILE_PARALLAX_STRENGTH = 0.04;
const JOURNEY_REVEAL_STAGGER_MS = 120;
const TILT_MAX_DEGREES = 8;
const STEAM_MIN_DURATION_SECONDS = 7;
const STEAM_DURATION_STEP_SECONDS = 1.4;
const STEAM_FIRST_LEFT_PERCENT = 14;
const STEAM_LEFT_STEP_PERCENT = 14;
const STEAM_DELAY_STEP_SECONDS = 1.7;
const PARTICLE_MIN_SIZE_PX = 2;
const PARTICLE_SIZE_RANGE_PX = 3;
const PARTICLE_MIN_DURATION_SECONDS = 14;
const PARTICLE_DURATION_RANGE_SECONDS = 14;
const PARTICLE_MAX_DRIFT_PX = 35;
const PARTICLE_MAX_DELAY_SECONDS = 20;
const PARTICLE_MIN_OPACITY = 0.15;
const PARTICLE_OPACITY_RANGE = 0.25;
const JOURNEY_DRIFT_DELAY_STAGGER_SECONDS = 3;
const STORY_ZOOM_CLASSES = ['story-zoom-left', 'story-zoom-right', 'story-zoom-up'];

const journeyDrifts = [
  ['-2%', '-3%'],
  ['2%', '-2%'],
  ['-1%', '3%'],
  ['2%', '2%'],
  ['-2%', '1%'],
];

export function initEffects(lenis) {
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  requestAnimationFrame(() => {
    const hero = document.querySelector('.hero-carousel');
    const storySections = [...document.querySelectorAll('.premium-video-section')];
    const journeyItems = [...document.querySelectorAll('.journey-item')];
    const products = [...document.querySelectorAll('.product-card, .product-gallery')];
    const journalCards = [...document.querySelectorAll('.blog-card')];
    const articleImage = document.querySelector('.article-image');
    const visibleRoots = new Set();
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) visibleRoots.add(target);
            else visibleRoots.delete(target);
            target.classList.toggle('effects-in-view', isIntersecting && !document.hidden);
            if (target.classList.contains('journey-item') && isIntersecting) {
              target.classList.add('is-revealed');
            }
          });
        }, { rootMargin: '100px 0px', threshold: 0.01 })
      : null;

    if (articleImage) {
      const frame = document.createElement('span');
      frame.className = 'article-image-frame';
      articleImage.replaceWith(frame);
      frame.append(articleImage);
      observeRoot(frame);
    }

    if (hero) addHeroEffects(hero, observeRoot);
    storySections.forEach((section, index) => addStoryEffects(section, index, observeRoot));
    journeyItems.forEach((item, index) => addJourneyEffects(item, index, observeRoot));
    products.forEach((root) => addProductEffects(root, observeRoot));
    journalCards.forEach((card) => observeRoot(card, observer));

    const reflectionSupported = window.CSS && CSS.supports(
      '-webkit-box-reflect',
      'below 4px linear-gradient(transparent, transparent)'
    );
    if (!reflectionSupported) addReflectionFallbacks();

    if (window.matchMedia('(min-width: 769px)').matches) {
      document.querySelectorAll('.premium-video-section, .journey').forEach(addCursorSpotlight);
      document.querySelectorAll('.product-card').forEach(addTilt);
    }

    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', scheduleParallax);
    } else {
      window.addEventListener('scroll', scheduleParallax, { passive: true });
    }
    window.addEventListener('resize', scheduleParallax, { passive: true });

    document.addEventListener('visibilitychange', () => {
      visibleRoots.forEach((root) => {
        root.classList.toggle('effects-in-view', !document.hidden);
      });
    });

    function scheduleParallax() {
      if (scheduleParallax.pending) return;
      scheduleParallax.pending = true;
      requestAnimationFrame(() => {
        scheduleParallax.pending = false;
        const strength = window.matchMedia('(max-width: 768px)').matches
          ? MOBILE_PARALLAX_STRENGTH
          : DESKTOP_PARALLAX_STRENGTH;
        document.querySelectorAll('.premium-video-section.effects-in-view, .journey-item.effects-in-view')
          .forEach((section) => {
            const image = section.querySelector('.premium-video-bg, img');
            if (!image) return;
            const bounds = section.getBoundingClientRect();
            const midpoint = bounds.top + bounds.height / 2;
            const range = (window.innerHeight + bounds.height) / 2;
            const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - midpoint) / range));
            image.style.setProperty('--parallax-y', `${progress * bounds.height * strength}px`);
          });
      });
    }

    function observeRoot(element, instance = observer) {
      if (instance) instance.observe(element);
      else {
        element.classList.add('effects-in-view');
        if (element.classList.contains('journey-item')) element.classList.add('is-revealed');
      }
    }
  });
}

function addHeroEffects(hero, observeRoot) {
  const layer = document.createElement('div');
  layer.className = 'hero-effects';
  layer.setAttribute('aria-hidden', 'true');
  const glint = document.createElement('span');
  glint.className = 'hero-lens-glint';
  layer.append(glint);
  hero.append(layer);
  observeRoot(hero);

  let particleCount = 0;
  const syncParticles = () => {
    const count = window.matchMedia('(max-width: 768px)').matches
      ? MOBILE_PARTICLE_COUNT
      : PARTICLE_COUNT;
    if (count === particleCount) return;
    layer.querySelectorAll('.hero-particle').forEach((particle) => particle.remove());
    particleCount = count;

    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement('span');
      particle.className = 'hero-particle';
      particle.style.setProperty(
        '--particle-size',
        `${PARTICLE_MIN_SIZE_PX + Math.random() * PARTICLE_SIZE_RANGE_PX}px`
      );
      particle.style.setProperty('--particle-left', `${Math.random() * 100}%`);
      particle.style.setProperty('--particle-delay', `${-Math.random() * PARTICLE_MAX_DELAY_SECONDS}s`);
      particle.style.setProperty(
        '--particle-duration',
        `${PARTICLE_MIN_DURATION_SECONDS + Math.random() * PARTICLE_DURATION_RANGE_SECONDS}s`
      );
      particle.style.setProperty(
        '--particle-drift',
        `${-PARTICLE_MAX_DRIFT_PX + Math.random() * PARTICLE_MAX_DRIFT_PX * 2}px`
      );
      particle.style.setProperty(
        '--particle-opacity',
        `${PARTICLE_MIN_OPACITY + Math.random() * PARTICLE_OPACITY_RANGE}`
      );
      layer.insertBefore(particle, glint);
    }
  };
  syncParticles();
  window.addEventListener('resize', syncParticles, { passive: true });
}

function addStoryEffects(section, index, observeRoot) {
  const image = section.querySelector('.premium-video-bg');
  const content = section.querySelector('.premium-content');
  if (!image || !content) return;

  image.classList.add(STORY_ZOOM_CLASSES[index % STORY_ZOOM_CLASSES.length]);
  section.classList.add('story-effects');

  const lightLeak = document.createElement('span');
  lightLeak.className = 'story-light-leak';
  lightLeak.setAttribute('aria-hidden', 'true');
  section.insertBefore(lightLeak, content);

  if (index === 0 || index === 2) {
    const steam = document.createElement('span');
    steam.className = 'story-steam';
    steam.setAttribute('aria-hidden', 'true');
    for (let wispIndex = 0; wispIndex < STEAM_WISP_COUNT; wispIndex += 1) {
      const wisp = document.createElement('span');
      wisp.className = 'steam-wisp';
      wisp.style.setProperty(
        '--steam-left',
        `${STEAM_FIRST_LEFT_PERCENT + wispIndex * STEAM_LEFT_STEP_PERCENT}%`
      );
      wisp.style.setProperty('--steam-delay', `${-wispIndex * STEAM_DELAY_STEP_SECONDS}s`);
      wisp.style.setProperty(
        '--steam-duration',
        `${STEAM_MIN_DURATION_SECONDS + wispIndex * STEAM_DURATION_STEP_SECONDS}s`
      );
      steam.append(wisp);
    }
    section.insertBefore(steam, content);
  }

  observeRoot(section);
}

function addJourneyEffects(item, index, observeRoot) {
  const image = item.querySelector('img');
  if (!image) return;

  image.style.setProperty('--journey-x', journeyDrifts[index % journeyDrifts.length][0]);
  image.style.setProperty('--journey-y', journeyDrifts[index % journeyDrifts.length][1]);
  image.style.setProperty('--journey-delay', `${-index * JOURNEY_DRIFT_DELAY_STAGGER_SECONDS}s`);
  item.style.setProperty('--journey-reveal-delay', `${index * JOURNEY_REVEAL_STAGGER_MS}ms`);

  const glint = document.createElement('span');
  glint.className = 'journey-glint';
  glint.setAttribute('aria-hidden', 'true');
  item.append(glint);
  observeRoot(item);
}

function addProductEffects(root, observeRoot) {
  observeRoot(root);
  root.querySelectorAll('.product-card__image-wrapper img, .product-gallery img').forEach((image) => {
    image.classList.add('pack-image');
    const clip = document.createElement('span');
    clip.className = 'product-image-clip';
    image.replaceWith(clip);
    clip.append(image);
  });
}

function addReflectionFallbacks() {
  document.querySelectorAll('.products-section .product-card__image-wrapper, .product-gallery')
    .forEach((frame) => {
      const image = frame.querySelector('img');
      if (!image) return;
      const reflection = document.createElement('span');
      reflection.className = 'product-reflection';
      reflection.setAttribute('aria-hidden', 'true');
      const mirror = image.cloneNode(false);
      mirror.removeAttribute('alt');
      mirror.setAttribute('loading', 'lazy');
      mirror.className = 'product-reflection-image';
      reflection.append(mirror);
      frame.append(reflection);
    });
}

function addTilt(card) {
  if (!card.matches('.product-card')) return;
  card.classList.add('effects-tilt');
  card.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty('--tilt-x', `${(0.5 - y) * TILT_MAX_DEGREES}deg`);
    card.style.setProperty('--tilt-y', `${(x - 0.5) * TILT_MAX_DEGREES}deg`);
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  });
}

function addCursorSpotlight(section) {
  section.classList.add('cursor-spotlight-target');
  const spotlight = document.createElement('span');
  spotlight.className = 'cursor-spotlight';
  spotlight.setAttribute('aria-hidden', 'true');
  section.append(spotlight);
  section.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = section.getBoundingClientRect();
    spotlight.style.transform =
      `translate3d(${event.clientX - bounds.left - 150}px, ${event.clientY - bounds.top - 150}px, 0)`;
    section.classList.add('cursor-active');
  });
  section.addEventListener('pointerleave', () => section.classList.remove('cursor-active'));
}
