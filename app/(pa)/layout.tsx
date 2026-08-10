import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteShell } from '@/components/RootLayout';
import { buildMetadata } from '@/lib/seo';

import '@/styles/nastaliq.css';

export const metadata: Metadata = buildMetadata('pa');

export default function PunjabiRootLayout({ children }: { children: ReactNode }) {
  return <SiteShell lang="pa">{children}</SiteShell>;
}
