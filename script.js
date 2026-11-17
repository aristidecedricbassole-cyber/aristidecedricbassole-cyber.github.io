/* =========================================================
   Portfolio — Aristide Cédric Bassolé
   Menu mobile, révélation au scroll, formulaire, navigation active
   ========================================================= */

/* ---------- Adresse e-mail de contact : À REMPLACER ---------- */
const CONTACT_EMAIL = 'votre.email@exemple.com';

/* ---------------------- Menu mobile ---------------------- */
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

/* ---------------------- Révélation au scroll ---------------------- */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

/* ---------------------- Année ---------------------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------------------- Formulaire -> messagerie ---------------------- */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const subject = document.getElementById('subject')?.value || 'Demande';
    const message = document.getElementById('message')?.value.trim() || '';

    const body = [
      `Nom : ${name}`,
      `E-mail : ${email}`,
      `Objet : ${subject}`,
      '',
      message
    ].join('\n');

    const mailto =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent('[Portfolio] ' + subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });
}

/* ---------------------- Lien de navigation actif ---------------------- */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

if (sections.length && navLinks.length) {
  const activateNav = () => {
    const position = window.scrollY + 130;
    let currentId = '';

    sections.forEach((section) => {
      if (section.offsetTop <= position) currentId = section.id;
    });

    navLinks.forEach((link) => {
      link.style.color = link.getAttribute('href') === `#${currentId}` ? 'var(--accent)' : '';
    });
  };

  window.addEventListener('scroll', activateNav, { passive: true });
  activateNav();
}
