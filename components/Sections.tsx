import { Icon } from '@/components/Icon';
import { SearchForm } from '@/components/client/Forms';
import { ListingFilters } from '@/components/client/ListingFilters';
import type { Content } from '@/lib/content';
import { COMMONS_DISTRICT, COMMONS_OKARA, HERO_IMAGE, telHref, waLink } from '@/lib/site';

type P = { t: Content };

/* ------------------------------------------------------------------ hero -- */

export function Hero({ t }: P) {
  return (
    <section className="hero" id="hero">
      <div className="hero-media">
        <img
          src={HERO_IMAGE}
          alt={t.about.figures[0].alt}
          width={1280}
          height={792}
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="wrap">
        <div className="hero-inner">
          <p className="hero-badge">
            <span className="dot" /> {t.hero.badge}
          </p>
          <h1>
            {t.hero.h1Before}
            <em>{t.hero.h1Highlight}</em>
            {t.hero.h1After}
          </h1>
          <p className="hero-lede">{t.hero.lede}</p>

          <div className="hero-cta">
            <a className="btn btn--wa" href={waLink(t.hero.waIntro)} target="_blank" rel="noopener">
              <Icon id="i-wa" solid /> {t.hero.ctaWhatsapp}
            </a>
            <a className="btn btn--light" href="#listings">
              {t.hero.ctaBrowse}
            </a>
          </div>

          <div className="hero-stats">
            {t.hero.stats.map((s) => (
              <div key={s.value}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <SearchForm t={t} />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- facts -- */

export function Facts({ t }: P) {
  return (
    <section className="facts" aria-label={t.facts.label}>
      {t.facts.items.map((f) => (
        <div className="fact" key={f.value}>
          <b>{f.value}</b>
          <span>{f.label}</span>
          <small>{f.note}</small>
        </div>
      ))}
    </section>
  );
}

/* -------------------------------------------------------------- services -- */

export function Services({ t }: P) {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2>{t.services.h2}</h2>
          <p className="lede">{t.services.lede}</p>
        </div>

        <div className="grid grid-3">
          {t.services.cards.map((c) => (
            <article className="card svc-card reveal" key={c.h3}>
              <span className="badge">
                <Icon id={c.icon} />
              </span>
              <h3>{c.h3}</h3>
              <p>{c.p}</p>
              <ul>
                {c.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
              <a className="card-link" href={c.linkHref}>
                {c.linkText} <Icon id="i-arrow" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- areas -- */

export function Areas({ t }: P) {
  return (
    <section className="section section--soft" id="areas">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{t.areas.eyebrow}</span>
          <h2>{t.areas.h2}</h2>
          <p className="lede">{t.areas.lede}</p>
        </div>

        <div className="grid grid-3">
          {t.areas.cards.map((c) => (
            <article className="card area-card reveal" key={c.h3}>
              <div className="area-media">
                <img
                  src={`/images/okara/${c.img}`}
                  alt={c.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                />
                <span className="area-tag">{c.tag}</span>
              </div>
              <div className="area-body">
                <h3>{c.h3}</h3>
                <p>{c.p}</p>
                <p className="area-rate">{c.rate}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- listings -- */

export function Listings({ t }: P) {
  return (
    <section className="section" id="listings">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{t.listings.eyebrow}</span>
          <h2>{t.listings.h2}</h2>
          <p className="lede">{t.listings.lede}</p>
        </div>

        <ListingFilters t={t} />

        <div className="grid grid-3" id="listingGrid">
          {t.listings.cards.map((c) => (
            <article className="card listing reveal" data-type={c.type} key={c.h3}>
              <div className="listing-media">
                <img
                  src={`/images/okara/${c.img}`}
                  alt={c.alt}
                  width={800}
                  height={500}
                  loading="lazy"
                  decoding="async"
                />
                <span className="listing-type">{c.badge}</span>
                <span className="area-tag">{c.tag}</span>
              </div>
              <div className="listing-body">
                <h3>{c.h3}</h3>
                <p className="listing-loc">
                  <Icon id="i-map" /> {c.loc}
                </p>
                <ul className="listing-specs">
                  {c.specs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="listing-price">
                  {c.price} <small>{c.priceNote}</small>
                </p>
                <div className="listing-actions">
                  <a
                    className="btn btn--sm btn--wa"
                    href={waLink(c.wa)}
                    target="_blank"
                    rel="noopener"
                  >
                    {t.listings.ask}
                  </a>
                  <a className="btn btn--sm btn--ghost" href={telHref}>
                    {t.listings.call}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="note reveal">
          <Icon id="i-info" />
          <span>
            <strong>{t.listings.noteStrong}</strong> {t.listings.noteText}
          </span>
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- prices -- */

export function Prices({ t }: P) {
  return (
    <section className="section section--soft" id="prices">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{t.prices.eyebrow}</span>
          <h2>{t.prices.h2}</h2>
          <p className="lede">{t.prices.lede}</p>
        </div>

        <div className="table-wrap reveal">
          <table className="rates">
            <caption>{t.prices.caption}</caption>
            <thead>
              <tr>
                {t.prices.cols.map((c) => (
                  <th scope="col" key={c}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.prices.rows.map((r) => (
                <tr key={r.join('|')}>
                  <td>{r[0]}</td>
                  <td className="num">{r[1]}</td>
                  <td className="num">{r[2]}</td>
                  <td>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-3" style={{ marginTop: '2.5rem' }}>
          {t.prices.cards.map((c) => (
            <article className="card svc-card reveal" key={c.h3}>
              <h3>{c.h3}</h3>
              <ul>
                {c.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- process -- */

export function Process({ t }: P) {
  const panel = (p: Content['process']['docs']) => (
    <article className="card svc-card">
      <span className="badge">
        <Icon id={p.icon} />
      </span>
      <h3>{p.h3}</h3>
      <ul>
        {p.list.map((li) => (
          <li key={li}>{li}</li>
        ))}
      </ul>
    </article>
  );

  return (
    <section className="section" id="process">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{t.process.eyebrow}</span>
          <h2>{t.process.h2}</h2>
          <p className="lede">{t.process.lede}</p>
        </div>

        <div className="steps">
          {t.process.steps.map((s) => (
            <article className="step reveal" key={s.h3}>
              <h3>{s.h3}</h3>
              <p>{s.p}</p>
            </article>
          ))}
        </div>

        <div className="grid grid-2 reveal" style={{ marginTop: 'clamp(2rem,4vw,3rem)' }}>
          {panel(t.process.docs)}
          {panel(t.process.checks)}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- about -- */

export function About({ t }: P) {
  return (
    <section className="section section--soft" id="about">
      <div className="wrap">
        <div className="about">
          <div className="about-text reveal">
            <span className="eyebrow">{t.about.eyebrow}</span>
            <h2>{t.about.h2}</h2>
            <p className="lede">{t.about.lede}</p>
            {t.about.paras.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            <ul className="about-list">
              {t.about.list.map((li) => (
                <li key={li}>
                  <Icon id="i-check" /> {li}
                </li>
              ))}
            </ul>
            <div className="hero-cta" style={{ marginTop: '1.75rem' }}>
              <a className="btn" href="#contact">
                {t.about.cta1}
              </a>
              <a className="btn btn--ghost" href={telHref}>
                {t.about.cta2}
              </a>
            </div>
          </div>

          <div className="about-media reveal">
            {t.about.figures.map((f, i) => (
              <figure key={f.img}>
                <img
                  src={`/images/okara/${f.img}`}
                  alt={f.alt}
                  width={i === 0 ? 720 : 800}
                  height={i === 0 ? 1152 : 600}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- faq -- */

export function Faq({ t }: P) {
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">{t.faq.eyebrow}</span>
          <h2>{t.faq.h2}</h2>
          <p className="lede">{t.faq.lede}</p>
        </div>

        <div className="faq reveal">
          {t.faq.items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <div className="faq-body">
                {item.a.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- credits -- */

export function Credits({ t }: P) {
  return (
    <section className="section section--line" id="credits">
      <div className="wrap credits">
        <h2>{t.credits.h2}</h2>
        <p style={{ marginBottom: '.9rem' }}>{t.credits.intro}</p>
        <ul>
          {t.credits.items.map((i) => (
            <li key={i.slice(0, 40)}>{i}</li>
          ))}
        </ul>
        <p style={{ marginTop: '.9rem' }}>
          {t.credits.sourcePrefix}{' '}
          <a href={COMMONS_OKARA} target="_blank" rel="noopener">
            {t.credits.sourceCat1}
          </a>{' '}
          {t.credits.sourceAnd}{' '}
          <a href={COMMONS_DISTRICT} target="_blank" rel="noopener">
            {t.credits.sourceCat2}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
