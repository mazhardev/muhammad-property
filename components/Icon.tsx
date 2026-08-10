import type { CSSProperties } from 'react';

/** References a symbol in the inline sprite rendered once per page. */
export function Icon({
  id,
  solid = false,
  className = 'icon',
  style,
}: {
  id: string;
  /** Some marks (WhatsApp, Facebook) are filled paths rather than strokes. */
  solid?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      style={solid ? { fill: 'currentColor', stroke: 'none', ...style } : style}
    >
      <use href={`#${id}`} />
    </svg>
  );
}

/**
 * Icons are inlined as a sprite rather than loaded from an icon font CDN, which
 * keeps the page to a handful of requests and works offline.
 */
export function Sprite() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }} aria-hidden="true">
      <symbol id="i-home" viewBox="0 0 24 24">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.8V21h14V9.8" />
        <path d="M9.5 21v-6h5v6" />
      </symbol>
      <symbol id="i-tag" viewBox="0 0 24 24">
        <path d="M20.6 13.4 12 22l-9-9V4h9l8.6 8.6a1.4 1.4 0 0 1 0 2Z" />
        <circle cx="7.5" cy="7.5" r="1.4" />
      </symbol>
      <symbol id="i-key" viewBox="0 0 24 24">
        <circle cx="7.5" cy="15.5" r="4.5" />
        <path d="M10.8 12.3 21 2.1" />
        <path d="m17.5 5.6 2.4 2.4" />
        <path d="m14.6 8.5 2.4 2.4" />
      </symbol>
      <symbol id="i-map" viewBox="0 0 24 24">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </symbol>
      <symbol id="i-crop" viewBox="0 0 24 24">
        <path d="M3 3v14a4 4 0 0 0 4 4h14" />
        <path d="M7 3v10h10" />
        <path d="M21 7H11v10" />
      </symbol>
      <symbol id="i-scale" viewBox="0 0 24 24">
        <path d="M12 3v18" />
        <path d="M5 7h14" />
        <path d="m5 7-3 7h6Z" />
        <path d="m19 7-3 7h6Z" />
      </symbol>
      <symbol id="i-doc" viewBox="0 0 24 24">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </symbol>
      <symbol id="i-shield" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 11 2 2 4-4" />
      </symbol>
      <symbol id="i-check" viewBox="0 0 24 24">
        <path d="m4 12 5 5L20 6" />
      </symbol>
      <symbol id="i-phone" viewBox="0 0 24 24">
        <path d="M21 16.9v2.8a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3-8.6A2 2 0 0 1 3.3 2H6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
      </symbol>
      <symbol id="i-mail" viewBox="0 0 24 24">
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <path d="m3 6.5 9 6 9-6" />
      </symbol>
      <symbol id="i-clock" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5.2l3.3 2" />
      </symbol>
      <symbol id="i-sun" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </symbol>
      <symbol id="i-menu" viewBox="0 0 24 24">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </symbol>
      <symbol id="i-close" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" />
      </symbol>
      <symbol id="i-up" viewBox="0 0 24 24">
        <path d="M12 20V5" />
        <path d="m5 12 7-7 7 7" />
      </symbol>
      <symbol id="i-info" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24">
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </symbol>
      <symbol id="i-globe" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.2 9h17.6M3.2 15h17.6" />
        <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
      </symbol>
      <symbol id="i-fb" viewBox="0 0 24 24">
        <path d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V2.6A18 18 0 0 0 14.8 2.5C12.2 2.5 10.5 4.1 10.5 7v1.5H8V12h2.5v9.5H14V12h2.6l.4-3.5Z" />
      </symbol>
      <symbol id="i-wa" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1-1.4-1-2.6 0-1.3.7-1.9 1-2.1.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2 1.2.3.1.4.1.6-.1l.8-1c.2-.2.3-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.6-.1 1.2Z" />
      </symbol>
    </svg>
  );
}
