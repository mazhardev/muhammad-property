import { Icon } from '@/components/Icon';
import { HeaderControls } from '@/components/client/HeaderControls';
import { EnquiryForm } from '@/components/client/Forms';
import { allLangs, type Content, type Lang } from '@/lib/content';
import {
  EMAIL,
  FACEBOOK,
  MAP_EMBED,
  MAP_LINK,
  PHONE_HUMAN,
  WHATSAPP,
  mailHref,
  telHref,
} from '@/lib/site';

/* ---------------------------------------------------------------- header -- */

export function SiteHeader({ t, lang }: { t: Content; lang: Lang }) {
  const navKeys = Object.keys(t.nav) as (keyof Content['nav'])[];

  return (
    <header className="site-header" id="siteHeader">
      <div className="wrap">
        <nav className="nav" aria-label={t.ui.langMenuLabel}>
          <a className="brand" href={t.path}>
            <img src="/images/logo.svg" alt="" width={64} height={64} />
            <span className="brand-name">
              <b>{t.brand.name}</b>
              <span>{t.brand.tagline}</span>
            </span>
          </a>

          <ul className="nav-links" id="navLinks">
            {navKeys.map((key) => (
              <li key={key}>
                <a href={`#${key}`}>{t.nav[key]}</a>
              </li>
            ))}
          </ul>

          <HeaderControls t={t} lang={lang} />
        </nav>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------- contact -- */

export function Contact({ t }: { t: Content }) {
  const c = t.contact;

  return (
    <section className="section section--soft" id="contact">
      <div className="wrap">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">{c.eyebrow}</span>
          <h2>{c.h2}</h2>
          <p className="lede">{c.lede}</p>
        </div>

        <div className="contact">
          <div className="contact-card reveal">
            <h3>{c.officeH3}</h3>
            <ul className="contact-list">
              <li>
                <Icon id="i-map" />
                <span>
                  <b>{c.addressLabel}</b>
                  <a href={MAP_LINK} target="_blank" rel="noopener">
                    {c.address}
                  </a>
                </span>
              </li>
              <li>
                <Icon id="i-phone" />
                <span>
                  <b>{c.phoneLabel}</b>
                  <a className="ltr" href={telHref}>
                    {PHONE_HUMAN}
                  </a>
                </span>
              </li>
              <li>
                <Icon id="i-mail" />
                <span>
                  <b>{c.emailLabel}</b>
                  <a className="ltr" href={mailHref}>
                    {EMAIL}
                  </a>
                </span>
              </li>
              <li>
                <Icon id="i-clock" />
                <span>
                  <b>{c.hoursLabel}</b>
                  <span style={{ fontWeight: 600 }}>
                    {c.hours.map((line, i) => (
                      <span key={line}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </span>
                </span>
              </li>
            </ul>

            <div className="socials">
              <a href={FACEBOOK} target="_blank" rel="noopener" aria-label={t.ui.facebookLabel}>
                <Icon id="i-fb" solid />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener"
                aria-label={t.ui.whatsappLabel}
              >
                <Icon id="i-wa" solid />
              </a>
              <a href={mailHref} aria-label={t.ui.emailLabel}>
                <Icon id="i-mail" />
              </a>
            </div>
          </div>

          <div className="contact-card reveal">
            <h3>{c.formH3}</h3>
            <p className="lede" style={{ fontSize: '.95rem', marginTop: '.4rem' }}>
              {c.formNote}
            </p>
            <EnquiryForm t={t} />
          </div>
        </div>

        <div className="map-embed reveal">
          <iframe title={t.ui.mapTitle} src={MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- footer -- */

export function SiteFooter({ t, lang }: { t: Content; lang: Lang }) {
  const f = t.footer;

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <span className="footer-brand">
              <img src="/images/logo.svg" alt="" width={64} height={64} />
              <b>{t.brand.name}</b>
            </span>
            <p>{f.about}</p>
            <div className="footer-tags">
              {f.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div>
            <h3>{f.exploreH3}</h3>
            <ul>
              {f.exploreLinks.map((l) => (
                <li key={l.text}>
                  <a href={l.href}>{l.text}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>{f.typesH3}</h3>
            <ul>
              {f.typesLinks.map((l) => (
                <li key={l.text}>
                  <a href={l.href}>{l.text}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>{f.contactH3}</h3>
            <ul>
              <li>
                <a href={MAP_LINK} target="_blank" rel="noopener">
                  {f.addressShort.map((line, i) => (
                    <span key={line}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </a>
              </li>
              <li>
                <a className="ltr" href={telHref}>
                  {PHONE_HUMAN}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener">
                  {f.whatsappLink}
                </a>
              </li>
              <li>
                <a className="ltr" href={mailHref}>
                  {EMAIL}
                </a>
              </li>
              <li>{f.hoursShort}</li>
            </ul>

            <h3 style={{ marginTop: '1.75rem' }}>{f.langH3}</h3>
            <ul>
              {allLangs
                .filter((l) => l.code !== lang)
                .map((l) => (
                  <li key={l.code}>
                    <a href={l.path} hrefLang={l.hreflang} lang={l.htmlLang}>
                      {l.nativeName} — {l.englishName}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {f.rights}
          </p>
          <p>
            <a href="#credits">{f.creditsLink}</a> · <a href="/llms.txt">llms.txt</a> ·{' '}
            <a href="/sitemap.xml">{f.sitemapLink}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------- floating actions -- */

export function Fabs({ t }: { t: Content }) {
  return (
    <div className="fabs">
      <a
        className="fab fab--wa"
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t.wa.fabIntro)}`}
        aria-label={t.ui.whatsappFab}
        target="_blank"
        rel="noopener"
      >
        <Icon id="i-wa" />
      </a>
      <ToTop label={t.ui.backToTop} />
    </div>
  );
}

function ToTop({ label }: { label: string }) {
  // A plain link to #top works without JavaScript; ScrollEffects adds the
  // fade-in and the CSS handles smooth scrolling.
  return (
    <a className="fab fab--top" id="toTop" href="#top" aria-label={label}>
      <Icon id="i-up" />
    </a>
  );
}
