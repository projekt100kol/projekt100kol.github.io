const siteConfig = window.PROJEKT100KOL || {};

const statValues = {
  starts: siteConfig.starts,
  podiums: siteConfig.podiums,
  licenseYears: siteConfig.licenseYears
};

document.querySelectorAll('[data-stat]').forEach((node) => {
  const value = statValues[node.dataset.stat];
  if (value === undefined || value === null || value === '') return;

  node.textContent = String(value);
  if (node.hasAttribute('data-counter') && Number.isFinite(Number(value))) {
    node.dataset.counter = String(value);
  }
});

if (siteConfig.campaignLive && siteConfig.donioUrl) {
  document.querySelectorAll('[data-main-cta]').forEach((link) => {
    link.href = siteConfig.donioUrl;
    link.textContent = link.dataset.liveLabel || 'Podporiť na Doniu';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}

const setExternalLink = (selector, url) => {
  if (!url) return;
  document.querySelectorAll(selector).forEach((link) => {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
};

setExternalLink('[data-instagram]', siteConfig.instagramUrl);
setExternalLink('[data-partner-pdf]', siteConfig.partnerPdfUrl);
setExternalLink('[data-media-kit]', siteConfig.mediaKitUrl);
setExternalLink('[data-privacy]', siteConfig.privacyUrl);

if (siteConfig.contactEmail) {
  const emailUrl = `mailto:${siteConfig.contactEmail}`;
  document.querySelectorAll('[data-contact-link], [data-email]').forEach((link) => {
    link.href = emailUrl;
  });
}

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.querySelector('.sr-only').textContent = isOpen ? 'Otvoriť menu' : 'Zavrieť menu';
    nav.classList.toggle('is-open', !isOpen);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelector('.sr-only').textContent = 'Otvoriť menu';
      nav.classList.remove('is-open');
    }
  });
}

document.querySelectorAll('[data-counter]').forEach((counter) => {
  const target = Number(counter.dataset.counter);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !Number.isFinite(target)) return;

  counter.textContent = '0';
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;

    const startedAt = performance.now();
    const duration = 700;
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      counter.textContent = String(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    observer.disconnect();
  }, { threshold: 0.6 });

  observer.observe(counter);
});

const signupForm = document.querySelector('[data-signup-form]');
if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = signupForm.querySelector('.form-status');
    status.textContent = 'Formulár pripojíme k odberu pred zverejnením webu.';
  });
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const observedSections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

if (observedSections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${visible.target.id}`;
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] });

  observedSections.forEach((section) => sectionObserver.observe(section));
}
