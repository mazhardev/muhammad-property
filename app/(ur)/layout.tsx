import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteShell } from '@/components/RootLayout';
import { buildMetadata } from '@/lib/seo';

import '@/styles/nastaliq.css';

export const metadata: Metadata = buildMetadata('ur');

export default function UrduRootLayout({ children }: { children: ReactNode }) {
  return <SiteShell lang="ur">{children}</SiteShell>;
}
