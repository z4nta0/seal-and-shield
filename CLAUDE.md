# Project CLAUDE.md: seal-and-shield

A marketing website for Seal and Shield LLC, a real commercial roofing
contractor based in Lawrence, Kansas (React, Vite, React Router, deployed on
Netlify at https://sealandshieldroof.com/). It's also a portfolio piece by
techgeek.support, linked from https://techgeek.support. Every rule in the
user-level CLAUDE.md applies here; this file records only what's specific to
this project.

## Kind of site
Decided 2026-10-08. A real local business, so under the user-level "## SEO"
rule it gets the local SEO treatment (`LocalBusiness` structured data as
`RoofingContractor`, one consistent name, address, and phone, and the city in
the title, description, and headings where it reads naturally), not the demo
treatment. The `author` meta names the business itself.
- **The business name is "Seal and Shield"** (decided 2026-10-08), spelled
  the same way everywhere: never "Seal & Shield". "LLC" is added only where
  the legal name fits, such as the footer's copyright line and the odd
  sentence of copy. Applied 2026-10-08: the bar, About heading, Services
  intro, and Contact copy say "Seal and Shield"; "LLC" stays in the footer's
  brand name and copyright line, the About story's founding sentence, and
  the full logo's alt text (the image itself reads "LLC"); the bar's and
  footer's small logos have empty alt text, since the brand name sits right
  beside them. `index.html`'s title and description are rewritten in the SEO
  pass.
- **Off-site work for the user** (the Google Business Profile, directory
  listings, reviews) is listed here once the SEO pass reaches it.

## Horizontal layout
Open as of 2026-10-08. Per "Width is decided per project" in the user-level
rules, the choice between the vertical rhythm and the plastic-ratio viewport
steps waits until the rest of the design system and tokens are applied; then
the current numbers are compared with both options and the user decides.

## Directory structure
Decided 2026-10-08, matching reese-roofing's adaptation of the user-level
"### Directory structure" layout to a website with routes rather than a web
app with tabs.
```
src/
  main.tsx               entry point
  app.tsx                root component (the routes join it in step 7)
  assets/                images used by 2 or more pages (logo-simple.png)
  pages/
    home/                the home page, its sections, and logo-full.png
  ui/                    components used by 2 or more pages (nav, footer)
  styles/                global CSS only (styles.css)
  utils/                 app-agnostic helpers (motion.ts)
```
Outside `src/`: `tests/` holds the Playwright suites (see "## Test
suites").
- **`pages/` takes the place of `tabs/`.** Each route gets its own folder,
  and a component only that page uses (the hero, services, about, and
  contact sections) lives in that folder. The 404 page joins as
  `pages/not-found/` in step 7.
- **A page's main file is named after its folder, with no prefix**
  (`pages/home/home.tsx`), the same as reese-roofing.
- **The bar and footer live in `ui/`** as `nav.tsx` and `footer.tsx`, since
  the 404 page will use them too.
- **Component names were left alone in the move**: the hero section's file
  is `hero.tsx` but its component is still `Home`, and the others keep
  `Navbar`, `Footer`, `Services`, `About`, and `Contact` until step 6's
  naming pass. Only the new `HomPagCom` (the page that composes them) and
  the rewritten `AppRooCom` follow the naming rules already.
- **Stylesheet order**: `main.tsx` imports `styles/styles.css` after the app,
  so the global sheet still loads after every component's CSS, as it did
  before the move. The component files now load in `home.tsx`'s
  alphabetical import order; no class is styled in two component files, so
  that order doesn't decide any rule.

## Cleanup plan
Decided 2026-10-08, on the `code-cleanup` branch, which holds steps 1 through
6; step 7 adds new features.
1. **Project setup**: this file, and the Windows `:Zone.Identifier` download
   files removed from the repo and ignored.
2. **Dependency upgrades**, one major version at a time with a build check
   after each: Vite 8 with `@vitejs/plugin-react` 6, React 19, React Router 8
   (the single `react-router` package, replacing `react-router-dom`), then
   TypeScript 6.0 (the newest `typescript-eslint` supports).
3. **ESLint**, set up from ease-my-life's `eslint.config.ts`.
4. **Playwright and axe** in all three engines, with baseline screenshots
   taken before anything moves, so later steps can prove nothing changed on
   screen.
5. **Directory structure**.
6. **Formatting, naming, and comment passes, CSS modules, and design
   tokens**, then the horizontal layout decision above.
7. **New features**: the 404 page, SEO, social previews, and interaction
   feedback.

## Test suites
Added 2026-10-08, adapted from reese-roofing's. Playwright suites live in
`tests/`, one project per suite and engine in `tests/playwright.config.ts`,
which starts its own dev server on port 5191 (never the usual 5173) and stops
it afterwards. Every suite runs in Chromium, Firefox, and WebKit. Results,
screenshots, and traces go to `tests/output/` (git-ignored); `npx playwright
show-report tests/output/report` opens the HTML report. The states the suites
visit (the home page at 390px and 1,440px, plus the mobile menu open at
390px) are listed in `tests/support/states.ts`. Its `opeStaFun` scrolls
through the page before checking it, since the Services, About, and Contact
sections only fade their content in once scrolled into view, and skips
animations that repeat forever (the hero logo's `pulseRing`) when waiting for
the page to settle.
- `npm run test:accessibility`: the pre-commit accessibility scan. axe-core
  checks each state against WCAG 2.2 A and AA plus best practices
  (`axe.spec.ts`), and scripted checks (`scripted.spec.ts`) cover link and
  button names, a Tab walk (order, traps, focus on screen, uncovered, and
  visible), reflow at 320px, and motion under reduced motion. axe's "needs
  review" results are printed and attached to the report rather than failing
  the run.
- `npm run test:rendering`: compares a full-page screenshot of every state
  with its baseline in `tests/rendering/baselines/`, with zero tolerance: no
  pixel may differ, and the per-pixel color threshold is 0 too, since
  Playwright's default of 0.2 let a slight color change pass unnoticed
  (reese-roofing's suite still has that gap). The footer's year is masked. After an intended visual change, refresh with `npm
  run test:rendering -- --update-snapshots` and commit the baselines with it.
  Baselines are captured on Linux.
- `npm run test:responsive`: measures the home page and the open menu at 19
  widths from 320 to 1,920px (a pixel either side of each breakpoint
  included), failing on sideways scrolling, an unclipped element past either
  edge, text spilling its box, or two reachable controls overlapping.
- `npm test` runs every suite. reese-roofing's interaction and seo suites
  join in step 7, once the site has the features they check.

## Known issues
- **Test the contact form after the last deploy** (reminder for the user,
  2026-10-08): the hidden Netlify detection copy of the form in `index.html`
  was pasted JSX that repeated the React form's input ids, and it was
  rebuilt as a bare form with only the form's name and each field's `name`.
  Once all the cleanup steps are finished and deployed, remind the user to
  send a test submission and confirm it arrives in Netlify's Forms tab.
- **Contrast axe can't measure** (needs review, 2026-10-08): text over the
  hero's, contact section's, and footer's gradients (the headline and its
  accents, the stats, the bar's brand and links, the contact details, and
  the footer's links and phone) has to be checked by eye.
- **WAVE still reports errors** (2026-10-08): the user ran WebAIM's WAVE
  checker after the accessibility pass and it found errors axe doesn't
  report. They're handled later, with the user.

## Accessibility pass
Done 2026-10-08, before the directory move, so steps 5 and 6 run against a
clean scan (the user chose this over carrying the failures to step 7). The
suite found 25 failing tests in the existing site, fixed one commit per
problem: the bar and footer navs got distinct labels, the About values'
`h4`s became `h3`s, the closed mobile menu became `inert` (its toggle
reports `aria-expanded`), every transition and animation got a
reduced-motion variant (with `utils/motion.ts`'s `redMotFun` stopping the
JavaScript smooth scrolls), the form fields got a focus ring, and the muted
text, light blue, light-section labels, and footer copyright line were
adjusted to clear 4.5:1. All 144 tests now pass in all three engines.
- **The logo images are far too heavy** (noted 2026-10-08):
  `src/assets/logo-full.png` is 3.7 MB and `logo-simple.png` 705 KB, which
  slows every page load. Remind the user when step 7's SEO pass starts, then
  resize and compress them (or replace them with SVGs where the artwork
  allows).
- **No security headers yet**: `public/_headers` doesn't exist. Step 7
  raises with the user whether to add ease-my-life's hardening headers
  (Content-Security-Policy, HSTS, and the rest), adjusted for whatever this
  site loads from other origins and for its Netlify Forms POST.
- **Netlify builds with Node 24.x**, set in the site's Netlify settings
  rather than in the repo.
