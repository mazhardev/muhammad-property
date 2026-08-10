/** Facts about the business that never change with language. */

export const SITE_URL = 'https://www.muhammadproperties.online';

export const PHONE_E164 = '+923056847007';
export const PHONE_HUMAN = '+92 305 6847007';
export const WHATSAPP = '923056847007';
export const EMAIL = 'info@muhammadproperties.online';

export const GEO = { lat: 30.8058, lng: 73.4511 } as const;

export const MAP_LINK = `https://www.openstreetmap.org/?mlat=${GEO.lat}&mlon=${GEO.lng}#map=14/${GEO.lat}/${GEO.lng}`;
export const MAP_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=73.39%2C30.76%2C73.52%2C30.85&layer=mapnik&marker=30.8058%2C73.4511';

export const FACEBOOK = 'https://www.facebook.com/people/Muhammadproperty/61579241310289/';
export const COMMONS_OKARA = 'https://commons.wikimedia.org/wiki/Category:Okara';
export const COMMONS_DISTRICT = 'https://commons.wikimedia.org/wiki/Category:Okara_District';

export const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;
export const HERO_IMAGE = '/images/okara/okara-evening.jpg';

/** Builds a wa.me link with the message pre-filled. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export const telHref = `tel:${PHONE_E164}`;
export const mailHref = `mailto:${EMAIL}`;
