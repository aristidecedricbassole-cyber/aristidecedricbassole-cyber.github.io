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
const projects = document.querySelectorAll('.project-card');
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

/* ====================== CARROUSEL IMMERSIF ====================== */
const scStage = document.getElementById('scStage');
const scSlides = document.querySelectorAll('.sc-slide');
const scCurrent = document.getElementById('scCurrent');
const scBar = document.getElementById('scBar');
const scThumbs = document.getElementById('scThumbs');
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbCaption = document.getElementById('lbCaption');
const lbCount = document.getElementById('lbCount');

let scIndex = 0;
const AUTOPLAY_MS = 4500;

// Construire les miniatures
if (scThumbs) {
  scSlides.forEach((slide, i) => {
    const thumb = document.createElement('img');
    thumb.src = slide.src;
    thumb.alt = 'Photo ' + (i + 1);
    thumb.dataset.index = i;
    if (i === 0) thumb.classList.add('is-active');
    scThumbs.appendChild(thumb);
  });
}
const scThumbImgs = scThumbs ? Array.from(scThumbs.querySelectorAll('img')) : [];

function showSlide(index) {
  if (!scSlides.length) return;
  scIndex = (index + scSlides.length) % scSlides.length;
  scSlides.forEach((s, i) => s.classList.toggle('is-active', i === scIndex));
  scThumbImgs.forEach((t, i) => t.classList.toggle('is-active', i === scIndex));
  if (scCurrent) scCurrent.textContent = String(scIndex + 1).padStart(2, '0');
  scThumbImgs[scIndex]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  restartProgress();
}

let progressStart = performance.now();
let progressRaf = null;
function animateProgress(now) {
  if (!scBar) return;
  const elapsed = now - progressStart;
  const p = reduceMotion ? 1 : Math.min(elapsed / AUTOPLAY_MS, 1);
  scBar.style.width = (p * 100) + '%';
  if (p < 1) progressRaf = requestAnimationFrame(animateProgress);
  else nextSlide();
}
function restartProgress() {
  progressStart = performance.now();
  if (progressRaf) cancelAnimationFrame(progressRaf);
  progressRaf = requestAnimationFrame(animateProgress);
}
function nextSlide() { showSlide(scIndex + 1); }
function prevSlide() { showSlide(scIndex - 1); }

// Autoplay seulement quand le carrousel est visible
if ('IntersectionObserver' in window && scStage) {
  let playing = false;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !playing) { playing = true; restartProgress(); }
      else if (!e.isIntersecting && playing) { playing = false; if (progressRaf) cancelAnimationFrame(progressRaf); }
    });
  }, { threshold: 0.35 });
  obs.observe(scStage);
} else {
  restartProgress();
}

document.getElementById('scPrev')?.addEventListener('click', prevSlide);
document.getElementById('scNext')?.addEventListener('click', nextSlide);
scThumbImgs.forEach((t) => t.addEventListener('click', () => showSlide(Number(t.dataset.index))));
// Pause au survol
scStage?.addEventListener('pointerenter', () => { if (progressRaf) cancelAnimationFrame(progressRaf); });
scStage?.addEventListener('pointerleave', restartProgress);

/* Lightbox depuis le carrousel */
function openLightbox() {
  if (!lightbox || !scSlides.length) return;
  const slide = scSlides[scIndex];
  if (lbImage) { lbImage.src = slide.src; lbImage.alt = slide.alt; }
  const num = String(scIndex + 1).padStart(2, '0');
  if (lbCount) lbCount.textContent = num + ' / ' + String(scSlides.length).padStart(2, '0');
  if (lbCaption) lbCaption.textContent = 'SONABEL — Reportage industriel · ' + num;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lb-open');
  if (progressRaf) cancelAnimationFrame(progressRaf);
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lb-open');
  restartProgress();
}
document.getElementById('scZoom')?.addEventListener('click', openLightbox);
scStage?.addEventListener('click', (e) => { if (e.target.classList.contains('sc-slide')) openLightbox(); });
function lbNavigate(dir) {
  scIndex = (scIndex + dir + scSlides.length) % scSlides.length;
  scSlides.forEach((s, i) => s.classList.toggle('is-active', i === scIndex));
  scThumbImgs.forEach((t, i) => t.classList.toggle('is-active', i === scIndex));
  if (scCurrent) scCurrent.textContent = String(scIndex + 1).padStart(2, '0');
  const slide = scSlides[scIndex];
  if (lbImage) { lbImage.src = slide.src; lbImage.alt = slide.alt; }
  const num = String(scIndex + 1).padStart(2, '0');
  if (lbCount) lbCount.textContent = num + ' / ' + String(scSlides.length).padStart(2, '0');
  if (lbCaption) lbCaption.textContent = 'SONABEL — Reportage industriel · ' + num;
}
document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
document.getElementById('lbPrev')?.addEventListener('click', () => lbNavigate(-1));
document.getElementById('lbNext')?.addEventListener('click', () => lbNavigate(1));
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbNavigate(-1);
  if (e.key === 'ArrowRight') lbNavigate(1);
});

/* ====================== ANNÉE ====================== */
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
