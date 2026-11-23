/* =========================================================
   Portfolio — Aristide Cédric Bassolé
   Motion design professionnel + interactions
   ========================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ====================== LOADER ====================== */
const loader = document.getElementById('loader');
const loaderNum = document.getElementById('loaderNum');
const loaderBar = document.getElementById('loaderBar');

function finishLoading() {
  document.body.classList.remove('is-loading');
  document.body.classList.add('loaded');
}

if (loader && !reduceMotion) {
  const start = performance.now();
  const duration = 1500;
  const tick = (now) => {
    const p = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    if (loaderNum) loaderNum.textContent = String(Math.round(eased * 100)).padStart(2, '0');
    if (loaderBar) loaderBar.style.width = (eased * 100) + '%';
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
  words.forEach((word, i) => word.style.setProperty('--d', (i * 0.055) + 's'));
  return words;
}

if (!reduceMotion) {
  document.querySelectorAll('[data-split]').forEach((h) => splitWords(h));
}

/* ====================== THEME ====================== */
const themeBtn = document.getElementById('themeBtn');
const storedTheme = localStorage.getItem('ac-theme');
if (storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);
if (themeBtn) themeBtn.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ac-theme', next);
});

/* ====================== CLOCK ====================== */
function updateClocks() {
  const now = new Date();
  const t = String(now.getUTCHours()).padStart(2, '0') + ':' + String(now.getUTCMinutes()).padStart(2, '0');
  ['clock', 'clock2', 'clock3', 'clock4'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t;
  });
}
updateClocks();
setInterval(updateClocks, 30000);

/* ====================== MOBILE NAV ====================== */
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

/* ====================== SEARCH ====================== */
const searchOverlay = document.getElementById('searchOverlay');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchLinks = searchResults ? Array.from(searchResults.querySelectorAll('a')) : [];

function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add('open');
  searchOverlay.setAttribute('aria-hidden', 'false');
  if (searchInput) { searchInput.value = ''; filterSearch(''); setTimeout(() => searchInput.focus(), 60); }
}
function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('open');
  searchOverlay.setAttribute('aria-hidden', 'true');
}
if (searchBtn) searchBtn.addEventListener('click', openSearch);
if (searchOverlay) searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });

function filterSearch(q) {
  q = q.trim().toLowerCase();
  let shown = 0;
  searchLinks.forEach((a) => {
    const match = !q || a.textContent.toLowerCase().includes(q);
    a.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  const hint = searchResults?.querySelector('.search-hint');
  if (hint) hint.style.display = q ? 'none' : '';
  let empty = searchResults?.querySelector('.search-empty');
  if (!shown && q) {
    if (!empty) { empty = document.createElement('p'); empty.className = 'search-empty'; searchResults.appendChild(empty); }
    empty.textContent = 'Aucun résultat pour « ' + q + ' »';
  } else if (empty) empty.remove();
}
if (searchInput) searchInput.addEventListener('input', (e) => filterSearch(e.target.value));

document.addEventListener('keydown', (e) => {
  const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '');
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
  if (e.key === '/' && !typing) { e.preventDefault(); openSearch(); return; }
  if (e.key === 'Escape') { closeSearch(); return; }
});

/* ====================== REVEALS ====================== */
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal, [data-split]').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.06 + 's';
    io.observe(el);
  });
} else {
  document.querySelectorAll('.reveal, [data-split]').forEach((el) => el.classList.add('in-view'));
}
setTimeout(() => document.querySelectorAll('.reveal, [data-split]').forEach((el) => el.classList.add('in-view')), 3000);

/* ====================== SCROLL : progression + parallaxe + nav ====================== */
const header = document.querySelector('.header');
const progress = document.getElementById('scrollProgress');
const navLinks = Array.from(document.querySelectorAll('.nav a'));
const sections = Array.from(document.querySelectorAll('section[id]'));
const parallaxEl = document.querySelector('[data-parallax]');
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.setProperty('--p', String(docH > 0 ? clamp(y / docH, 0, 1) : 0));
  if (header) header.classList.toggle('scrolled', y > 10);

  let current = '';
  sections.forEach((s) => { if (y >= s.offsetTop - 160) current = s.id; });
  navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

  if (!reduceMotion && parallaxEl) {
    parallaxEl.style.setProperty('--py', clamp(y * 0.06, 0, 40) + 'px');
  }
  ticking = false;
}
function requestScroll() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
window.addEventListener('scroll', requestScroll, { passive: true });
window.addEventListener('resize', requestScroll, { passive: true });
onScroll();

/* ====================== CURSEUR ====================== */
const cursor = document.getElementById('cursor');
if (cursor && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  let mx = -100, my = -100, cx = -100, cy = -100;
  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.opacity = '1';
    cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .result-card, .skill-card, .pf, .project-card'));
  });
  document.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
  const follow = () => {
    cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
    cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
    requestAnimationFrame(follow);
  };
  follow();
}

/* ====================== FILTRES ====================== */
const filters = document.querySelectorAll('.pf');
const projects = document.querySelectorAll('#projectGrid > article');
filters.forEach((btn) => btn.addEventListener('click', () => {
  filters.forEach((b) => b.classList.toggle('is-active', b === btn));
  const f = btn.dataset.filter;
  projects.forEach((p) => p.classList.toggle('is-hidden', !(f === 'all' || p.dataset.cat === f)));
}));

/* ====================== FORMULAIRE ====================== */
const CONTACT_EMAIL = 'aristidecedricbassole@gmail.com';
const form = document.getElementById('contactForm');
if (form) form.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = document.getElementById('cf-type')?.value || 'Projet';
  const name = document.getElementById('cf-name')?.value.trim() || '';
  const email = document.getElementById('cf-email')?.value.trim() || '';
  const message = document.getElementById('cf-message')?.value.trim() || '';
  const body = ['Nom : ' + name, 'E-mail : ' + email, 'Type : ' + type, '', message].join('\n');
  window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('[Portfolio] ' + type) + '&body=' + encodeURIComponent(body);
});

/* ====================== GALERIES PHOTO ====================== */
const SELECTION = [
  { src: 'assets/galerie/ceremonie-officielle.jpg', ar: 1.5, cat: 'Institutionnel', caption: 'Cérémonie officielle · Ouagadougou', alt: 'Cérémonie officielle — reportage institutionnel' },
  { src: 'assets/galerie/portrait-beaute.jpg', ar: 0.67, cat: 'Studio', caption: 'Portrait beauté · direction artistique', alt: 'Portrait studio beauté' },
  { src: 'assets/galerie/grand-rassemblement.jpg', ar: 1.78, cat: 'Drone', caption: 'Grand rassemblement · vue aérienne', alt: 'Grand rassemblement filmé par drone' },
  { src: 'assets/galerie/live-sur-scene.jpg', ar: 0.89, cat: 'Concert', caption: 'Live sur scène · festival', alt: 'Artiste en concert sur scène' },
  { src: 'assets/galerie/ceremonie-promotion.jpg', ar: 1.5, cat: 'Institutionnel', caption: 'Cérémonie de promotion · armée', alt: 'Cérémonie de promotion militaire' },
  { src: 'assets/galerie/details-ceremonie.jpg', ar: 0.67, cat: 'Mariage', caption: 'Détails de cérémonie · mariage', alt: 'Détails de décoration de mariage' },
  { src: 'assets/galerie/mariage-vu-du-ciel.jpg', ar: 1.33, cat: 'Drone', caption: 'Mariée · vue du ciel', alt: 'Mariée photographiée par drone' },
  { src: 'assets/galerie/mode-direction.jpg', ar: 0.69, cat: 'Studio', caption: 'Mode & direction artistique', alt: 'Portrait mode en studio' },
  { src: 'assets/galerie/scene-et-lumieres.jpg', ar: 1.78, cat: 'Concert', caption: 'Scène & lumières · concert', alt: 'Scène de concert et jeux de lumières' },
  { src: 'assets/galerie/tenue-traditionnelle.jpg', ar: 0.7, cat: 'Culture', caption: 'Tenue traditionnelle · portrait', alt: 'Femme en tenue traditionnelle burkinabè' },
  { src: 'assets/galerie/forces-de-defense.jpg', ar: 0.67, cat: 'Portrait', caption: 'Forces de défense · portrait', alt: 'Portrait d’un membre des forces de défense' },
  { src: 'assets/galerie/couple-traditionnel.jpg', ar: 0.68, cat: 'Culture', caption: 'Couple en tenue traditionnelle', alt: 'Couple en tenue traditionnelle' }
];

const FILO = [
  { src: 'assets/filo/01-relations-publiques.jpg', ar: 0.71, cat: 'Bookcamp FILO', caption: 'Relations Publiques en Afrique', alt: 'Participante présentant l’ouvrage « Relations Publiques en Afrique »' },
  { src: 'assets/filo/02-lecture.jpg', ar: 0.67, cat: 'Bookcamp FILO', caption: 'Lecture · gros plan', alt: 'Lecture d’un ouvrage, gros plan sur les pages' },
  { src: 'assets/filo/03-prise-de-notes.jpg', ar: 1.5, cat: 'Bookcamp FILO', caption: 'Prise de notes · atelier', alt: 'Participant prenant des notes pendant un atelier' },
  { src: 'assets/filo/04-partage-de-livres.jpg', ar: 0.67, cat: 'Bookcamp FILO', caption: 'Partage de livres', alt: 'Mains échangeant une pile de livres' },
  { src: 'assets/filo/05-lecture-en-plein-air.jpg', ar: 0.67, cat: 'Bookcamp FILO', caption: 'Lecture en plein air', alt: 'Homme lisant allongé dans l’herbe' },
  { src: 'assets/filo/06-lecture-au-parc.jpg', ar: 0.67, cat: 'Bookcamp FILO', caption: 'Lecture au parc · noir & blanc', alt: 'Femme lisant sur une balançoire, en noir et blanc' }
];

const pad2 = (n) => String(n).padStart(2, '0');

/* ====================== LIGHTBOX ====================== */
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbCaption = document.getElementById('lbCaption');
const lbCount = document.getElementById('lbCount');
let lbGallery = null;
let lbIndex = 0;

function paintLightbox() {
  if (!lbGallery) return;
  const item = lbGallery.items[lbIndex];
  if (lbImage) { lbImage.src = item.src; lbImage.alt = item.alt; }
  if (lbCaption) lbCaption.textContent = (item.cat ? item.cat + ' — ' : '') + item.caption;
  if (lbCount) lbCount.textContent = pad2(lbIndex + 1) + ' / ' + pad2(lbGallery.items.length);
}

function openLightbox(gallery, i) {
  if (!lightbox || !gallery) return;
  lbGallery = gallery;
  lbIndex = (i + gallery.items.length) % gallery.items.length;
  paintLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lb-open');
  gallery.pause();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lb-open');
  lbGallery?.restart();
}

function lbStep(dir) {
  if (!lbGallery) return;
  lbIndex = (lbIndex + dir + lbGallery.items.length) % lbGallery.items.length;
  lbGallery.go(lbIndex);
  lbGallery.pause();
  paintLightbox();
}

document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
document.getElementById('lbPrev')?.addEventListener('click', () => lbStep(-1));
document.getElementById('lbNext')?.addEventListener('click', () => lbStep(1));
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lbStep(1);
  if (e.key === 'ArrowLeft') lbStep(-1);
});

/* ====================== MOTEUR DE GALERIE ====================== */
function createGallery(root, items, options = {}) {
  if (!root || !items.length) return null;
  const q = (sel) => root.querySelector(sel);
  const stage = q('[data-stage]');
  const image = q('[data-image]');
  const backdrop = q('[data-backdrop]');
  const catEl = q('[data-cat]');
  const captionEl = q('[data-caption]');
  const countEl = q('[data-count]');
  const totalEl = q('[data-total]');
  const dotsEl = q('[data-dots]');
  const barEl = q('[data-bar]');
  const DELAY = options.delay || 6500;
  const state = { index: 0, playing: false, hover: false, raf: null, start: 0, fade: 0 };
  let dotBtns = [];

  if (totalEl) totalEl.textContent = pad2(items.length);

  if (dotsEl) {
    items.forEach((item, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Photo ' + (i + 1) + ' : ' + item.caption);
      b.addEventListener('click', () => go(i));
      dotsEl.appendChild(b);
    });
    dotBtns = Array.from(dotsEl.children);
  }

  function paint(i) {
    const item = items[i];
    image.src = item.src;
    image.alt = item.alt;
    backdrop.style.backgroundImage = 'url("' + item.src + '")';
    if (catEl && item.cat) catEl.textContent = item.cat;
    if (captionEl) captionEl.textContent = item.caption;
    if (countEl) countEl.textContent = pad2(i + 1);
    if (stage) {
      const mobile = window.innerWidth <= 640;
      stage.style.height = item.ar < 1
        ? (mobile ? 'clamp(320px, 62vh, 560px)' : 'clamp(420px, 68vh, 720px)')
        : (mobile ? 'clamp(240px, 44vh, 420px)' : 'clamp(320px, 54vh, 600px)');
    }
    dotBtns.forEach((d, k) => {
      d.classList.toggle('is-active', k === i);
      if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
  }

  function go(i) {
    state.index = (i + items.length) % items.length;
    clearTimeout(state.fade);
    if (reduceMotion) { paint(state.index); restart(); return; }
    image.classList.add('is-changing');
    state.fade = setTimeout(() => {
      paint(state.index);
      requestAnimationFrame(() => image.classList.remove('is-changing'));
    }, 170);
    restart();
  }

  const next = () => go(state.index + 1);
  const prev = () => go(state.index - 1);

  function tick(now) {
    if (!barEl) return;
    const progress = Math.min((now - state.start) / DELAY, 1);
    barEl.style.width = (progress * 100) + '%';
    if (progress < 1) state.raf = requestAnimationFrame(tick);
    else next();
  }
  function restart() {
    if (state.raf) cancelAnimationFrame(state.raf);
    state.start = performance.now();
    if (barEl) barEl.style.width = '0%';
    if (state.playing && !state.hover && !reduceMotion) state.raf = requestAnimationFrame(tick);
  }
  function pause() { if (state.raf) cancelAnimationFrame(state.raf); }

  if (stage && image) {
    paint(0);
    image.addEventListener('load', () => {
      [state.index + 1, state.index + 2].forEach((k) => {
        const preload = new Image();
        preload.src = items[k % items.length].src;
      });
    });

    q('[data-next]')?.addEventListener('click', (e) => { e.stopPropagation(); next(); });
    q('[data-prev]')?.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
    q('[data-zoom]')?.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(gallery, state.index); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !state.playing) { state.playing = true; restart(); }
          else if (!entry.isIntersecting && state.playing) { state.playing = false; pause(); }
        });
      }, { threshold: 0.3 }).observe(stage);
    } else {
      state.playing = true;
      restart();
    }

    stage.addEventListener('pointerenter', () => { state.hover = true; pause(); });
    stage.addEventListener('pointerleave', () => { state.hover = false; restart(); });
    stage.addEventListener('focusin', () => { state.hover = true; pause(); });
    stage.addEventListener('focusout', () => { state.hover = false; restart(); });

    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(gallery, state.index); }
    });

    let startX = 0, startY = 0, dragging = false, swiped = false;
    stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.pg-nav, .pg-zoom')) return;
      startX = e.clientX; startY = e.clientY; dragging = true; swiped = false;
    });
    stage.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        swiped = true;
        if (dx < 0) next(); else prev();
      }
    });
    stage.addEventListener('pointercancel', () => { dragging = false; });
    stage.addEventListener('click', (e) => {
      if (swiped) { swiped = false; return; }
      if (e.target.closest('.pg-nav, .pg-zoom')) return;
      openLightbox(gallery, state.index);
    });
  }

  const gallery = {
    items, next, prev, go, pause, restart,
    get index() { return state.index; }
  };
  return gallery;
}

const selectionGallery = createGallery(document.querySelector('[data-gallery="selection"]'), SELECTION);
const filoGallery = createGallery(document.querySelector('[data-gallery="filo"]'), FILO, { delay: 7000 });

/* ====================== ANNÉE ====================== */
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
