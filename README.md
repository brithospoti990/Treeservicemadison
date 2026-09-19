# treeservicemadison.net

Static site for Tree Service Madison. Plain HTML, one stylesheet, one small script, one serverless function. No build step.

**Site rule: no prices anywhere.** No figures, ranges, "cost" pages or price talk in copy, FAQ, menus or schema. "Free estimate" and "written quote" wording stays. Keep to this on every new page.

## What's here

```
index.html                 Homepage
tree-removal-madison-wi/, tree-trimming-madison-wi/, stump-grinding-madison-wi/,
stump-removal-madison-wi/, emergency-tree-service-madison-wi/    The five service pages (index.html in each)
service-areas/             Service-area hub: county map, the six communities, who-to-call table
tree-service-<city>-wi/    Six area pages: fitchburg, verona, middleton, monona, mcfarland, sun-prairie
about/, faq/, contact/, privacy-policy/, terms/, sitemap/    Company pages
guides/                    Guides hub, plus four guides: tree-removal-permit-madison-wi, terrace-trees-madison-wi,
                           oak-wilt-oak-work-permit-madison-wi, emerald-ash-borer-madison-wi
404.html                   Not-found page (Vercel serves it automatically)
thank-you/index.html       Form confirmation (noindex)
api/lead.js                Estimate-form handler: saves the lead, then optional email / webhook
api/leads.js               Dashboard API (password protected): list, update status and notes, delete
api/_store.js              Database helper (Upstash Redis over REST). Not an endpoint
admin/index.html           Leads dashboard at /admin/ (noindex, blocked in robots.txt)
assets/css/admin.css, assets/js/admin.js   Dashboard styles and script
assets/css/site.css        All styles
assets/js/site.js          Menu, dropdowns, form submit
assets/fonts/              Besley + Libre Franklin (self-hosted, SIL OFL; licences included)
assets/img/                logo.svg, logo-reversed.svg, logo-mark(.svg / -reversed.svg), og-image.jpg/.png
assets/img/hero/           Feature image, three widths, WebP + JPG
assets/img/services/       Five service photos
assets/img/quincy-carroll.jpg  Founder photo
assets/img/pages/          Two photos and a share card per service page
assets/img/areas/          Share card (1200x630) per area page, built from its locator map
assets/img/guides/         Share card (1200x630) per guide
favicon.ico, favicon.svg, apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest
vercel.json                Clean URLs, trailing slashes, www -> apex redirect, cache + security headers
robots.txt, sitemap.xml    Sitemap lists only live URLs (homepage for now)
_partials/                 header.html + footer.html: the source of truth for menus (not deployed)
docs/                      entity-map.md, homepage-seo-and-schema.txt, service-pages-seo.txt, area-pages-seo.txt, guide-pages-seo.txt, company-pages-seo.txt (not deployed)
```

## Photos

All photos are in place. To change one, overwrite the file and keep the name, then update its `alt` text in `index.html` so it describes the new photo.

```
assets/img/hero/tree-service-madison-1200 / -800 / -560 (.webp + .jpg)   Feature image in the hero (source 1200x1000)
assets/img/services/tree-removal.jpg                                      Service panels (sources 500x500, shown at 300x300;
assets/img/services/tree-trimming.jpg                                      200 to 240 px on tablets, full panel width on phones)
assets/img/services/stump-grinding.jpg
assets/img/services/stump-removal.jpg
assets/img/services/emergency-tree-service.jpg
assets/img/quincy-carroll.jpg                                             Founder photo (300x300)
assets/img/og-image.jpg / .png                                            Share card: the feature photo with the logo, headline and phone
```

The hero is the page's largest image, so it ships in three widths as WebP with JPG fallbacks and is preloaded. If you replace it, export all six files (1200, 800 and 560 px wide) or the browser will keep serving the old sizes. Non-square service photos are centre-cropped to a square.

## Service pages

Each of the five service pages has the same skeleton (breadcrumb hero, content sections, FAQ, links to the other services, estimate form with the matching service preselected) and its own content, title, description and schema (Service, HomeAndConstructionBusiness, WebSite, WebPage, ImageObject, BreadcrumbList, FAQPage). All SEO fields are listed in docs/service-pages-seo.txt. On these pages the header and call-bar "Free estimate" buttons point to the form on the same page (`#estimate`) instead of the homepage.

Each page has two photos, both in place (sources 500x500, shown at their real size so they are never stretched):

```
assets/img/pages/<page>-1-500.jpg + .webp   Photo 1: beside the H1 (preloaded)
assets/img/pages/<page>-2-500.jpg           Photo 2: inside the content, lazy-loaded, with a caption
assets/img/pages/<page>-og.jpg              Share card (1200x630): photo 1 with the logo, page headline and phone
<page> = tree-removal, tree-trimming, stump-grinding, stump-removal, emergency-tree-service
```

To replace a photo, overwrite the file and keep the name, then update its `alt` text (and the caption under photo 2) in that page's `index.html`. Larger originals (1000 px or more) would look sharper beside the H1 on high-density screens.

## Service area pages

Six community pages plus the `/service-areas/` hub. Each community page has its own content (local neighborhoods, the local tree rules and who to call, the work we see there), its own title, description and schema (Service with the five services, HomeAndConstructionBusiness, WebSite, WebPage, three-level BreadcrumbList, FAQPage). All SEO fields are in docs/area-pages-seo.txt.

Each page carries three location features:

- **Locator map** beside the H1: an inline SVG drawn from real coordinates, showing the community, our shop and the straight-line distance. It is also rendered into the page's share card.
- **"Whose tree is it?" checker**: five buttons (terrace, yard, lot line, park, power lines) that reveal who is responsible and who to call in that community. It is plain HTML radio inputs and CSS, so it works with JavaScript off.
- **Interactive Google map** of the community, lazy-loaded, with a directions link from the shop.

Local facts to re-check once a year, because staff and numbers change: the forestry and public works phone numbers on each page and in the hub table, Fitchburg's Tree City USA count (29 years as of 2026), and which electric utility is named.

## Guides

Four guides plus the `/guides/` hub, all linked from the header and footer menus (the emerald ash borer link was switched on when its page was built). Each guide opens with a "short version" answer card, carries an Article schema with its sources as citations, and ends with a list of the City and State pages it was checked against. All SEO fields are in docs/guide-pages-seo.txt.

Each guide has two features built for it:

- **A figure** drawn as inline SVG: the oak permit calendar, the oak wilt risk calendar, a street cross-section showing where private property ends and the right-of-way begins, and an emerald ash borer timeline. On phones the figure scrolls sideways so the labels stay readable.
- **An interactive picker**: "Do I need a permit?", "Something is wrong with my terrace tree", "What are you seeing on your oak?", "How much of the crown is left?". Plain HTML radio inputs and CSS, so it works with JavaScript off. The hub has a "Which guide do I need?" picker.

The guides are general information, and say so. Re-check them once a year against the source links at the foot of each page: ordinance numbers, the April 1 to October 15 dates, phone numbers, and the emerald ash borer treatment figures.

## Company pages

- **About** (`/about/`): founder note, how we work, what we won't do, service-area map. It deliberately states no founding year, crew size or credentials, because none were supplied. An HTML comment at the top of the page lists the facts worth adding once confirmed.
- **Questions & Answers** (`/faq/`): 29 questions in seven groups, each answer under 300 characters, all marked up as FAQPage schema. A search box filters questions as you type (it only appears when JavaScript is on; without it the full list is simply shown).
- **Contact** (`/contact/`): phone, address, hours, an interactive Google map of the shop with a directions link, what happens after you get in touch, and the estimate form. No email address is published because none was supplied; a comment in the page says where to add one.
- **Privacy Policy** and **Terms** (`/privacy-policy/`, `/terms/`): plain-English templates that describe what the site actually does today (the form fields, the form-delivery and hosting providers, Google map embeds, no analytics or ad trackers). **Have an attorney review both before launch.** Update the privacy policy if you add analytics, ad pixels, call tracking, chat or an email address. It includes a clause covering jobs passed to a partner company; delete it if that never happens.
- **Sitemap** (`/sitemap/`): every page, grouped like the menus. `sitemap.xml` lists the same 24 URLs for search engines.

## Leads: where the form goes, and the dashboard

Every estimate form on the site posts to `/api/lead`. That function checks the fields, drops bot submissions, and then:

1. **Saves the lead** to the leads database, if one is connected. This is what the dashboard reads.
2. **Emails you**, if the Resend variables are set (optional).
3. **Posts to a webhook**, if `LEAD_WEBHOOK_URL` is set (optional: Zapier, Make, a Google Sheet script).

If none of the three is set up, the function answers 503 and the page tells the visitor to call, so a lead is never silently lost. With only the database connected, the form works and leads appear in the dashboard.

**Set-up, once:**

1. Vercel > your project > Storage > Create Database > **Upstash for Redis** (the free plan is plenty) > connect it to this project. Vercel adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you.
2. Settings > Environment Variables > add **`ADMIN_PASSWORD`**: at least 12 characters, long and random. This is the dashboard password.
3. Optional email alerts: `RESEND_API_KEY`, `LEAD_TO`, `LEAD_FROM` (verify your sending domain at resend.com first).
4. Optional: `LEAD_RETENTION_DAYS` (default 730). Leads older than this delete themselves, which matches the two years stated in the privacy policy.
5. Redeploy, send yourself a test request from the homepage form, then open **`/admin/`**.

**The dashboard** shows counters (all, new, last 7 days, won), search, status and service filters, and one row per lead. Open a row for the phone (tap to call), email, address, details and the page the request came from. Set a status (New, Contacted, Estimate booked, Quoted, Won, Lost, Spam), keep private notes, delete a lead, or export what you are looking at as CSV.

**Security notes.** One shared password, sent only over HTTPS and kept for the browser session only. Ten wrong passwords from one address lock that address out for 15 minutes. The page and the API send noindex and no-store headers and are disallowed in robots.txt. Visitor text is always shown as plain text, never as HTML, and CSV exports neutralise spreadsheet formulas. Do not share the password by email or chat; change it in Vercel and redeploy if someone leaves. If you later need separate logins per person, that is the point to move to a proper auth provider.

## Deploy

1. Push this folder to a GitHub repo. In Vercel: New Project, import the repo, Framework Preset "Other", no build command, output directory blank.
2. Add `treeservicemadison.net` and `www.treeservicemadison.net` under Domains. `vercel.json` already 301s www to the apex.
3. Connect the leads database and set the dashboard password (see "Leads" above). Optional extras for the form (Settings > Environment Variables), then redeploy:
   - `RESEND_API_KEY`, `LEAD_TO`, `LEAD_FROM` for email delivery through resend.com (verify the sending domain there first), and/or
   - `LEAD_WEBHOOK_URL` for Zapier, Make or a Google Apps Script endpoint.
   With neither set, the function returns 503 and the page tells the visitor to call, so a lead is never silently lost. Submit a test lead after deploying.
4. Verify the domain in Google Search Console and submit `/sitemap.xml`.

## Adding a page

1. Create `your-slug/index.html`. Copy the `<head>` from `index.html` and change the title, description, canonical and OG tags.
2. Paste `_partials/header.html` after `<body>` and `_partials/footer.html` before `</body>`, unchanged.
3. Add the URL to `sitemap.xml`.
4. When a Phase 2 page goes live, uncomment its link in both partials and re-paste them into every page.

After editing `site.css` or `site.js`, bump the `?v=20260918` value in every page so browsers fetch the new file.

## Links

Every URL in the menus, the footer and the page copy now exists. `404.html` still catches mistyped addresses.

## Confirm before publishing

- Hours (placeholder: Mon-Sat 7am-6pm; appears in the top bar, footer, estimate section and schema)
- "Proof of insurance on request": only if liability and workers' comp cover are in force
- Stump grind depth (6 to 8 inches)
- "Free on-site estimates"
- Emergency wording: the page does not say 24/7. Add it only if the phone is answered around the clock
- Text button in the mobile call bar is commented out. Enable it only if (608) 571-1326 accepts SMS
- Founder note: Quincy to read and edit
- ISA credential: see docs/entity-map.md for the line to add if one is held
- Map pin 43.0342, -89.4470 against the Google Business Profile pin
- Google Business Profile name must read "Tree Service Madison", matching the site, signage and paperwork

## QA record (18 Sep 2026)

- Tag balance: 76/76 divs, no nesting errors, no duplicate ids, one H1, 11 H2s
- Title 58 chars (about 557 px), meta description 140 chars (about 899 px): inside Google's character and pixel limits
- 8 FAQ answers, longest 296 chars; FAQPage schema text identical to the visible FAQ
- JSON-LD parses; HomeAndConstructionBusiness (a LocalBusiness subtype) with 5 Services, Person, ImageObject, WebSite, WebPage, FAQPage; all @id references resolve; no rating markup, no priceRange (left out on purpose: validators may list it as an optional missing field)
- Price sweep: no figures or price/cost wording in any deployed HTML, script or schema
- Chromium 153 at 1440, 820, 390 and 360 px: no console errors, no horizontal overflow, fonts and all images load
- jsdom: 14/14 interaction tests pass (menu, dropdowns, Escape, outside click, form validation/success/error/offline)
- api/lead.js: 8/8 unit tests pass (405, honeypot, 422, 503, email, webhook, no-JS redirect, 502)
- wkhtmltoimage: renders without error with all content present. Its WebKit predates CSS grid and clamp(), so the layout collapses to one column there; that is the engine, not the page
- Entities: see docs/entity-map.md
- Leads: 15/15 API tests against a stand-in database (save, list, update, delete, expiry, lock-out, missing config), 11/11 dashboard tests in jsdom (sign-in, safe rendering, search, filters, save, CSV, delete, sign-out); dashboard rendered in Chromium at 1280 and 390 px
- Company pages: one H1 each; titles and descriptions inside the character and pixel limits; schema references resolve; no price wording; FAQ search tested in jsdom (5/5); no overflow or script errors at 1440 and 390 px
- Guides: 2,138 to 2,320 words each (hub 1,672), form excluded; titles under 60 chars and 560 px; descriptions under 150 chars and 920 px; one H1 each; FAQ answers 287 chars max and identical to their schema; schema references resolve; no price wording; every picker option click-tested in Chromium on desktop and phone; no overflow or script errors
- Area pages: 1,720 to 1,806 words each (hub 1,245), form excluded; titles 53 to 59 chars and under 551 px; descriptions under 145 chars and 920 px; one H1 each; FAQ answers 285 chars max and identical to their schema; schema references resolve; no price wording; checker click-tested in Chromium on desktop and phone; no overflow or script errors
- Service pages: 1,721 to 1,893 words each (form excluded); titles 55 to 57 chars and under 550 px; descriptions 135 to 142 chars and under 920 px; one H1 each; FAQ answers 276 chars max and identical to their schema; all schema references resolve; no price wording; no broken images, overflow or console errors at 1440 and 390 px
