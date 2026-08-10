#!/usr/bin/env node
/*
 * Static site generator for muhammadproperties.online
 * -----------------------------------------------------------------------------
 * Renders one HTML page per language from content/<lang>.json:
 *
 *     content/en.json  ->  /index.html      (English, LTR, x-default)
 *     content/ur.json  ->  /ur/index.html   (Urdu, RTL)
 *     content/pa.json  ->  /pa/index.html   (Punjabi Shahmukhi, RTL)
 *
 * It also writes 404.html, sitemap.xml and llms.txt.
 *
 * To change wording, edit the JSON — never the generated HTML, which is
 * overwritten on every build. Run it with:
 *
 *     node build/build.js
 *
 * No dependencies; any Node 16+ will do.
 *
 * Content values are inserted as raw HTML so that entities (&mdash;) and inline
 * tags (<br>) in the JSON work. The content files are author-controlled, so
 * that is intentional — do not feed untrusted text through here.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://www.muhammadproperties.online';
const PHONE_E164 = '+92-305-6847007';
const PHONE_HUMAN = '+92 305 6847007';
const WHATSAPP = '923056847007';
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const LANG_CODES = ['en', 'ur', 'pa'];

const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const langs = LANG_CODES.map((c) => read(`content/${c}.json`));
const byCode = Object.fromEntries(langs.map((l) => [l.code, l]));

/* ---------------------------------------------------------------- helpers -- */

const attr = (s) => String(s).replace(/&(?![a-zA-Z#0-9]+;)/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// Strip markup/entities for values that go into JSON-LD or meta attributes.
const plain = (s) =>
  String(s)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&middot;/g, '·')
    .replace(/&nbsp;/g, ' ').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
const json = (o) => JSON.stringify(o, null, 2);
const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(plain(text))}`;
const icon = (id, extra = '') => `<svg class="icon" aria-hidden="true"${extra}><use href="#${id}"></use></svg>`;
const solid = ' style="fill:currentColor;stroke:none"';

function urlFor(lang, hash = '') {
  return SITE + (lang.path === '/' ? '/' : lang.path) + hash;
}
// Same-page section links stay relative so they work in every directory.
const sect = (hash) => hash;

/* -------------------------------------------------------------- validation -- */

function shape(value, trail, out) {
  if (Array.isArray(value)) {
    out.push(`${trail}[]:${value.length}`);
    value.forEach((v, i) => shape(v, `${trail}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    Object.keys(value).sort().forEach((k) => shape(value[k], `${trail}.${k}`, out));
  } else {
    out.push(trail);
  }
  return out;
}

function validate() {
  const base = shape(byCode.en, '', []);
  let problems = 0;
  for (const lang of langs) {
    if (lang.code === 'en') continue;
    const other = shape(lang, '', []);
    const missing = base.filter((k) => !other.includes(k));
    const extra = other.filter((k) => !base.includes(k));
    if (missing.length || extra.length) {
      problems++;
      console.error(`\n  ${lang.code}.json does not match en.json:`);
      missing.slice(0, 12).forEach((k) => console.error(`    missing: ${k}`));
      extra.slice(0, 12).forEach((k) => console.error(`    unexpected: ${k}`));
    }
  }
  // Every referenced photo must exist on disk.
  const imgs = new Set();
  for (const lang of langs) {
    lang.areas.cards.forEach((c) => imgs.add(c.img));
    lang.listings.cards.forEach((c) => imgs.add(c.img));
    lang.about.figures.forEach((f) => imgs.add(f.img));
  }
  for (const img of imgs) {
    if (!fs.existsSync(path.join(ROOT, 'images', 'okara', img))) {
      problems++;
      console.error(`  missing image: images/okara/${img}`);
    }
  }
  if (problems) {
    console.error(`\nBuild aborted: ${problems} problem(s) above.\n`);
    process.exit(1);
  }
}

/* ------------------------------------------------------------------ sprite -- */

const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <symbol id="i-home" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.8V21h14V9.8"/><path d="M9.5 21v-6h5v6"/></symbol>
  <symbol id="i-tag" viewBox="0 0 24 24"><path d="M20.6 13.4 12 22l-9-9V4h9l8.6 8.6a1.4 1.4 0 0 1 0 2Z"/><circle cx="7.5" cy="7.5" r="1.4"/></symbol>
  <symbol id="i-key" viewBox="0 0 24 24"><circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.8 12.3 21 2.1"/><path d="m17.5 5.6 2.4 2.4"/><path d="m14.6 8.5 2.4 2.4"/></symbol>
  <symbol id="i-map" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>
  <symbol id="i-crop" viewBox="0 0 24 24"><path d="M3 3v14a4 4 0 0 0 4 4h14"/><path d="M7 3v10h10"/><path d="M21 7H11v10"/></symbol>
  <symbol id="i-scale" viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M5 7h14"/><path d="m5 7-3 7h6Z"/><path d="m19 7-3 7h6Z"/></symbol>
  <symbol id="i-doc" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 11 2 2 4-4"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m4 12 5 5L20 6"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M21 16.9v2.8a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3-8.6A2 2 0 0 1 3.3 2H6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6.5 9 6 9-6"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.3 2"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
  <symbol id="i-up" viewBox="0 0 24 24"><path d="M12 20V5"/><path d="m5 12 7-7 7 7"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></symbol>
  <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3.2 9h17.6M3.2 15h17.6"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/></symbol>
  <symbol id="i-fb" viewBox="0 0 24 24"><path d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V2.6A18 18 0 0 0 14.8 2.5C12.2 2.5 10.5 4.1 10.5 7v1.5H8V12h2.5v9.5H14V12h2.6l.4-3.5Z"/></symbol>
  <symbol id="i-wa" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1-1.4-1-2.6 0-1.3.7-1.9 1-2.1.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2 1.2.3.1.4.1.6-.1l.8-1c.2-.2.3-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.6-.1 1.2Z"/></symbol>
</svg>`;

/* ------------------------------------------------------------- components -- */

function langSwitch(current, base) {
  const items = langs
    .map((l) => {
      const here = l.code === current.code;
      // Only gloss the native name when it differs — no "English English".
      const gloss = l.nativeName === l.englishName ? '' : `<small>${l.englishName}</small>`;
      return `          <a href="${base}${l.path === '/' ? '' : l.path.slice(1)}" hreflang="${l.hreflang}" lang="${l.htmlLang}"${here ? ' aria-current="true"' : ''}>
            <span class="native">${l.nativeName}</span>${gloss}
          </a>`;
    })
    .join('\n');

  return `        <details class="lang-switch" id="langSwitch">
          <summary title="${attr(plain(current.ui.langLabel))}" aria-label="${attr(plain(current.ui.langMenuLabel))}">
            ${icon('i-globe')}<span class="native">${current.nativeName}</span>
          </summary>
          <div class="lang-menu" role="group" aria-label="${attr(plain(current.ui.langMenuLabel))}">
${items}
          </div>
        </details>`;
}

function header(t, base) {
  const nav = Object.entries(t.nav)
    .map(([k, label]) => `          <li><a href="${sect('#' + (k === 'listings' ? 'listings' : k))}">${label}</a></li>`)
    .join('\n');

  return `<header class="site-header" id="siteHeader">
  <div class="wrap">
    <nav class="nav" aria-label="${attr(plain(t.nav.services))}">
      <a class="brand" href="${base || './'}">
        <img src="${base}images/logo.svg" alt="" width="64" height="64">
        <span class="brand-name">
          <b>${t.brand.name}</b>
          <span>${t.brand.tagline}</span>
        </span>
      </a>

      <ul class="nav-links" id="navLinks">
${nav}
      </ul>

      <div class="nav-actions">
${langSwitch(t, base)}
        <button class="icon-btn theme-toggle" id="themeToggle" type="button"
                aria-label="${attr(plain(t.ui.themeLabel))}" title="${attr(plain(t.ui.themeLabel))}">
          ${icon('i-sun')}
        </button>
        <a class="btn btn--sm" href="tel:${PHONE_E164.replace(/-/g, '')}">
          ${icon('i-phone')}<span class="ltr">${t.ui.callShort}</span>
        </a>
        <button class="icon-btn nav-toggle" id="navToggle" type="button"
                aria-expanded="false" aria-controls="navLinks" aria-label="${attr(plain(t.ui.openMenu))}">
          ${icon('i-menu')}
        </button>
      </div>
    </nav>
  </div>
</header>`;
}

function hero(t, base) {
  const stats = t.hero.stats
    .map((s) => `        <div><b>${s.value}</b><span>${s.label}</span></div>`)
    .join('\n');

  const opts = (arr) => arr.map((o, i) => `          <option${i === 0 ? ' value=""' : ''}>${o}</option>`).join('\n');

  return `<section class="hero" id="hero">
  <div class="hero-media">
    <img src="${base}images/okara/okara-evening.jpg"
         alt="${attr(plain(t.about.figures[0].alt))}"
         width="1280" height="792" fetchpriority="high" decoding="async">
  </div>

  <div class="wrap">
    <div class="hero-inner">
      <p class="hero-badge"><span class="dot"></span> ${t.hero.badge}</p>
      <h1>${t.hero.h1Before}<em>${t.hero.h1Highlight}</em>${t.hero.h1After}</h1>
      <p class="hero-lede">${t.hero.lede}</p>

      <div class="hero-cta">
        <a class="btn btn--wa" href="${wa(t.hero.waIntro)}" target="_blank" rel="noopener">
          ${icon('i-wa', solid)} ${t.hero.ctaWhatsapp}
        </a>
        <a class="btn btn--light" href="${sect('#listings')}">${t.hero.ctaBrowse}</a>
      </div>

      <div class="hero-stats">
${stats}
      </div>
    </div>

    <form class="searchbar" id="searchForm" aria-label="${attr(plain(t.search.formLabel))}">
      <div class="field">
        <label for="f-type">${t.search.typeLabel}</label>
        <select id="f-type" name="type">
${opts(t.search.typeOptions)}
        </select>
      </div>
      <div class="field">
        <label for="f-area">${t.search.areaLabel}</label>
        <select id="f-area" name="area">
${opts(t.search.areaOptions)}
        </select>
      </div>
      <div class="field">
        <label for="f-size">${t.search.sizeLabel}</label>
        <select id="f-size" name="size">
${opts(t.search.sizeOptions)}
        </select>
      </div>
      <div class="field">
        <label for="f-budget">${t.search.budgetLabel}</label>
        <select id="f-budget" name="budget">
${opts(t.search.budgetOptions)}
        </select>
      </div>
      <div class="field">
        <label for="f-go" class="visually-hidden">${t.search.submitSr}</label>
        <button class="btn btn--block" id="f-go" type="submit">${t.search.submit}</button>
      </div>
    </form>
  </div>
</section>`;
}

function facts(t) {
  const items = t.facts.items
    .map((f) => `  <div class="fact">
    <b>${f.value}</b>
    <span>${f.label}</span>
    <small>${f.note}</small>
  </div>`)
    .join('\n');
  return `<section class="facts" aria-label="${attr(plain(t.facts.label))}">
${items}
</section>`;
}

function services(t) {
  const cards = t.services.cards
    .map(
      (c) => `      <article class="card svc-card reveal">
        <span class="badge">${icon(c.icon)}</span>
        <h3>${c.h3}</h3>
        <p>${c.p}</p>
        <ul>
${c.list.map((li) => `          <li>${li}</li>`).join('\n')}
        </ul>
        <a class="card-link" href="${sect(c.linkHref)}">${c.linkText} ${icon('i-arrow')}</a>
      </article>`
    )
    .join('\n\n');

  return `<section class="section" id="services">
  <div class="wrap">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">${t.services.eyebrow}</span>
      <h2>${t.services.h2}</h2>
      <p class="lede">${t.services.lede}</p>
    </div>

    <div class="grid grid-3">
${cards}
    </div>
  </div>
</section>`;
}

function areas(t, base) {
  const cards = t.areas.cards
    .map(
      (c) => `      <article class="card area-card reveal">
        <div class="area-media">
          <img src="${base}images/okara/${c.img}" alt="${attr(plain(c.alt))}" width="800" height="600" loading="lazy" decoding="async">
          <span class="area-tag">${c.tag}</span>
        </div>
        <div class="area-body">
          <h3>${c.h3}</h3>
          <p>${c.p}</p>
          <p class="area-rate">${c.rate}</p>
        </div>
      </article>`
    )
    .join('\n\n');

  return `<section class="section section--soft" id="areas">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${t.areas.eyebrow}</span>
      <h2>${t.areas.h2}</h2>
      <p class="lede">${t.areas.lede}</p>
    </div>

    <div class="grid grid-3">
${cards}
    </div>
  </div>
</section>`;
}

function listings(t, base) {
  const chips = t.listings.filters
    .map(
      (f) =>
        `      <button class="chip" type="button" data-filter="${f.key}" aria-pressed="${f.key === 'all'}">${f.label}</button>`
    )
    .join('\n');

  const cards = t.listings.cards
    .map(
      (c) => `      <article class="card listing reveal" data-type="${c.type}">
        <div class="listing-media">
          <img src="${base}images/okara/${c.img}" alt="${attr(plain(c.alt))}" width="800" height="500" loading="lazy" decoding="async">
          <span class="listing-type">${c.badge}</span>
          <span class="area-tag">${c.tag}</span>
        </div>
        <div class="listing-body">
          <h3>${c.h3}</h3>
          <p class="listing-loc">${icon('i-map')} ${c.loc}</p>
          <ul class="listing-specs">${c.specs.map((s) => `<li>${s}</li>`).join('')}</ul>
          <p class="listing-price">${c.price} <small>${c.priceNote}</small></p>
          <div class="listing-actions">
            <a class="btn btn--sm btn--wa" href="${wa(c.wa)}" target="_blank" rel="noopener">${t.listings.ask}</a>
            <a class="btn btn--sm btn--ghost" href="tel:${PHONE_E164.replace(/-/g, '')}">${t.listings.call}</a>
          </div>
        </div>
      </article>`
    )
    .join('\n\n');

  return `<section class="section" id="listings">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${t.listings.eyebrow}</span>
      <h2>${t.listings.h2}</h2>
      <p class="lede">${t.listings.lede}</p>
    </div>

    <div class="filters reveal" role="group" aria-label="${attr(plain(t.listings.filterLabel))}">
${chips}
    </div>

    <div class="grid grid-3" id="listingGrid">
${cards}
    </div>

    <p class="note reveal">
      ${icon('i-info')}
      <span><strong>${t.listings.noteStrong}</strong> ${t.listings.noteText}</span>
    </p>
  </div>
</section>`;
}

function prices(t) {
  const head = t.prices.cols.map((c) => `            <th scope="col">${c}</th>`).join('\n');
  const rows = t.prices.rows
    .map(
      (r) =>
        `          <tr><td>${r[0]}</td><td class="num">${r[1]}</td><td class="num">${r[2]}</td><td>${r[3]}</td></tr>`
    )
    .join('\n');
  const cards = t.prices.cards
    .map(
      (c) => `      <article class="card svc-card reveal">
        <h3>${c.h3}</h3>
        <ul>
${c.list.map((li) => `          <li>${li}</li>`).join('\n')}
        </ul>
      </article>`
    )
    .join('\n');

  return `<section class="section section--soft" id="prices">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${t.prices.eyebrow}</span>
      <h2>${t.prices.h2}</h2>
      <p class="lede">${t.prices.lede}</p>
    </div>

    <div class="table-wrap reveal">
      <table class="rates">
        <caption>${t.prices.caption}</caption>
        <thead>
          <tr>
${head}
          </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>

    <div class="grid grid-3" style="margin-top:2.5rem">
${cards}
    </div>
  </div>
</section>`;
}

function process(t) {
  const steps = t.process.steps
    .map(
      (s) => `      <article class="step reveal">
        <h3>${s.h3}</h3>
        <p>${s.p}</p>
      </article>`
    )
    .join('\n');

  const panel = (p) => `      <article class="card svc-card">
        <span class="badge">${icon(p.icon)}</span>
        <h3>${p.h3}</h3>
        <ul>
${p.list.map((li) => `          <li>${li}</li>`).join('\n')}
        </ul>
      </article>`;

  return `<section class="section" id="process">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${t.process.eyebrow}</span>
      <h2>${t.process.h2}</h2>
      <p class="lede">${t.process.lede}</p>
    </div>

    <div class="steps">
${steps}
    </div>

    <div class="grid grid-2 reveal" style="margin-top:clamp(2rem,4vw,3rem)">
${panel(t.process.docs)}
${panel(t.process.checks)}
    </div>
  </div>
</section>`;
}

function about(t, base) {
  const figs = t.about.figures
    .map(
      (f, i) => `        <figure>
          <img src="${base}images/okara/${f.img}" alt="${attr(plain(f.alt))}" width="${i === 0 ? '720" height="1152' : '800" height="600'}" loading="lazy" decoding="async">
        </figure>`
    )
    .join('\n');

  return `<section class="section section--soft" id="about">
  <div class="wrap">
    <div class="about">
      <div class="about-text reveal">
        <span class="eyebrow">${t.about.eyebrow}</span>
        <h2>${t.about.h2}</h2>
        <p class="lede">${t.about.lede}</p>
${t.about.paras.map((p) => `        <p>${p}</p>`).join('\n')}
        <ul class="about-list">
${t.about.list.map((li) => `          <li>${icon('i-check')} ${li}</li>`).join('\n')}
        </ul>
        <div class="hero-cta" style="margin-top:1.75rem">
          <a class="btn" href="${sect('#contact')}">${t.about.cta1}</a>
          <a class="btn btn--ghost" href="tel:${PHONE_E164.replace(/-/g, '')}">${t.about.cta2}</a>
        </div>
      </div>

      <div class="about-media reveal">
${figs}
      </div>
    </div>
  </div>
</section>`;
}

function faq(t) {
  const items = t.faq.items
    .map(
      (it) => `      <details>
        <summary>${it.q}</summary>
        <div class="faq-body">${it.a.map((p) => `<p>${p}</p>`).join('')}</div>
      </details>`
    )
    .join('\n\n');

  return `<section class="section" id="faq">
  <div class="wrap">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">${t.faq.eyebrow}</span>
      <h2>${t.faq.h2}</h2>
      <p class="lede">${t.faq.lede}</p>
    </div>

    <div class="faq reveal">
${items}
    </div>
  </div>
</section>`;
}

function contact(t) {
  const c = t.contact;
  const opts = (arr) => arr.map((o) => `                <option>${o}</option>`).join('\n');

  return `<section class="section section--soft" id="contact">
  <div class="wrap">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">${c.eyebrow}</span>
      <h2>${c.h2}</h2>
      <p class="lede">${c.lede}</p>
    </div>

    <div class="contact">
      <div class="contact-card reveal">
        <h3>${c.officeH3}</h3>
        <ul class="contact-list">
          <li>
            ${icon('i-map')}
            <span><b>${c.addressLabel}</b>
              <a href="https://www.openstreetmap.org/?mlat=30.8058&amp;mlon=73.4511#map=14/30.8058/73.4511" target="_blank" rel="noopener">${c.address}</a></span>
          </li>
          <li>
            ${icon('i-phone')}
            <span><b>${c.phoneLabel}</b><a class="ltr" href="tel:${PHONE_E164.replace(/-/g, '')}">${PHONE_HUMAN}</a></span>
          </li>
          <li>
            ${icon('i-mail')}
            <span><b>${c.emailLabel}</b><a class="ltr" href="mailto:info@muhammadproperties.online">info@muhammadproperties.online</a></span>
          </li>
          <li>
            ${icon('i-clock')}
            <span><b>${c.hoursLabel}</b><span style="font-weight:600">${c.hours}</span></span>
          </li>
        </ul>

        <div class="socials">
          <a href="https://www.facebook.com/people/Muhammadproperty/61579241310289/" target="_blank" rel="noopener" aria-label="${attr(plain(t.ui.facebookLabel))}">${icon('i-fb', solid)}</a>
          <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" aria-label="${attr(plain(t.ui.whatsappLabel))}">${icon('i-wa', solid)}</a>
          <a href="mailto:info@muhammadproperties.online" aria-label="${attr(plain(t.ui.emailLabel))}">${icon('i-mail')}</a>
        </div>
      </div>

      <div class="contact-card reveal">
        <h3>${c.formH3}</h3>
        <p class="lede" style="font-size:.95rem;margin-top:.4rem">${c.formNote}</p>
        <form class="form" id="enquiryForm" style="margin-top:1.2rem" novalidate>
          <div class="form-row">
            <div class="field">
              <label for="c-name">${c.nameLabel}</label>
              <input id="c-name" name="name" type="text" autocomplete="name" required placeholder="${attr(plain(c.namePlaceholder))}">
            </div>
            <div class="field">
              <label for="c-phone">${c.phoneFieldLabel}</label>
              <input id="c-phone" name="phone" type="tel" autocomplete="tel" placeholder="${attr(plain(c.phonePlaceholder))}">
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label for="c-purpose">${c.purposeLabel}</label>
              <select id="c-purpose" name="purpose">
${opts(c.purposeOptions)}
              </select>
            </div>
            <div class="field">
              <label for="c-area">${c.areaFieldLabel}</label>
              <select id="c-area" name="area">
${opts(c.areaOptions)}
              </select>
            </div>
          </div>
          <div class="field">
            <label for="c-message">${c.detailsLabel}</label>
            <textarea id="c-message" name="message" required placeholder="${attr(plain(c.detailsPlaceholder))}"></textarea>
          </div>
          <button class="btn btn--wa btn--block" type="submit">
            ${icon('i-wa', solid)} ${c.submit}
          </button>
          <p class="consent">${c.consent}</p>
          <p class="form-status form-status--ok" id="formStatus" role="status"></p>
        </form>
      </div>
    </div>

    <div class="map-embed reveal">
      <iframe title="${attr(plain(t.ui.mapTitle))}"
              src="https://www.openstreetmap.org/export/embed.html?bbox=73.39%2C30.76%2C73.52%2C30.85&amp;layer=mapnik&amp;marker=30.8058%2C73.4511"
              loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>`;
}

function credits(t) {
  return `<section class="section section--line" id="credits">
  <div class="wrap credits">
    <h2>${t.credits.h2}</h2>
    <p style="margin-bottom:.9rem">${t.credits.intro}</p>
    <ul>
${t.credits.items.map((i) => `      <li>${i}</li>`).join('\n')}
    </ul>
    <p style="margin-top:.9rem">
      ${t.credits.sourcePrefix}
      <a href="https://commons.wikimedia.org/wiki/Category:Okara" target="_blank" rel="noopener">${t.credits.sourceCat1}</a>
      ${t.credits.sourceAnd}
      <a href="https://commons.wikimedia.org/wiki/Category:Okara_District" target="_blank" rel="noopener">${t.credits.sourceCat2}</a>.
    </p>
  </div>
</section>`;
}

function footer(t, base) {
  const f = t.footer;
  const links = (arr) => arr.map((l) => `          <li><a href="${sect(l.href)}">${l.text}</a></li>`).join('\n');
  const otherLangs = langs
    .filter((l) => l.code !== t.code)
    .map((l) => `          <li><a href="${base}${l.path === '/' ? '' : l.path.slice(1)}" hreflang="${l.hreflang}" lang="${l.htmlLang}">${l.nativeName} &mdash; ${l.englishName}</a></li>`)
    .join('\n');

  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <span class="footer-brand">
          <img src="${base}images/logo.svg" alt="" width="64" height="64">
          <b>${t.brand.name}</b>
        </span>
        <p>${f.about}</p>
        <div class="footer-tags">
${f.tags.map((tag) => `          <span>${tag}</span>`).join('\n')}
        </div>
      </div>

      <div>
        <h3>${f.exploreH3}</h3>
        <ul>
${links(f.exploreLinks)}
        </ul>
      </div>

      <div>
        <h3>${f.typesH3}</h3>
        <ul>
${links(f.typesLinks)}
        </ul>
      </div>

      <div>
        <h3>${f.contactH3}</h3>
        <ul>
          <li><a href="https://www.openstreetmap.org/?mlat=30.8058&amp;mlon=73.4511#map=14/30.8058/73.4511" target="_blank" rel="noopener">${f.addressShort}</a></li>
          <li><a class="ltr" href="tel:${PHONE_E164.replace(/-/g, '')}">${PHONE_HUMAN}</a></li>
          <li><a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">${f.whatsappLink}</a></li>
          <li><a class="ltr" href="mailto:info@muhammadproperties.online">info@muhammadproperties.online</a></li>
          <li>${f.hoursShort}</li>
        </ul>
        <h3 style="margin-top:1.75rem">${f.langH3}</h3>
        <ul>
${otherLangs}
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; <span id="year">${new Date().getFullYear()}</span> ${f.rights}</p>
      <p><a href="${sect('#credits')}">${f.creditsLink}</a> &middot; <a href="${base}llms.txt">llms.txt</a> &middot; <a href="${base}sitemap.xml">${f.sitemapLink}</a></p>
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------- structured -- */

function structuredData(t) {
  const url = urlFor(t);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: plain(t.jsonld.siteName),
        description: plain(t.jsonld.siteDescription),
        inLanguage: t.htmlLang,
        publisher: { '@id': `${SITE}/#agent` }
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: plain(t.jsonld.pageName),
        isPartOf: { '@id': `${url}#website` },
        about: { '@id': `${SITE}/#agent` },
        primaryImageOfPage: `${SITE}/images/og-image.jpg`,
        inLanguage: t.htmlLang
      },
      {
        '@type': ['RealEstateAgent', 'LocalBusiness'],
        '@id': `${SITE}/#agent`,
        name: plain(t.brand.name),
        alternateName: 'MuhammadProperties.online',
        description: plain(t.jsonld.agentDescription),
        url: `${SITE}/`,
        logo: `${SITE}/images/logo.svg`,
        image: `${SITE}/images/og-image.jpg`,
        telephone: PHONE_E164,
        email: 'info@muhammadproperties.online',
        foundingDate: '2010',
        priceRange: 'PKR',
        currenciesAccepted: 'PKR',
        knowsLanguage: ['ur', 'pa', 'en'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Opposite Azhar Residencies, GT Road',
          addressLocality: 'Okara',
          addressRegion: 'Punjab',
          postalCode: '56300',
          addressCountry: 'PK'
        },
        geo: { '@type': 'GeoCoordinates', latitude: 30.8058, longitude: 73.4511 },
        hasMap: 'https://www.openstreetmap.org/?mlat=30.8058&mlon=73.4511#map=14/30.8058/73.4511',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '19:00'
          }
        ],
        areaServed: [
          { '@type': 'City', name: 'Okara' },
          { '@type': 'AdministrativeArea', name: 'Okara District' },
          { '@type': 'AdministrativeArea', name: 'Okara Tehsil' },
          { '@type': 'AdministrativeArea', name: 'Depalpur Tehsil' },
          { '@type': 'AdministrativeArea', name: 'Renala Khurd Tehsil' },
          { '@type': 'Place', name: 'Okara Cantonment' },
          { '@type': 'Place', name: 'Basirpur' },
          { '@type': 'Place', name: 'Haveli Lakha' },
          { '@type': 'Place', name: 'Hujra Shah Muqeem' }
        ],
        makesOffer: t.jsonld.services.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: plain(s.name), serviceType: plain(s.type) }
        })),
        sameAs: ['https://www.facebook.com/people/Muhammadproperty/61579241310289/']
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: t.htmlLang,
        isPartOf: { '@id': `${url}#webpage` },
        mainEntity: t.faq.items.map((it) => ({
          '@type': 'Question',
          name: plain(it.q),
          acceptedAnswer: { '@type': 'Answer', text: it.a.map(plain).join(' ') }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: t.jsonld.breadcrumbs.map((name, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: plain(name),
          item: urlFor(t, ['', '#areas', '#listings', '#prices'][i])
        }))
      }
    ]
  };
}

/* ------------------------------------------------------------------- page -- */

function page(t) {
  // Depth-aware relative base: "" at the root, "../" inside /ur/ and /pa/.
  const base = t.path === '/' ? '' : '../';
  const rtl = t.dir === 'rtl';
  const url = urlFor(t);

  const alternates = langs
    .map((l) => `<link rel="alternate" hreflang="${l.hreflang}" href="${urlFor(l)}">`)
    .concat([`<link rel="alternate" hreflang="x-default" href="${SITE}/">`])
    .map((s) => '  ' + s)
    .join('\n');

  const i18n = {
    lang: t.code,
    dir: t.dir,
    openMenu: plain(t.ui.openMenu),
    closeMenu: plain(t.ui.closeMenu),
    themeLight: plain(t.ui.themeLabel),
    statusOk: plain(t.contact.statusOk),
    wa: Object.fromEntries(Object.entries(t.wa).map(([k, v]) => [k, plain(v)]))
  };

  return `<!DOCTYPE html>
<html lang="${t.htmlLang}" dir="${t.dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0f7a67" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#07100e" media="(prefers-color-scheme: dark)">

<title>${t.meta.title}</title>
<meta name="description" content="${attr(plain(t.meta.description))}">
<meta name="keywords" content="${attr(plain(t.meta.keywords))}">
<meta name="author" content="${attr(plain(t.meta.author))}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="geo.region" content="PK-PB">
<meta name="geo.placename" content="${attr(plain(t.meta.placename))}">
<meta name="geo.position" content="30.8058;73.4511">
<meta name="ICBM" content="30.8058, 73.4511">
<link rel="canonical" href="${url}">

${alternates}

<meta property="og:site_name" content="${attr(plain(t.jsonld.siteName))}">
<meta property="og:title" content="${attr(plain(t.meta.ogTitle))}">
<meta property="og:description" content="${attr(plain(t.meta.ogDescription))}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${t.ogLocale}">
${langs.filter((l) => l.code !== t.code).map((l) => `<meta property="og:locale:alternate" content="${l.ogLocale}">`).join('\n')}
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${attr(plain(t.meta.ogImageAlt))}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(plain(t.meta.twTitle))}">
<meta name="twitter:description" content="${attr(plain(t.meta.twDescription))}">
<meta name="twitter:image" content="${SITE}/images/og-image.jpg">

<link rel="icon" href="${base}images/favicon.ico" sizes="any">
<link rel="icon" href="${base}images/logo.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}images/apple-touch-icon.png">
<link rel="stylesheet" href="${base}css/styles.css">
${rtl ? `<link rel="stylesheet" href="${base}css/nastaliq.css">\n<link rel="preload" as="font" type="font/woff2" href="${base}fonts/noto-nastaliq-urdu-arabic.woff2" crossorigin>\n` : ''}<link rel="preload" as="image" href="${base}images/okara/okara-evening.jpg" fetchpriority="high">
</head>

<body>
<a class="skip-link" href="#main">${t.skipLink}</a>

${SPRITE}

${header(t, base)}

<main id="main">
<span id="top"></span>

${hero(t, base)}

${facts(t)}

${services(t)}

${areas(t, base)}

${listings(t, base)}

${prices(t)}

${process(t)}

${about(t, base)}

${faq(t)}

${contact(t)}

${credits(t)}
</main>

${footer(t, base)}

<div class="fabs">
  <a class="fab fab--wa" href="${wa(t.wa.fabIntro)}" aria-label="${attr(plain(t.ui.whatsappFab))}" target="_blank" rel="noopener">
    ${icon('i-wa')}
  </a>
  <button class="fab fab--top" id="toTop" type="button" aria-label="${attr(plain(t.ui.backToTop))}">
    ${icon('i-up')}
  </button>
</div>

<script type="application/ld+json">
${json(structuredData(t))}
</script>

<script>window.MP_I18N = ${json(i18n)};</script>
<script src="${base}js/main.js" defer></script>
</body>
</html>
`;
}

/* -------------------------------------------------------------- 404 & seo -- */

function notFoundPage() {
  const t = byCode.en;
  const others = langs
    .filter((l) => l.code !== 'en')
    .map((l) => `      <a class="btn btn--ghost" href="${l.path}" hreflang="${l.hreflang}" lang="${l.htmlLang}">${l.nativeName}</a>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="${t.htmlLang}" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.notFound.title}</title>
<meta name="description" content="${attr(plain(t.notFound.description))}">
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="#0f7a67" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#07100e" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/images/favicon.ico" sizes="any">
<link rel="icon" href="/images/logo.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<link rel="stylesheet" href="/css/styles.css">
</head>
<body>
<main id="main" class="section" style="min-height:100svh;display:grid;place-items:center;text-align:center">
  <div class="wrap" style="max-width:44rem">
    <img src="/images/logo.svg" alt="${attr(plain(t.brand.name))}" width="64" height="64"
         style="width:3.5rem;height:3.5rem;margin:0 auto 1.5rem;border-radius:14px">
    <span class="eyebrow">${t.notFound.eyebrow}</span>
    <h1 style="font-size:clamp(2rem,1.4rem+2.4vw,3rem)">${t.notFound.h1}</h1>
    <p class="lede">${t.notFound.lede}</p>
    <div class="hero-cta" style="justify-content:center">
      <a class="btn" href="/">${t.notFound.cta1}</a>
      <a class="btn btn--ghost" href="/#listings">${t.notFound.cta2}</a>
      <a class="btn btn--wa" href="https://wa.me/${WHATSAPP}">${t.notFound.cta3}</a>
    </div>
    <div class="hero-cta" style="justify-content:center;margin-top:1rem">
${others}
    </div>
    <p class="lede" style="font-size:.92rem;margin-top:2rem">
      ${t.brand.name} &middot; ${t.contact.address} &middot;
      <a href="tel:${PHONE_E164.replace(/-/g, '')}">${PHONE_HUMAN}</a>
    </p>
  </div>
</main>
</body>
</html>
`;
}

function sitemap() {
  const sections = ['#areas', '#listings', '#prices', '#faq', '#contact'];
  const alt = (hash = '') =>
    langs
      .map((l) => `      <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${urlFor(l, hash)}"/>`)
      .concat([`      <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/${hash}"/>`])
      .join('\n');

  const images = [
    ['okara-evening.jpg', 'Sunset over farmland at Okara, Punjab'],
    ['okara-railway-station.jpg', 'Okara Railway Station, Punjab, Pakistan'],
    ['okara-company-bagh-chowk.jpg', 'Company Bagh Chowk, Okara'],
    ['okara-jinnah-park-chowk.jpg', 'Jinnah Park Chowk, Okara'],
    ['okara-zaman-park.jpg', 'Mian Muhammad Zaman Public Park, Okara'],
    ['okara-cantt-cmh.jpg', 'Okara Cantonment'],
    ['okara-gt-road-mills.jpg', 'GT Road commercial belt, Okara'],
    ['depalpur-city.jpg', 'Depalpur city, Okara District'],
    ['renala-kalma-chowk.jpg', 'Kalma Chowk, Renala Khurd']
  ]
    .map(
      (i) => `    <image:image>
      <image:loc>${SITE}/images/okara/${i[0]}</image:loc>
      <image:title>${i[1]}</image:title>
    </image:image>`
    )
    .join('\n');

  const entries = [];
  for (const l of langs) {
    entries.push(`  <url>
    <loc>${urlFor(l)}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${l.code === 'en' ? '1.0' : '0.9'}</priority>
${alt()}
${l.code === 'en' ? images + '\n' : ''}  </url>`);
  }
  for (const hash of sections) {
    for (const l of langs) {
      entries.push(`  <url>
    <loc>${urlFor(l, hash)}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
${alt(hash)}
  </url>`);
    }
  }
  entries.push(`  <url>
    <loc>${SITE}/llms.txt</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

/* ------------------------------------------------------------------- main -- */

function write(rel, contents) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents, 'utf8');
  const kb = (Buffer.byteLength(contents, 'utf8') / 1024).toFixed(1);
  console.log(`  ${rel.padEnd(22)} ${kb.padStart(7)} KB`);
}

console.log('\nBuilding muhammadproperties.online\n');
validate();
for (const l of langs) {
  write(l.path === '/' ? 'index.html' : `${l.path.replace(/^\/|\/$/g, '')}/index.html`, page(l));
}
write('404.html', notFoundPage());
write('sitemap.xml', sitemap());
console.log(`\nDone — ${langs.length} languages: ${langs.map((l) => l.code).join(', ')}\n`);
