/* =========================================================
   Portfolio — Aristide Cédric Bassolé
   Style ibrahimdayende.me : recherche, thème, horloge, filtres, reveals
   ========================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- THEME ---------------- */
const themeBtn = document.getElementById('themeBtn');
const storedTheme = localStorage.getItem('ac-theme');
if (storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ac-theme', next);
  });
}

/* ---------------- CLOCK (GMT) ---------------- */
function updateClocks() {
  const now = new Date();
  const time = String(now.getUTCHours()).padStart(2, '0') + ':' + String(now.getUTCMinutes()).padStart(2, '0');
  ['clock', 'clock2', 'clock3', 'clock4'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = time;
  });
}
updateClocks();
setInterval(updateClocks, 30000);

/* ---------------- MOBILE NAV ---------------- */
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

/* ---------------- SEARCH (⌘K / /) ---------------- */
const searchOverlay = document.getElementById('searchOverlay');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchHint = searchResults?.querySelector('.search-hint');
const searchLinks = Array.from(searchResults?.querySelectorAll('a') || []);

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

function filterSearch(query) {
  const q = query.trim().toLowerCase();
  let shown = 0;
  searchLinks.forEach((link) => {
    const text = link.textContent.toLowerCase();
    const match = !q || text.includes(q);
    link.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  if (searchHint) searchHint.style.display = q ? 'none' : '';
  let empty = searchResults?.querySelector('.search-empty');
  if (!shown && q) {
    if (!empty) {
      empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'Aucun résultat pour « ' + query + ' »';
      searchResults.appendChild(empty);
    }
  } else if (empty) { empty.remove(); }
}
if (searchInput) searchInput.addEventListener('input', (e) => filterSearch(e.target.value));

document.addEventListener('keydown', (e) => {
  const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '');
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
  if (e.key === '/' && !typing) { e.preventDefault(); openSearch(); return; }
  if (e.key === 'Escape') { closeSearch(); return; }
});

/* ---------------- REVEALS ---------------- */
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 0.06 + 's'; io.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
}
setTimeout(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view')), 5000);

/* ---------------- HEADER + NAV ACTIVE ---------------- */
const header = document.querySelector('.header');
const navLinks = Array.from(document.querySelectorAll('.nav a'));
const sections = Array.from(document.querySelectorAll('section[id]'));

function onScroll() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 10);
  let current = '';
  sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 160) current = s.id; });
  navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------------- FILTRES PROJETS ---------------- */
const filters = document.querySelectorAll('.pf');
const projects = document.querySelectorAll('.project-card');
filters.forEach((btn) => btn.addEventListener('click', () => {
  filters.forEach((b) => b.classList.toggle('is-active', b === btn));
  const f = btn.dataset.filter;
  projects.forEach((p) => {
    p.classList.toggle('is-hidden', !(f === 'all' || p.dataset.cat === f));
  });
}));

/* ---------------- FORMULAIRE ---------------- */
const CONTACT_EMAIL = 'aristidecedricbassole@gmail.com';
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('cf-type')?.value || 'Projet';
    const name = document.getElementById('cf-name')?.value.trim() || '';
    const email = document.getElementById('cf-email')?.value.trim() || '';
    const message = document.getElementById('cf-message')?.value.trim() || '';
    const body = [`Nom : ${name}`, `E-mail : ${email}`, `Type : ${type}`, '', message].join('\n');
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('[Portfolio] ' + type)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}

/* ---------------- ANNÉE ---------------- */
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
