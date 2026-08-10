'use client';

import { useState } from 'react';
import type { Content } from '@/lib/content';

/**
 * Only the chips are client-side. The twelve property cards stay server
 * rendered inside #listingGrid so crawlers and AI agents see every listing in
 * the HTML; filtering just toggles a class on cards that are already there.
 */
export function ListingFilters({ t }: { t: Content }) {
  const [active, setActive] = useState('all');

  function apply(key: string) {
    setActive(key);
    document.querySelectorAll<HTMLElement>('#listingGrid .listing').forEach((card) => {
      card.classList.toggle('is-hidden', key !== 'all' && card.dataset.type !== key);
    });
  }

  return (
    <div className="filters reveal" role="group" aria-label={t.listings.filterLabel}>
      {t.listings.filters.map((f) => (
        <button
          key={f.key}
          className="chip"
          type="button"
          data-filter={f.key}
          aria-pressed={active === f.key}
          onClick={() => apply(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
