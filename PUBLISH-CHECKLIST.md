# Publish checklist: treeservicemadison.net

Everything in this folder is the finished site. No build step. Work down the list once.

## 1. Put it online (about 15 minutes)
1. Create a new GitHub repository and upload the **contents** of this folder (so `index.html` sits at the top level of the repo).
2. In Vercel: Add New > Project > import the repo. Framework Preset **Other**. Leave Build Command and Output Directory empty. Deploy.
3. Project > Settings > Domains: add `treeservicemadison.net` and `www.treeservicemadison.net`, and point the domain's DNS where Vercel tells you. `vercel.json` already redirects www to the bare domain.

## 2. Switch on the lead form and dashboard (about 10 minutes)
1. Project > Storage > Create Database > **Upstash for Redis** (free plan) > connect to this project.
2. Settings > Environment Variables > add `ADMIN_PASSWORD` (12+ characters, long and random).
3. Optional email alerts: `RESEND_API_KEY`, `LEAD_TO`, `LEAD_FROM`.
4. Deployments > Redeploy. Send yourself a test request from the homepage form, then open `/admin/` and check it arrived.
Until step 1 or 3 is done the form tells visitors to call instead of sending, so no lead is lost silently.

## 3. Search engines
1. Google Search Console: the verification tag is already in every page. Click Verify, then Sitemaps > submit `sitemap.xml`.
2. Bing Webmaster Tools: same (its tag is in place too).
3. Create or claim the Google Business Profile. The name must read **Tree Service Madison**, with the same address and phone as the site.

## 4. Confirm these facts, or edit them, before you promote the site
- Hours: Mon-Sat 7am-6pm (top bar, footer, contact page, estimate section, schema)
- "Proof of insurance on request" / certificate of insurance
- Stump grind depth: 6 to 8 inches
- "Free on-site estimates"
- Emergency wording makes no 24/7 claim. Add one only if the phone is answered around the clock
- The mobile Text button is switched off. Turn it on only if (608) 571-1326 takes SMS
- Founder note on the homepage and About page: Quincy to read and edit
- No ISA or other credential is claimed anywhere. Add one only with the certificate number
- Forestry phone numbers on the six area pages and the service-areas table (spot-check them)
- Have an attorney read `/privacy-policy/` and `/terms/`. Delete the "partner company" line in the privacy policy if requests never go to another company
- Map pin 43.0342, -89.4470 matches the Google Business Profile pin

## 5. What's in the folder
- 24 public pages: home, 5 services, service-areas hub + 6 communities, guides hub + 4 guides, About, Q&A, Contact, Privacy, Terms, Sitemap
- Plus `404.html`, `/thank-you/` and the private `/admin/` leads dashboard
- `api/` form handler and dashboard API; `assets/` styles, scripts, fonts, images
- `sitemap.xml`, `robots.txt`, `vercel.json`, `site.webmanifest`, favicons
- `README.md`, `docs/`, `_partials/`: reference material for maintaining the site. Vercel skips them (see `.vercelignore`)

Standing rule for every future page: **no prices anywhere.**
