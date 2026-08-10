# muhammadproperties.online

The website for **Muhammad Properties**, property dealers on the GT Road in Okara, Punjab.
Next.js (App Router), exported as static HTML and hosted on GitHub Pages, published in
**English, Urdu and Punjabi (Shahmukhi)**.

| Language | URL | Script | Route file |
|---|---|---|---|
| English | `/` | Latin, left-to-right | `app/(en)/page.tsx` |
| اردو Urdu | `/ur/` | Nastaliq, right-to-left | `app/(ur)/ur/page.tsx` |
| پنجابی Punjabi | `/pa/` | Shahmukhi Nastaliq, right-to-left | `app/(pa)/pa/page.tsx` |

## Deployment — read this first

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it
to GitHub Pages.

**One-time setup:** in the repository, go to **Settings → Pages → Build and deployment →
Source** and choose **GitHub Actions**. Until that is switched over, Pages keeps serving the
old files from the branch and nothing this workflow builds will go live.

There is no `index.html` in the repo any more — the pages are generated into `out/` at build
time, and `out/` is git-ignored on purpose.

## Editing the site

Almost every change you will ever want to make is a text change, and all the text lives in
three files:

```
content/en.json     English wording
content/ur.json     Urdu wording
content/pa.json     Punjabi wording
```

Edit those, commit, push. The workflow does the rest.

The three files must keep exactly the same shape. `content/en.json` is the reference: its
type is derived automatically in `lib/content.ts`, and the other two are checked against it
at build time. If you add a property card or an FAQ to one language and forget the others,
`npm run typecheck` and the deploy both fail with a message pointing at the mismatch, rather
than quietly publishing a half-translated page.

Write real characters, not HTML entities — `—` not `&mdash;`, `&` not `&amp;`. React renders
these files as text.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Static export into `out/` |
| `npm start` | Serves the built `out/` folder, exactly as GitHub Pages will |
| `npm run typecheck` | Checks the three content files agree, plus all the TypeScript |

## Where things live

```
app/                    routes — one thin file per language, plus not-found and sitemap
  (en)/ (ur)/ (pa)/     route groups, each with its own root layout so <html lang/dir>
                        is correct in the server-rendered HTML
components/
  Page.tsx              composes the whole page
  Sections.tsx          hero, facts, services, areas, listings, prices, process, about, faq
  Chrome.tsx            header, contact, footer, floating buttons
  Icon.tsx              inline SVG sprite — no icon font, no CDN
  client/               the only components that ship JavaScript
lib/
  content.ts            loads the JSON and enforces translation parity
  seo.ts                metadata, hreflang and JSON-LD
  site.ts               phone, address, map and image constants
content/                wording, one file per language  ← edit these
styles/
  styles.css            design system, including all right-to-left rules
  nastaliq.css          @font-face for Urdu/Punjabi, imported only by those layouts
public/                 served verbatim at the site root
  images/okara/         real photographs of Okara District (see CREDITS.md)
  fonts/                self-hosted Noto Nastaliq Urdu subset (SIL OFL 1.1)
  robots.txt            allows search engines and AI crawlers explicitly
  llms.txt              plain-text summary of the business for AI crawlers
  CNAME                 the custom domain
```

## Things worth knowing

- **The pages work without JavaScript.** Every listing, area, FAQ and price row is in the
  server-rendered HTML, so crawlers and AI agents see the whole page. JavaScript only adds
  the theme toggle, the mobile menu, the listing filters and the scroll animation.
- **Prices are indicative.** The figures in the price guide and on the property cards are
  asking ranges compiled from public listing portals and past dealings, last reviewed
  August 2026. Update them in all three content files when the market moves.
- **The photographs show neighbourhoods, not listings.** They are real pictures of Okara
  under Creative Commons licences and must keep their credits — see
  `public/images/okara/CREDITS.md` and the credits section at the bottom of each page.
- **No CDNs.** Fonts, icons, styles and scripts are all served from this domain, so the site
  stays fast in Okara and keeps working if a third party goes down.
- **The forms do not send anything.** They open WhatsApp with the message pre-filled;
  nothing is stored on the site.
- **The Nastaliq font is only downloaded on the Urdu and Punjabi pages.** It is a 234 KB
  face, so the English page never pays for it.
