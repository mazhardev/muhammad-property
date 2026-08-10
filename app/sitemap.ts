import type { MetadataRoute } from 'next';
import { allLangs } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

// Required by `output: 'export'` — the sitemap is generated once at build time.
export const dynamic = 'force-static';

const SECTIONS = ['#areas', '#listings', '#prices', '#faq', '#contact'];

/** Every language of every entry points at every other, plus x-default. */
function languages(hash = ''): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of allLangs) map[l.hreflang] = `${SITE_URL}${l.path}${hash}`;
  map['x-default'] = `${SITE_URL}/${hash}`;
  return map;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const homes = allLangs.map((l) => ({
    url: `${SITE_URL}${l.path}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: l.code === 'en' ? 1 : 0.9,
    alternates: { languages: languages() },
  }));

  const sections = SECTIONS.flatMap((hash) =>
    allLangs.map((l) => ({
      url: `${SITE_URL}${l.path}${hash}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: { languages: languages(hash) },
    }))
  );

  return [...homes, ...sections];
}
