import en from '@/content/en.json';
import ur from '@/content/ur.json';
import pa from '@/content/pa.json';

/**
 * English is the reference shape. The `satisfies Content` checks below are the
 * whole point of this file: if a translator adds, removes or renames a key in
 * ur.json or pa.json, or gives an array the wrong element shape, `next build`
 * fails with a type error instead of quietly shipping a half-translated page.
 * This replaces the hand-rolled parity validator the old generator ran.
 */
export type Content = typeof en;

export const LANGS = ['en', 'ur', 'pa'] as const;
export type Lang = (typeof LANGS)[number];

const dictionaries = {
  en,
  ur: ur satisfies Content,
  pa: pa satisfies Content,
} satisfies Record<Lang, Content>;

export function getContent(lang: Lang): Content {
  return dictionaries[lang];
}

/** Every language, in menu order — used by the switcher, hreflang and sitemap. */
export const allLangs: readonly Content[] = LANGS.map((l) => dictionaries[l]);

/** Content-derived helpers -------------------------------------------------- */

export type AreaCard = Content['areas']['cards'][number];
export type ListingCard = Content['listings']['cards'][number];
export type ServiceCard = Content['services']['cards'][number];
export type FaqItem = Content['faq']['items'][number];
