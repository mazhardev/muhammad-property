import type { ReactNode } from 'react';
import { ThemeScript } from '@/components/client/ThemeScript';
import { getContent, type Lang } from '@/lib/content';
import { HERO_IMAGE } from '@/lib/site';

import '@/styles/styles.css';

/**
 * Shared body of all three root layouts. Next only lets one layout own the
 * <html> element per route tree, and lang/dir have to be correct in the
 * server-rendered HTML, so each language gets its own root layout in a route
 * group — they all delegate here.
 */
export function SiteShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const t = getContent(lang);
  const rtl = t.dir === 'rtl';

  return (
    <html lang={t.htmlLang} dir={t.dir} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f7a67" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#07100e" media="(prefers-color-scheme: dark)" />
        <link rel="preload" as="image" href={HERO_IMAGE} fetchPriority="high" />
        {/* Nastaliq is a big face, so only the right-to-left pages pay for it.
            The @font-face unicode-range means Latin pages never fetch it. */}
        {rtl && (
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            href="/fonts/noto-nastaliq-urdu-arabic.woff2"
            crossOrigin="anonymous"
          />
        )}
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
