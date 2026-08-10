/* Muhammad Properties, Okara — front-end behaviour
   Shared by the English, Urdu and Punjabi pages. No dependencies.
   Translated strings arrive via window.MP_I18N, injected by build/build.js;
   the English defaults below are only a fallback if that script is missing. */
(function () {
  'use strict';

  var WHATSAPP = '923056847007';

  var T = Object.assign({
    lang: 'en',
    dir: 'ltr',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    themeLight: 'Switch colour theme',
    statusOk: 'Opening WhatsApp with your message — press send there to reach us.',
    wa: {}
  }, window.MP_I18N || {});

  T.wa = Object.assign({
    greeting: 'Assalam-o-Alaikum Muhammad Properties,',
    searchIntro: 'I am looking for a property in Okara:',
    labelType: 'Type',
    labelArea: 'Area',
    labelSize: 'Size',
    labelBudget: 'Budget',
    searchOutro: 'Please send me what is available.',
    labelName: 'Name',
    labelPhone: 'Phone',
    labelWant: 'I want to',
    labelDetails: 'Details:',
    notGiven: 'not given',
    sentFrom: '(Sent from muhammadproperties.online)'
  }, T.wa);

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
      toggle.setAttribute('aria-label', T.themeLight);
      toggle.setAttribute('title', T.themeLight);
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

  function navIcon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  }

  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', T.openMenu);
    navToggle.innerHTML = navIcon('menu');
  }

  if (navToggle && navLinks) {
    navToggle.setAttribute('aria-label', T.openMenu);
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? T.closeMenu : T.openMenu);
      navToggle.innerHTML = navIcon(open ? 'close' : 'menu');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
  }

  /* ---------- Language switcher --------------------------------------- */
  /* It is a <details> element, so it already works without JS. This only
     closes it on an outside click or Escape, the way a menu should behave. */
  var langSwitch = $('#langSwitch');
  if (langSwitch) {
    document.addEventListener('click', function (e) {
      if (langSwitch.open && !langSwitch.contains(e.target)) langSwitch.open = false;
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeNav();
    if (langSwitch && langSwitch.open) {
      langSwitch.open = false;
      var summary = $('summary', langSwitch);
      if (summary) summary.focus();
    }
  });

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
  function openWhatsApp(lines) {
    var message = lines.join('\n');
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message),
                '_blank', 'noopener');
  }

  var searchForm = $('#searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(searchForm);
      var pick = function (name, fallbackIndex) {
        var value = data.get(name);
        if (value) return value;
        var select = searchForm.elements[name];
        return select ? select.options[fallbackIndex || 0].text : '';
      };
      openWhatsApp([
        T.wa.greeting,
        '',
        T.wa.searchIntro,
        '• ' + T.wa.labelType + ': ' + pick('type'),
        '• ' + T.wa.labelArea + ': ' + pick('area'),
        '• ' + T.wa.labelSize + ': ' + pick('size'),
        '• ' + T.wa.labelBudget + ': ' + pick('budget'),
        '',
        T.wa.searchOutro,
        T.wa.sentFrom
      ]);
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
      var status = $('#formStatus');
      if (status) {
        status.textContent = T.statusOk;
        status.classList.add('is-visible');
      }

      openWhatsApp([
        T.wa.greeting,
        '',
        T.wa.labelName + ': ' + data.get('name'),
        T.wa.labelPhone + ': ' + (data.get('phone') || T.wa.notGiven),
        T.wa.labelWant + ': ' + data.get('purpose'),
        T.wa.labelArea + ': ' + data.get('area'),
        '',
        T.wa.labelDetails,
        data.get('message'),
        '',
        T.wa.sentFrom
      ]);
    });
  }

  /* ---------- Footer year --------------------------------------------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
