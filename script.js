/* =========================================================
   Portfolio — Aristide Cédric Bassolé
   Motion design : split-text, parallaxe, compteurs, progression,
   révélations en cascade, boutons magnétiques
   ========================================================= */

/* ---------- Adresse e-mail de contact : À REMPLACER ---------- */
const CONTACT_EMAIL = 'votre.email@exemple.com';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/* ====================== SPLIT TEXT ====================== */
function splitWords(element) {
  const words = [];

  const walk = (node, target) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (/^\s+$/.test(part)) {
            target.appendChild(document.createTextNode(part));
          } else if (part.length) {
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

  words.forEach((word, index) => {
    word.style.setProperty('--d', `${index * 0.045}s`);
  });
  return words;
}

if (!reduceMotion) {
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    splitWords(heroTitle);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.body.classList.add('motion-ready');
    }));
  }

  document.querySelectorAll('[data-split]').forEach((heading) => splitWords(heading));
}

/* ====================== MENU MOBILE ====================== */
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    });
  });
}

/* ====================== EN-TÊTE + BARRE DE PROGRESSION ====================== */
const siteHeader = document.querySelector('.site-header');
const progressBar = document.getElementById('scrollProgress');

/* ====================== RÉVÉLATIONS ====================== */
const revealEls = document.querySelectorAll('.reveal');

/* Cascade : décalage progressif des enfants */
document.querySelectorAll('.service-list, .gallery, .timeline, .contact-links').forEach((group) => {
  Array.from(group.children).forEach((child, index) => {
    child.style.setProperty('--d', `${index * 0.075}s`);
  });
});

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach((el) => revealObserver.observe(el));

  const textObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.parentElement?.classList.contains('section-head')) {
          entry.target.parentElement.classList.add('in-view');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('[data-split]').forEach((el) => textObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
  document.querySelectorAll('[data-split]').forEach((el) => el.classList.add('in-view'));
}

/* ====================== PARALLAXE + PROGRESSION ====================== */
const heroImage = document.querySelector('.hero-media img');
const tileMedias = document.querySelectorAll('.tile-media');
const timeline = document.querySelector('.timeline');
let ticking = false;

function updateScrollMotion() {
  const y = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (progressBar) {
    progressBar.style.setProperty('--p', String(docHeight > 0 ? clamp(y / docHeight, 0, 1) : 0));
  }

  if (siteHeader) siteHeader.classList.toggle('scrolled', y > 40);

  if (!reduceMotion) {
    if (heroImage) heroImage.style.setProperty('--py', `${clamp(y * 0.1, 0, 80)}px`);

    tileMedias.forEach((media) => {
      const rect = media.getBoundingClientRect();
      if (rect.bottom > -150 && rect.top < window.innerHeight + 150) {
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        media.style.setProperty('--py', `${clamp(-offset * 22, -22, 22)}px`);
      }
    });

    if (timeline) {
      const start = timeline.offsetTop - window.innerHeight * 0.65;
      const end = timeline.offsetTop + timeline.offsetHeight - window.innerHeight * 0.45;
      const progress = clamp((y - start) / Math.max(end - start, 1), 0, 1);
      timeline.style.setProperty('--progress', String(progress));
    }
  }

  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateScrollMotion);
  }
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });
updateScrollMotion();

/* ====================== COMPTEURS ====================== */
function animateCount(element) {
  const target = Number(element.dataset.count) || 0;
  const suffix = element.dataset.suffix || '';
  const pad = Number(element.dataset.pad || 0);
  const format = (value) => String(value).padStart(pad, '0') + suffix;

  if (reduceMotion) { element.textContent = format(target); return; }

  const duration = 1500;
  const start = performance.now();
  const frame = (now) => {
    const t = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    element.textContent = format(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(frame);
    else element.textContent = format(target);
  };
  requestAnimationFrame(frame);
}

document.querySelectorAll('[data-count]').forEach(animateCount);

/* ====================== BOUTONS MAGNÉTIQUES ====================== */
if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.2;
      button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

/* ====================== ANNÉE ====================== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ====================== FORMULAIRE -> MESSAGERIE ====================== */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const subject = document.getElementById('subject')?.value || 'Demande';
    const message = document.getElementById('message')?.value.trim() || '';
    const body = [`Nom : ${name}`, `E-mail : ${email}`, `Objet : ${subject}`, '', message].join('\n');
    const mailto =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent('[Portfolio] ' + subject)}` +
      `&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}

/* ====================== NAVIGATION ACTIVE ====================== */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

if (sections.length && navLinks.length) {
  const activateNav = () => {
    const position = window.scrollY + 130;
    let currentId = '';
    sections.forEach((section) => { if (section.offsetTop <= position) currentId = section.id; });
    navLinks.forEach((link) => {
      link.style.color = link.getAttribute('href') === `#${currentId}` ? 'var(--accent)' : '';
    });
  };
  window.addEventListener('scroll', activateNav, { passive: true });
  activateNav();
}
