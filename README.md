# AVOLI Website — Akinwale Vincent Omoniyi Legacy Initiative

Mobile-first static site. No build step, no database. Host anywhere (cPanel, Netlify, Vercel, GitHub Pages).

## Preview locally
- Double-click `index.html`, or better: `python -m http.server` inside this folder, then open http://localhost:8000
- Admin panel: open `admin/` in the browser.

## Update content (no coding)
1. Open `admin/` → fill form → copy output → paste into matching `data/*.json` → save → re-upload.
2. Photos: drop into `assets/` (keep <500KB, landscape). Reference as `assets/your-photo.jpg`.
3. Contacts/bank/socials/Analytics: `Admin → Site & Contact` → paste into `data/site.json`.

## Files
- `index.html, about.html, what-we-do.html, impact.html, get-involved.html, donate.html, partner.html, volunteer.html, news.html, gallery.html, contact.html, safeguarding.html, privacy.html, terms.html`
- `css/style.css` (brand theme), `js/main.js` (nav, data loading, forms, analytics)
- `data/site.json, programmes.json, projects.json, news.json, gallery.json, team.json`
- `admin/index.html` (easy panel), `robots.txt`, `sitemap.xml`

## Next steps
1. Replace placeholders in `data/site.json` (email, phone, address, bank, socials, GA ID).
2. Replace `contact.html` map iframe with exact office pin.
3. Swap SVG placeholders in `assets/` with real photos.
4. Point domain (e.g. avoli.org.ng) to host; submit sitemap in Google Search Console; create GA4 property.
5. Branding chapter (next): logo refinement, colour tokens, typography, social templates — see BRANDING.md.
