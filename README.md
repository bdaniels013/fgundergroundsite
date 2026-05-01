# F&G Underground

Marketing site for F&G Underground, a heavy construction contractor specializing in directional drilling and trenching for fiber optic, electric, water, sewer, and gas utility installations.

**Domain:** [fgunder.com](https://fgunder.com)

## Pages

- `index.html` — Home (about, mission, vision, core values, services overview)
- `capabilities.html` — Prime / Sub contractor roles, services, licensed contractor info
- `contact.html` — Contact form (name, phone, email, project details)

## Stack

Static HTML, CSS, and vanilla JS. No build step required. Deploy by serving the directory from any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3, etc.).

## Local preview

Open `index.html` directly in a browser, or run a local server:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Contact form wiring

The form's `action` attribute on `contact.html` is empty by default, so submissions fall back to opening the visitor's mail client. To capture submissions through a service:

1. Sign up for Formspree, Netlify Forms, Basin, or similar.
2. Paste the endpoint URL into the `action` attribute of the `<form id="contact-form">` element on `contact.html`.

The JS handler in `js/main.js` will POST automatically when an HTTP endpoint is present.

## Brand

- Primary navy: `#0B1340` (from logo)
- Deep navy: `#050A2A`
- Safety amber accent: `#F5B800`
- White: `#FFFFFF`
- Headline font: Barlow Condensed
- Body font: Inter
