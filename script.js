/* =========================================================
   Portfolio — Aristide Cédric Bassolé
   Motion system : loader, overlay, split-text, parallaxe,
   filtres, accordéon, carrousel, curseur
   ========================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ====================== LOADER ====================== */
const loader = document.getElementById('loader');
const loaderNum = document.getElementById('loaderNum');
const loaderBar = document.getElementById('loaderBar');
const alreadyLoaded = sessionStorage.getItem('ac-loaded') === '1';

function finishLoading() {
  document.body.classList.remove('is-loading');
  document.body.classList.add('loaded');
  sessionStorage.setItem('ac-loaded', '1');
  if (loader) setTimeout(() => { loader.style.display = 'none'; }, 1100);
}

if (loader && !reduceMotion && !alreadyLoaded) {
  const start = performance.now();
  const duration = 1150;
  const tick = (now) => {
    const p = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    if (loaderNum) loaderNum.textContent = String(Math.round(eased * 100)).padStart(2, '0');
    if (loaderBar) loaderBar.style.width = `${eased * 100}%`;
    if (p < 1) requestAnimationFrame(tick);
    else finishLoading();
  };
  requestAnimationFrame(tick);
} else {
  finishLoading();
}

/* ====================== SPLIT TEXT ====================== */
function splitWords(element) {
  const words = [];
  const walk = (node, target) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (/^\s+$/.test(part)) target.appendChild(document.createTextNode(part));
          else if (part.length) {
            const wrap = document.createElement('span');
            wrap.className = 'w';
            const inner = document.createElement('span');
            inner.className = 'wi';
            inner.textContent = part;
            wrap.appendChild(inner);
            target.appendChild(wrap);
            words.push(inner);
          }
        });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const clone = child.cloneNode(false);
        target.appendChild(clone);
        walk(child, clone);
      }
    });
  };
  const fragment = document.createDocumentFragment();
  walk(element, fragment);
  element.textContent = '';
  element.appendChild(fragment);
  words.forEach((word, i) => word.style.setProperty('--d', `${i * 0.05}s`));
}

if (!reduceMotion) {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) splitWords(heroTitle);
  document.querySelectorAll('[data-split]').forEach((h) => splitWords(h));
}

/* ====================== OVERLAY MENU ====================== */
const burger = document.getElementById('burger');
const overlay = document.getElementById('overlay');
const overlayClose = document.getElementById('overlayClose');
const overlayLinks = document.querySelectorAll('.overlay-list a');
const previewImgs = document.querySelectorAll('.op-img');
const opCaption = document.getElementById('opCaption');

function openMenu() {
  document.body.classList.add('menu-open');
  if (burger) { burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Fermer le menu'); }
  if (overlay) overlay.setAttribute('aria-hidden', 'false');
}
function closeMenu() {
  document.body.classList.remove('menu-open');
  if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Ouvrir le menu'); }
  if (overlay) overlay.setAttribute('aria-hidden', 'true');
}

if (burger) burger.addEventListener('click', () => {
  document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
});
if (overlayClose) overlayClose.addEventListener('click', closeMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
});

overlayLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) setTimeout(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 420);
  });
  link.addEventListener('pointerenter', () => {
    const key = link.dataset.preview;
    previewImgs.forEach((img) => img.classList.toggle('is-active', img.dataset.key === key));
    if (opCaption) opCaption.textContent = link.querySelector('.ol-text').textContent.toUpperCase();
  });
});

/* ====================== RÉVÉLATIONS ====================== */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, [data-split]').forEach((el, i) => {
    el.style.setProperty('--d', `${(i % 5) * 0.07}s`);
    io.observe(el);
  });
} else {
  document.querySelectorAll('.reveal, [data-split]').forEach((el) => el.classList.add('in-view'));
}

/* Sécurité : aucun contenu ne reste masqué si l'observateur n'a pas pu se déclencher */
setTimeout(() => {
  document.querySelectorAll('.reveal, [data-split]').forEach((el) => el.classList.add('in-view'));
}, 5000);

/* ====================== SCROLL ====================== */
const header = document.querySelector('.header');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const labeledSections = Array.from(document.querySelectorAll('[data-label]'));
const heroImage = document.querySelector('.hero-image img');
const cardMedias = document.querySelectorAll('.card-media');
const timeline = document.getElementById('timeline');
let ticking = false;

function updateScroll() {
  const y = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (progressFill) progressFill.style.setProperty('--p', String(docHeight > 0 ? clamp(y / docHeight, 0, 1) : 0));
  if (header) header.classList.toggle('scrolled', y > 40);

  let active = labeledSections[0]?.dataset.label || '';
  labeledSections.forEach((s) => { if (y >= s.offsetTop - 180) active = s.dataset.label; });
  if (progressLabel) progressLabel.textContent = active;

  if (!reduceMotion) {
    if (heroImage) heroImage.style.setProperty('--py', `${clamp(y * 0.09, 0, 70)}px`);
    cardMedias.forEach((media) => {
      const rect = media.getBoundingClientRect();
      if (rect.bottom > -100 && rect.top < window.innerHeight + 100) {
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        media.style.setProperty('--py', `${clamp(-offset * 20, -20, 20)}px`);
      }
    });
    if (timeline) {
      const start = timeline.offsetTop - window.innerHeight * 0.7;
      const end = timeline.offsetTop + timeline.offsetHeight - window.innerHeight * 0.4;
      timeline.style.setProperty('--progress', String(clamp((y - start) / Math.max(end - start, 1), 0, 1)));
    }
  }
  ticking = false;
}
function requestScroll() {
  if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
}
window.addEventListener('scroll', requestScroll, { passive: true });
window.addEventListener('resize', requestScroll, { passive: true });
updateScroll();

/* ====================== CURSEUR ====================== */
const cursor = document.getElementById('cursor');
if (cursor && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  let mx = -100, my = -100, cx = -100, cy = -100;
  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.opacity = '1';
    cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .work-card, .filter'));
  });
  window.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
  const follow = () => {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(follow);
  };
  follow();
}

/* ====================== FILTRES ====================== */
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.work-card');
filters.forEach((button) => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach((b) => b.classList.toggle('is-active', b === button));
  cards.forEach((card) => {
    const match = filter === 'all' || card.dataset.cat === filter;
    if (match) {
      card.classList.remove('is-hidden');
      requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('is-out')));
    } else {
      card.classList.add('is-out');
      setTimeout(() => { if (card.classList.contains('is-out')) card.classList.add('is-hidden'); }, 460);
    }
  });
}));

/* ====================== ACCORDÉON ====================== */
const accItems = document.querySelectorAll('.acc-item');
accItems.forEach((item) => {
  const trigger = item.querySelector('.acc-trigger');
  trigger.addEventListener('click', () => {
    const wasOpen = item.classList.contains('is-open');
    accItems.forEach((i) => {
      i.classList.remove('is-open');
      i.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ====================== CARROUSEL TÉMOIGNAGES ====================== */
const quotesTrack = document.getElementById('quotesTrack');
const qCurrent = document.getElementById('qCurrent');
const quoteCards = document.querySelectorAll('.quote-card');
let quoteIndex = 0;
function showQuote(index) {
  quoteIndex = (index + quoteCards.length) % quoteCards.length;
  if (quotesTrack) quotesTrack.style.transform = `translateX(-${quoteIndex * 100}%)`;
  if (qCurrent) qCurrent.textContent = String(quoteIndex + 1).padStart(2, '0');
}
document.querySelector('.q-next')?.addEventListener('click', () => showQuote(quoteIndex + 1));
document.querySelector('.q-prev')?.addEventListener('click', () => showQuote(quoteIndex - 1));

/* ====================== COMPTEURS ====================== */
function animateCount(el) {
  const target = Number(el.dataset.count) || 0;
  const suffix = el.dataset.suffix || '';
  const pad = Number(el.dataset.pad || 0);
  const format = (n) => String(n).padStart(pad, '0') + suffix;
  if (reduceMotion) { el.textContent = format(target); return; }
  const start = performance.now();
  const duration = 1600;
  const frame = (now) => {
    const t = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = format(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = format(target);
  };
  requestAnimationFrame(frame);
}
document.querySelectorAll('[data-count]').forEach(animateCount);

/* ====================== BOUTONS MAGNÉTIQUES ====================== */
if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.transform = `translate3d(${(e.clientX - rect.left - rect.width / 2) * 0.12}px, ${(e.clientY - rect.top - rect.height / 2) * 0.16}px, 0)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ====================== ANNÉE ====================== */
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
