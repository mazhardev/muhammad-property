import { Sprite } from '@/components/Icon';
import { ScrollEffects } from '@/components/client/ScrollEffects';
import { Contact, Fabs, SiteFooter, SiteHeader } from '@/components/Chrome';
import {
  About,
  Areas,
  Credits,
  Facts,
  Faq,
  Hero,
  Listings,
  Prices,
  Process,
  Services,
} from '@/components/Sections';
import { getContent, type Lang } from '@/lib/content';
import { buildJsonLd } from '@/lib/seo';

/**
 * The whole page, in one place. All three language routes render this — the
 * only difference between them is `lang`, which selects the dictionary and,
 * via the route's layout, the html lang/dir attributes.
 */
export function Page({ lang }: { lang: Lang }) {
  const t = getContent(lang);

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipLink}
      </a>

      <Sprite />

      <SiteHeader t={t} lang={lang} />

      <main id="main">
        <span id="top" />

        <Hero t={t} />
        <Facts t={t} />
        <Services t={t} />
        <Areas t={t} />
        <Listings t={t} />
        <Prices t={t} />
        <Process t={t} />
        <About t={t} />
        <Faq t={t} />
        <Contact t={t} />
        <Credits t={t} />
      </main>

      <SiteFooter t={t} lang={lang} />
      <Fabs t={t} />

      <ScrollEffects />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(lang)) }}
      />
    </>
  );
}
