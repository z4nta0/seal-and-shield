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
  sentence of copy. The source still mixes both spellings; it's brought in
  line once the test suites exist (after step 4), so the change is checked
  like any other copy change.
- **Off-site work for the user** (the Google Business Profile, directory
  listings, reviews) is listed here once the SEO pass reaches it.

## Horizontal layout
Open as of 2026-10-08. Per "Width is decided per project" in the user-level
rules, the choice between the vertical rhythm and the plastic-ratio viewport
steps waits until the rest of the design system and tokens are applied; then
the current numbers are compared with both options and the user decides.

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
- **`README.md` describes Reese Roofing**, the project this site was copied
  from (its name, placeholder contact details, and file layout). It gets
  rewritten for Seal and Shield once the directory structure settles.
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
