'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { allLangs, type Content, type Lang } from '@/lib/content';
import { telHref } from '@/lib/site';

/** Theme toggle, mobile menu button and language switcher. */
export function HeaderControls({ t, lang }: { t: Content; lang: Lang }) {
  const [navOpen, setNavOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDetailsElement>(null);

  // The nav list itself is server-rendered, so toggle it by class.
  useEffect(() => {
    const nav = document.getElementById('navLinks');
    nav?.classList.toggle('is-open', navOpen);
  }, [navOpen]);

  // Close the menus on an outside click or Escape, the way a menu should behave.
  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setNavOpen(false);
      setLangOpen(false);
    };
    const onNavClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('#navLinks a')) setNavOpen(false);
    };
    document.addEventListener('click', onPointer);
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onNavClick);
    return () => {
      document.removeEventListener('click', onPointer);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onNavClick);
    };
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const next = (root.getAttribute('data-theme') || system) === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('mp-theme', next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  }

  return (
    <div className="nav-actions">
      {/* <details> so the switcher still works with JavaScript disabled. */}
      <details
        className="lang-switch"
        id="langSwitch"
        ref={langRef}
        open={langOpen}
        onToggle={(e) => setLangOpen((e.currentTarget as HTMLDetailsElement).open)}
      >
        <summary title={t.ui.langLabel} aria-label={t.ui.langMenuLabel}>
          <Icon id="i-globe" />
          <span className="native">{t.nativeName}</span>
        </summary>
        <div className="lang-menu" role="group" aria-label={t.ui.langMenuLabel}>
          {allLangs.map((l) => (
            <a
              key={l.code}
              href={l.path}
              hrefLang={l.hreflang}
              lang={l.htmlLang}
              aria-current={l.code === lang ? 'true' : undefined}
            >
              <span className="native">{l.nativeName}</span>
              {l.nativeName !== l.englishName && <small>{l.englishName}</small>}
            </a>
          ))}
        </div>
      </details>

      <button
        className="icon-btn theme-toggle"
        id="themeToggle"
        type="button"
        onClick={toggleTheme}
        aria-label={t.ui.themeLabel}
        title={t.ui.themeLabel}
      >
        <Icon id="i-sun" />
      </button>

      <a className="btn btn--sm" href={telHref}>
        <Icon id="i-phone" />
        <span className="ltr">{t.ui.callShort}</span>
      </a>

      <button
        className="icon-btn nav-toggle"
        id="navToggle"
        type="button"
        aria-expanded={navOpen}
        aria-controls="navLinks"
        aria-label={navOpen ? t.ui.closeMenu : t.ui.openMenu}
        onClick={() => setNavOpen((v) => !v)}
      >
        <Icon id={navOpen ? 'i-close' : 'i-menu'} />
      </button>
    </div>
  );
}
