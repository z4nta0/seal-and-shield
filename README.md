# Seal and Shield

The website for Seal and Shield LLC, a commercial roofing contractor based in Lawrence, Kansas, serving Topeka, the Kansas City metro, all of Kansas, and the continental U.S. It's built and maintained by [techgeek.support](https://techgeek.support/), whose portfolio links to it.

Live at [sealandshieldroof.com](https://sealandshieldroof.com/).

## Stack

- **Node.js** 22.22 or newer (React Router 8 requires it); Netlify builds with Node 24
- **Vite 8** dev server / bundler
- **React 19** + **TypeScript 6**
- **React Router 8** (the home page at the root path and a 404 page for every other path)
- **ESLint 9** with typescript-eslint, and **Playwright** with axe-core for the test suites
- Deployed on **Netlify**, which serves `index.html` for every path (`public/_redirects`) and receives the contact form through Netlify Forms

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Checks

```bash
npm run lint       # ESLint across the repo
npm run typecheck  # TypeScript across src/, the configs, and tests/
```

## Tests

```bash
npm test                    # every suite
npm run test:accessibility  # axe-core plus scripted keyboard, naming, reflow, and motion checks
npm run test:interaction    # what the section links, menu, contact form, and 404 page actually do
npm run test:rendering      # full-page screenshots of each page state against approved baselines
npm run test:responsive     # the pages and the mobile menu from 320 to 1,920px: no sideways scroll, spill, or overlap
```

Each suite runs in Chromium, Firefox, and WebKit against its own dev server on port 5191, so a dev server already running on 5173 is left alone. Reports land in `tests/output/` (git-ignored); `npx playwright show-report tests/output/report` opens the HTML report. The rendering suite's approved screenshots live in `tests/rendering/baselines/` and match to the pixel, so after a change meant to alter how the page looks, review the diff in the report, then run `npm run test:rendering -- --update-snapshots` and commit the new baselines with the change. The baselines were captured on Linux, and font rendering differs between systems, so on macOS or Windows refresh them locally before relying on the comparison. If a browser is missing, `npx playwright install chromium firefox webkit` installs all three.

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── assets/            Images and fonts shared by 2+ pages (logo-simple.webp, fonts/)
├── pages/
│   ├── home/          Home page and its sections (hero, services, about, contact), each with its own .module.css, plus reveal.ts and logo-full.webp
│   └── not-found/     The 404 page every unknown path shows, with its .module.css
├── ui/                Shared components (nav, footer), each with its own .module.css, and section-link.ts (section links that work from any page)
├── styles/            fonts.css (@font-face) + styles.css (design tokens, base element styles, and the shared scroll-reveal attributes)
├── utils/             motion.ts (the reduced-motion check for JavaScript scrolling)
├── app.tsx            Root component and the route table
└── main.tsx           Entry point
public/                Files served at fixed addresses: the favicon and Netlify's _redirects
tests/
├── accessibility/     axe-core scan and scripted checks
├── interaction/       behavior checks for links, the menu, the form, and the 404 page
├── rendering/         screenshot comparisons and their baselines/
├── responsive/        layout checks across screen widths
├── support/           the page states the suites visit
└── playwright.config.ts
```

## Design notes

- **Type pairing:** Barlow Condensed for headings, labels, and buttons, with Lato for body text, both self-hosted (`src/assets/fonts/`, declared in `src/styles/fonts.css`), so a visit makes no third-party requests.
- **Palette:** Deep navy (`#0f1e45`, with a darker `#080f24` for the bar, hero, and footer), a strong blue (`#1e56c8`) for buttons and labels on light sections, a lighter blue (`#4488f6`) for accents on dark sections, and an off-white (`#f4f6fa`) behind the services.
- **Logo usage:** The **full logo** (`src/pages/home/logo-full.webp`) anchors the hero and sits above the company details in the About section. The **simple mark** (`src/assets/logo-simple.webp`) is used in the nav bar and the footer.
- **Motion:** The hero fades in on load, the other sections fade in as they scroll into view, and the hero logo's ring pulses. All of it, along with the smooth section scrolling, turns off when a visitor's system asks for reduced motion.

## Contact form

The form posts to Netlify Forms as `contactForm`. Netlify finds the form by reading the deployed HTML, before React has rendered anything, so `index.html` carries a hidden, bare copy of it with the same name and field names. A field added to or renamed in `src/pages/home/contact.tsx` has to be changed in that copy too, or Netlify won't record it.
