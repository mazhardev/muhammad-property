# muhammadproperties.online

The website for **Muhammad Properties**, property dealers on the GT Road in Okara, Punjab.
Static site, hosted on GitHub Pages, published in **English, Urdu and Punjabi (Shahmukhi)**.

| Language | URL | Script |
|---|---|---|
| English | `/` | Latin, left-to-right |
| اردو Urdu | `/ur/` | Nastaliq, right-to-left |
| پنجابی Punjabi | `/pa/` | Shahmukhi Nastaliq, right-to-left |

## Editing the site

**Never edit `index.html`, `ur/index.html`, `pa/index.html`, `404.html` or `sitemap.xml`
directly** — they are generated and will be overwritten. Edit the content files instead:

```
content/en.json     English wording
content/ur.json     Urdu wording
content/pa.json     Punjabi wording
```

Then rebuild:

```bash
node build/build.js
```

That regenerates all three pages plus `404.html` and `sitemap.xml`. Any Node 16+ works;
there are no dependencies to install.

The three JSON files must keep exactly the same keys and the same number of list items.
The build checks this and refuses to run if they drift apart, so if you add a property card
to one language, add it to all three. It also verifies that every photo referenced actually
exists in `images/okara/`.

## Where things live

```
content/            wording, one file per language  ← edit these
build/build.js      the generator                   ← run this
css/styles.css      design system, including all right-to-left rules
css/nastaliq.css    @font-face for Urdu/Punjabi (loaded only on those pages)
fonts/              self-hosted Noto Nastaliq Urdu subset (SIL OFL 1.1)
js/main.js          menus, filters, theme, WhatsApp handoff — shared by all languages
images/okara/       real photographs of Okara District (see CREDITS.md)
robots.txt          allows search engines and AI crawlers explicitly
llms.txt            plain-text summary of the business for AI crawlers
```

## Things worth knowing

- **Prices are indicative.** The figures in the price guide and on the property cards are
  asking ranges compiled from public listing portals and past dealings, last reviewed
  August 2026. Update them in all three content files when the market moves.
- **The photographs show neighbourhoods, not listings.** They are real pictures of Okara
  under Creative Commons licences and must keep their credits — see
  `images/okara/CREDITS.md` and the credits section at the bottom of each page.
- **No CDNs.** Fonts, icons, CSS and JS are all served from this repo, so the site stays
  fast in Okara and keeps working if a third party goes down.
- **The forms do not send anything.** They open WhatsApp with the message pre-filled;
  nothing is stored on the site.

## Local preview

Any static file server will do, for example:

```bash
npx --yes serve .
```
