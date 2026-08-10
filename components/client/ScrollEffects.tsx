'use client';

import { useEffect } from 'react';

/**
 * Renders nothing. Attaches the three scroll-driven behaviours to markup that
 * is already in the static HTML: sticky-header state, the reveal-on-scroll
 * transition, and highlighting the nav link for the section you are looking at.
 *
 * Doing this by class rather than by React state keeps every section a server
 * component, so crawlers get the full page without running any JavaScript.
 */
export function ScrollEffects() {
  useEffect(() => {
    const header = document.getElementById('siteHeader');
    const toTop = document.getElementById('toTop');

    const onScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle('is-stuck', y > 8);
      toTop?.classList.toggle('is-visible', y > 500);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observers: IntersectionObserver[] = [];
    let fallback: number | undefined;

    // Reveal on scroll — skipped entirely when the visitor prefers less motion.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealables = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (reduced) {
      revealables.forEach((el) => el.classList.add('is-in'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
      );
      revealables.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i % 6, 5) * 55}ms`;
        revealObserver.observe(el);
      });
      observers.push(revealObserver);

      // Safety net: if the observer never fires — an odd viewport, a browser
      // quirk, a print stylesheet — show everything rather than leave the page
      // looking empty. Content visibility must never hang on an animation.
      fallback = window.setTimeout(() => {
        revealables.forEach((el) => el.classList.add('is-in'));
      }, 1500);
    }

    // Current-section highlighting in the nav.
    const navAnchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('#navLinks a[href^="#"]')
    );
    const sections = navAnchors
      .map((a) => document.getElementById(a.getAttribute('href')!.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navAnchors.forEach((a) => {
              if (a.getAttribute('href') === `#${entry.target.id}`) {
                a.setAttribute('aria-current', 'true');
              } else {
                a.removeAttribute('aria-current');
              }
            });
          });
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );
      sections.forEach((s) => spy.observe(s));
      observers.push(spy);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      observers.forEach((o) => o.disconnect());
      if (fallback !== undefined) window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
