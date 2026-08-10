import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteShell } from '@/components/RootLayout';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('en');

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
