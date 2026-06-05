# Reese Roofing

A single-page marketing site for Reese Roofing — a commercial roofing contractor serving Lawrence, Kansas and the surrounding area.

## Stack

- **Node.js** runtime
- **Vite** dev server / bundler
- **React 18** + **TypeScript**
- **React Router v6** (set up for future expansion — currently routes `/` to Home and everything else to a 404)

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── components/        Reusable UI (Nav, Footer)
├── sections/          Page sections (Hero, Services, About, Contact)
├── pages/             Route-level pages (Home, NotFound)
├── styles/globals.css Design tokens + reset + base typography
├── App.tsx            React Router setup
└── main.tsx           Entry point
```

## Design notes

- **Type pairing:** Fraunces (display serif, optical-size aware) paired with Inter Tight (refined sans). Italic Fraunces accents pull the design together.
- **Palette:** Warm off-white paper (`#f5f2ec`), deep ink (`#1a1f24`), and a navy accent (`#1f4e7a`) drawn from the logo. Italic display accents and small details (numbered IDs, list bullets, pull quote marks) all use this brand navy so the design feels native to the logo.
- **Layout:** Editorial grid, generous negative space, hairline dividers, numbered sections (01–04). Hover states are intentional but never showy.
- **Logo usage:**
  - The **full logo** (`/public/logo-full.png`) anchors the hero as the primary visual, doubles as a "seal" in the sticky left column of the About section, and appears on a paper-colored signature card in the Contact section.
  - The **simple mark** (`/public/logo-mark.png`) is used in the nav bar, the footer, and as the favicon (multiple sizes including `.ico`, PNGs at 16/32/192/512, and an Apple touch icon).

## Customization checklist

When you're ready to make this real, update:

- **Phone number:** `(785) 555-0199` — search the repo for it; appears in Nav, Contact, Footer area
- **Email:** `hello@reeseroofing.example` — same; appears in Contact and the mailto form action
- **Address:** placeholder Lawrence, KS 66044 — Contact section
- **Stats in Hero:** 17+ years, 400+ roofs, etc. — replace with real numbers
- **Services list:** edit `services` array in `src/sections/Services.tsx`
- **About copy & quote:** `src/sections/About.tsx`
- **Form backend:** the form currently uses `mailto:` as a no-backend fallback. To wire up a real backend, replace the `handleSubmit` handler in `src/sections/Contact.tsx` with a `fetch` POST to your endpoint (Formspree, Netlify Forms, your own API, etc.).

## Routing

The router is set up so you can easily add pages later (e.g. `/services/tpo-roofing`, `/projects`, `/blog`) without restructuring. Add a `<Route>` in `src/App.tsx` and a new component under `src/pages/`.
