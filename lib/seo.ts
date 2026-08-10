import type { Metadata } from 'next';
import { allLangs, getContent, type Content, type Lang } from '@/lib/content';
import {
  EMAIL,
  FACEBOOK,
  GEO,
  MAP_LINK,
  OG_IMAGE,
  PHONE_E164,
  SITE_URL,
} from '@/lib/site';

const absolute = (path: string) => `${SITE_URL}${path}`;

/** hreflang cluster: every language points at every language, plus x-default. */
function alternateLanguages(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of allLangs) map[l.hreflang] = absolute(l.path);
  map['x-default'] = absolute('/');
  return map;
}

export function buildMetadata(lang: Lang): Metadata {
  const t = getContent(lang);
  const url = absolute(t.path);

  return {
    metadataBase: new URL(SITE_URL),
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    authors: [{ name: t.meta.author }],
    alternates: {
      canonical: url,
      languages: alternateLanguages(),
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    openGraph: {
      type: 'website',
      siteName: t.jsonld.siteName,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      url,
      locale: t.ogLocale,
      alternateLocale: allLangs.filter((l) => l.code !== lang).map((l) => l.ogLocale),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: t.meta.ogImageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.twTitle,
      description: t.meta.twDescription,
      images: [OG_IMAGE],
    },
    other: {
      'geo.region': 'PK-PB',
      'geo.placename': t.meta.placename,
      'geo.position': `${GEO.lat};${GEO.lng}`,
      ICBM: `${GEO.lat}, ${GEO.lng}`,
    },
    icons: {
      icon: [
        { url: '/images/favicon.ico', sizes: 'any' },
        { url: '/images/logo.svg', type: 'image/svg+xml' },
      ],
      apple: '/images/apple-touch-icon.png',
    },
  };
}

/**
 * One JSON-LD graph per page. The agent node keeps a single stable @id across
 * all three languages so search engines treat them as one business rather than
 * three; the page-level nodes are per-language and carry inLanguage.
 */
export function buildJsonLd(lang: Lang): object {
  const t: Content = getContent(lang);
  const url = absolute(t.path);
  const agentId = `${SITE_URL}/#agent`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: t.jsonld.siteName,
        description: t.jsonld.siteDescription,
        inLanguage: t.htmlLang,
        publisher: { '@id': agentId },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: t.jsonld.pageName,
        isPartOf: { '@id': `${url}#website` },
        about: { '@id': agentId },
        primaryImageOfPage: OG_IMAGE,
        inLanguage: t.htmlLang,
      },
      {
        '@type': ['RealEstateAgent', 'LocalBusiness'],
        '@id': agentId,
        name: t.brand.name,
        alternateName: 'MuhammadProperties.online',
        description: t.jsonld.agentDescription,
        url: absolute('/'),
        logo: absolute('/images/logo.svg'),
        image: OG_IMAGE,
        telephone: PHONE_E164,
        email: EMAIL,
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
          addressCountry: 'PK',
        },
        geo: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng },
        hasMap: MAP_LINK,
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '19:00',
          },
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
          { '@type': 'Place', name: 'Hujra Shah Muqeem' },
        ],
        makesOffer: t.jsonld.services.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.name, serviceType: s.type },
        })),
        sameAs: [FACEBOOK],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: t.htmlLang,
        isPartOf: { '@id': `${url}#webpage` },
        mainEntity: t.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: t.jsonld.breadcrumbs.map((name, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name,
          item: `${url}${['', '#areas', '#listings', '#prices'][i]}`,
        })),
      },
    ],
  };
}
