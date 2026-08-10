import type { Metadata } from 'next';
import { SiteShell } from '@/components/RootLayout';
import { allLangs, getContent } from '@/lib/content';
import { PHONE_HUMAN, SITE_URL, WHATSAPP, telHref } from '@/lib/site';

/*
 * GitHub Pages serves /404.html for any path it cannot match, so this is the
 * page a mistyped or dead link lands on. Written in English because we cannot
 * know which language the visitor wanted, with links out to the other two.
 *
 * There is no app/layout.tsx — each language owns its own root layout in a
 * route group — so this file renders the shell itself.
 */
const t = getContent('en');

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: t.notFound.title,
  description: t.notFound.description,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SiteShell lang="en">
      <main
        id="main"
        className="section"
        style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', textAlign: 'center' }}
      >
        <div className="wrap" style={{ maxWidth: '44rem' }}>
          <img
            src="/images/logo.svg"
            alt={t.brand.name}
            width={64}
            height={64}
            style={{ width: '3.5rem', height: '3.5rem', margin: '0 auto 1.5rem', borderRadius: '14px' }}
          />
          <span className="eyebrow">{t.notFound.eyebrow}</span>
          <h1 style={{ fontSize: 'clamp(2rem,1.4rem+2.4vw,3rem)' }}>{t.notFound.h1}</h1>
          <p className="lede">{t.notFound.lede}</p>

          <div className="hero-cta" style={{ justifyContent: 'center' }}>
            <a className="btn" href="/">
              {t.notFound.cta1}
            </a>
            <a className="btn btn--ghost" href="/#listings">
              {t.notFound.cta2}
            </a>
            <a className="btn btn--wa" href={`https://wa.me/${WHATSAPP}`}>
              {t.notFound.cta3}
            </a>
          </div>

          <div className="hero-cta" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            {allLangs
              .filter((l) => l.code !== 'en')
              .map((l) => (
                <a
                  key={l.code}
                  className="btn btn--ghost"
                  href={l.path}
                  hrefLang={l.hreflang}
                  lang={l.htmlLang}
                >
                  {l.nativeName}
                </a>
              ))}
          </div>

          <p className="lede" style={{ fontSize: '.92rem', marginTop: '2rem' }}>
            {t.brand.name} · {t.contact.address} ·{' '}
            <a className="ltr" href={telHref}>
              {PHONE_HUMAN}
            </a>
          </p>
        </div>
      </main>
    </SiteShell>
  );
}
