/* Muhammad Properties, Okara — front-end behaviour
   No dependencies. Everything degrades gracefully without JS. */
(function () {
  'use strict';

  var WHATSAPP = '923056847007';
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Colour theme ------------------------------------------- */
  var root = document.documentElement;
  var STORE_KEY = 'mp-theme';

  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var toggle = $('#themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      toggle.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }
  try {
    var saved = localStorage.getItem(STORE_KEY);
    if (saved === 'dark' || saved === 'light') applyTheme(saved);
  } catch (e) { /* private mode — fall back to the media query */ }

  var themeToggle = $('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') || systemTheme();
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORE_KEY, next); } catch (e) {}
    });
  }

  /* ---------- Sticky header ------------------------------------------ */
  var header = $('#siteHeader');
  var toTop = $('#toTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Mobile navigation --------------------------------------- */
  var navToggle = $('#navToggle');
  var navLinks = $('#navLinks');

  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    navToggle.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-menu"></use></svg>';
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      navToggle.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-' +
        (open ? 'close' : 'menu') + '"></use></svg>';
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Current section highlighting ---------------------------- */
  var navAnchors = $$('#navLinks a[href^="#"]');
  var sections = navAnchors
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (a) {
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.setAttribute('aria-current', 'true');
          } else {
            a.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------------------------------------- */
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealables = $$('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealables.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 55 + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ---------- Listing filters ----------------------------------------- */
  var chips = $$('.chip[data-filter]');
  var listings = $$('#listingGrid .listing');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.dataset.filter;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      listings.forEach(function (card) {
        var show = filter === 'all' || card.dataset.type === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- WhatsApp handoff ---------------------------------------- */
  function openWhatsApp(message) {
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message),
                '_blank', 'noopener');
  }

  var searchForm = $('#searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(searchForm);
      var parts = [
        'Assalam-o-Alaikum Muhammad Properties,',
        '',
        'I am looking for a property in Okara:',
        '• Type: ' + (data.get('type') || 'Any type'),
        '• Area: ' + (data.get('area') || 'Anywhere in Okara District'),
        '• Size: ' + (data.get('size') || 'Any size'),
        '• Budget: ' + (data.get('budget') || 'Flexible'),
        '',
        'Please send me what is available. (Sent from muhammadproperties.online)'
      ];
      openWhatsApp(parts.join('\n'));
    });
  }

  var enquiryForm = $('#enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = $('#c-name');
      var message = $('#c-message');
      if (!name.value.trim() || !message.value.trim()) {
        (name.value.trim() ? message : name).focus();
        return;
      }

      var data = new FormData(enquiryForm);
      var parts = [
        'Assalam-o-Alaikum Muhammad Properties,',
        '',
        'Name: ' + data.get('name'),
        'Phone: ' + (data.get('phone') || 'not given'),
        'I want to: ' + data.get('purpose'),
        'Area: ' + data.get('area'),
        '',
        'Details:',
        data.get('message'),
        '',
        '(Sent from muhammadproperties.online)'
      ];

      var status = $('#formStatus');
      if (status) {
        status.textContent = 'Opening WhatsApp with your message — press send there to reach us.';
        status.classList.add('is-visible');
      }
      openWhatsApp(parts.join('\n'));
    });
  }

  /* ---------- Footer year --------------------------------------------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
