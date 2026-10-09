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
  beside them.
- **No street address** (decided 2026-10-09): the company has no business
  address, only the owner's home, which stays off the site. The page shows
  Lawrence, Kansas, and the structured data gives only the city, region, and
  country to match.
- **SEO done 2026-10-09**: the title ("Commercial Roofing in Lawrence, KS |
  Seal and Shield") and description name the services and the city, the head
  carries the author, canonical, and theme color tags and RoofingContractor
  structured data matching the page's phone, city, weekday hours, and five
  service areas, and robots.txt and sitemap.xml are in `public/`. At the
  user's choice, the hero's h1 now holds the eyebrow, with "Lawrence, KS" on
  its own second line, as well as the slogan, so the page's main heading
  names the specialty and the city while looking as it did.
- **Social accounts**: none were provided, so no `twitter:site` or `sameAs`
  links. The user is asking the company; add any real ones when they arrive.
- **Off-site work for the user**, which helps local search more than
  anything on the page:
  - **Google Business Profile**: set it up as a service-area business with
    the address hidden and Lawrence, Topeka, the Kansas City metro, and
    Kansas as service areas; use the same name ("Seal and Shield"), phone,
    hours, and website address as the site.
  - **Google Search Console and Bing Webmaster Tools**: verify the domain and
    submit https://sealandshieldroof.com/sitemap.xml.
  - **Directory listings**: Apple Business Connect, Bing Places, Yelp, the
    BBB, Angi, Nextdoor, the Lawrence Chamber of Commerce, and Conklin's
    contractor locator, each with the identical name, phone, and city.
  - **Reviews**: ask finished-job customers for Google reviews; the site
    shows none and claims none in its structured data.

## Horizontal layout
Decided 2026-10-09, after comparing both options from the user-level "Width
is decided per project" rule: reese-roofing's method, applied in `45b71d0`.
It's on trial, so the user may reverse it; `git revert 45b71d0` restores the
vertical-rhythm layout and its baselines in one step.
- **Fluid (horizontal rhythm)**: layout values only. The page gutter
  (`--gut-sid-pad`, reese-roofing's own), the column gaps between section
  columns, panel and button side padding, and the footer's column gap are
  each a `clamp()` of a `--hor-rhy-*` step between two `--spa-hor-*` steps.
  The logos and the services header take `max()` of a rhythm-step floor and
  a horizontal step, since their columns already cap them.
- **Fixed (rem steps)**: everything inside a component: small gaps, card,
  field, and tag padding, the heading rules, and the menu lines. The 3px
  value markers stay literal, since no step lands within 10%.
- **Content cap**: a fixed `1920px / ρ` (about 1,449.4px), the same as
  reese-roofing, also on trial.
- **Hero ring**: follows the logo at a fixed offset (`--log-rin-off`), the
  way reese-roofing's oval follows its logo, so it never falls behind a
  growing logo.
- **Breakpoints**: 1,024, 900, 768, 580, and 520px, measured against the
  `app` container on AppRooCom's root element; the 480px query, which
  repeated the 900px one, was dropped.

## Directory structure
Decided 2026-10-08, matching reese-roofing's adaptation of the user-level
"### Directory structure" layout to a website with routes rather than a web
app with tabs.
```
src/
  main.tsx               entry point
  app.tsx                root component, the app container, and the routes
  assets/                images used by 2 or more pages (logo-simple.webp)
  pages/
    home/                the home page, its sections, and logo-full.webp
    not-found/           the 404 page
  ui/                    components used by 2 or more pages (nav, footer)
                         and section-link.ts
  styles/                global CSS only (styles.css)
  utils/                 app-agnostic helpers (motion.ts)
```
Outside `src/`: `tests/` holds the Playwright suites (see "## Test
suites").
- **`pages/` takes the place of `tabs/`.** Each route gets its own folder,
  and a component only that page uses (the hero, services, about, and
  contact sections) lives in that folder. The 404 page is
  `pages/not-found/`.
- **A page's main file is named after its folder, with no prefix**
  (`pages/home/home.tsx`), the same as reese-roofing.
- **The bar and footer live in `ui/`** as `nav.tsx` and `footer.tsx`, since
  the 404 page uses them too. Their section links go through
  `ui/section-link.ts`, which scrolls in place on the home page and
  navigates home with the section's id as the hash from any other page;
  the home page jumps to that section on arrival and clears the hash.
- **Component names** follow the naming rules since the formatting pass:
  `NavBarCom`, `SitFooCom`, `HerSecCom`, `SerSecCom`, `AboSecCom`,
  `ConSecCom`, `HomPagCom`, `NotFouCom`, and `AppRooCom`.
- **Stylesheet order**: `main.tsx` imports `styles/styles.css` after the app,
  so the global sheet loads after every component's module. Since the module
  pass, every class is scoped to its own module, so no rule depends on that
  order.

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
   tokens**, then the horizontal layout decision above. The formatting pass
   on every TypeScript and HTML file, root config files included, was done
   2026-10-08 (one file per commit, every suite passing with identical
   screenshots), along with the business name fix, the em dash copy cleanup,
   self-hosted fonts, and resized logos. The hook and CSS module passes were
   done 2026-10-09: the scroll reveal finds its blocks by the
   data-scroll-reveal-block role attribute and marks them with
   data-scroll-reveal-shown (both styled in styles.css's Body State region),
   every component's styles live in its own formatted .module.css with
   class names kept verbatim, state classes became attributes
   (data-page-scroll-active, data-section-link-active,
   data-mobile-menu-open, and the menu button's aria-expanded), and the
   shared container, section label, section title, and divider classes were
   copied into each module that used them. The design-token pass was done
   2026-10-09 in five commits: role colors and fonts on the plastic-ratio
   core design numbers; the type and spacing scale (1rem is the 11px base,
   with font sizes, line heights, letter spacing, spacing, borders, and
   heights on their nearest steps and the ledes capped at Lato's measured
   68-character width); durations and easing; elevation shadows; and every
   class and keyframe renamed to the three-segment rule. The horizontal
   layout above followed the same day.
7. **New features**: the 404 page, SEO, social previews, and interaction
   feedback.
   - **404 page: done 2026-10-09.** It has the shared bar and footer, a
     Return Home button, a Get a Free Quote button to the contact section,
     and its own title and noindex tag. Every section link works from it
     through `ui/section-link.ts`, and the home page scrolls to a hash it
     arrives with and then clears it, as asked for the same day.
   - **Security headers, WebP logos, and SEO: done 2026-10-09**, as recorded
     under "Kind of site" and "Known issues".
   - Still to come: social previews and interaction feedback.

## Test suites
Added 2026-10-08, adapted from reese-roofing's. Playwright suites live in
`tests/`, one project per suite and engine in `tests/playwright.config.ts`,
which starts its own dev server on port 5191 (never the usual 5173) and stops
it afterwards. Every suite runs in Chromium, Firefox, and WebKit. Results,
screenshots, and traces go to `tests/output/` (git-ignored); `npx playwright
show-report tests/output/report` opens the HTML report. The states the suites
visit (the home page and the 404 page at 390px and 1,440px, plus the mobile
menu open at 390px) are listed in `tests/support/states.ts`. Its `opeStaFun`
scrolls through the page before checking it, since the Services, About, and
Contact sections only fade their content in once scrolled into view, and skips
animations that repeat forever (the hero logo's `logRinDivLoopPulse`) when
waiting for the page to settle.
- `npm run test:accessibility`: the pre-commit accessibility scan. axe-core
  checks each state against WCAG 2.2 A and AA plus best practices
  (`axe.spec.ts`), and scripted checks (`scripted.spec.ts`) cover link and
  button names, a Tab walk (order, traps, focus on screen, uncovered, and
  visible), reflow at 320px, and motion under reduced motion. axe's "needs
  review" results are printed and attached to the report rather than failing
  the run.
- `npm run test:interaction`: checks what the controls do, under reduced
  motion so scrolls land at once. The bar's links, brand, menu, and footer
  buttons land on their sections with a clean address; the contact form
  refuses incomplete requests and reports a faked Netlify answer honestly;
  and the 404 page, its buttons, and a section address like /#about lead
  where they should. reese-roofing's feedback checks join it with the
  interaction feedback work.
- `npm run test:rendering`: compares a full-page screenshot of every state
  with its baseline in `tests/rendering/baselines/`, with zero tolerance: no
  pixel may differ, and the per-pixel color threshold is 0 too, since
  Playwright's default of 0.2 let a slight color change pass unnoticed
  (reese-roofing's suite still has that gap). The footer's year is masked.
  After an intended visual change, refresh with `npm run test:rendering --
  --update-snapshots` and commit the baselines with it. Baselines are
  captured on Linux.
- `npm run test:responsive`: measures the home page, the 404 page, and the open
  menu at 19 widths from 320 to 1,920px (a pixel either side of each breakpoint
  included), failing on sideways scrolling, an unclipped element past either
  edge, text spilling its box, or two reachable controls overlapping.
- `npm run test:seo`: checks each route's title, description, author,
  canonical, robots, and single h1; that the structured data's every claim
  appears on the page; and that robots.txt and the sitemap say what they
  should. The social preview tags join it with the social previews.
- `npm test` runs every suite.

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
- **WAVE reports** (2026-10-09): the hidden Netlify form's fields now carry
  aria-labels, and the body is dark so the transparent bar's text no longer
  measures against white. WAVE's remaining contrast flags on the About and
  Contact text are false positives: those blocks sit at opacity 0 until the
  scroll reveal reaches them, and WAVE counts opacity. Scroll to the bottom
  of the page before running WAVE so every block has faded in. The last
  flags sat on the contact details' emoji icons, which inherited the body's
  dark slate text color; emoji draw in their own colors, so it never showed,
  but checkers measured it against the navy. The icon span now carries the
  section's light text color instead. Those icons are also hidden from screen
  readers, since the label beside each says what the row is. WAVE's five
  "redundant link" alerts on the phone numbers (the bar, About, Contact
  twice, and the footer) are kept on purpose: the check only compares
  addresses, and each number sits where a visitor may want to call.

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
- **The logos were resized on 2026-10-08** (at the user's go-ahead, ahead
  of step 7): `logo-full.png` went from 4763x4640 (3.7 MB, about 88 MB
  decoded) to 968x943 (299 KB), at least 2x its largest display and 3x the
  phone hero, and `logo-simple.png` from 1210x1025 (705 KB) to 157x133
  (24 KB), over 3x its 44px box, each at a width that keeps the original
  aspect ratio to within 0.005px so no layout moved. The oversized full logo
  had made Chromium's draw of it nondeterministic under a full test run,
  which a short-lived rendering retry covered until the resize removed it.
  On 2026-10-09 both became WebP, encoded through Chromium's canvas since no
  other encoder was installed: the full logo at 0.95 quality (60 KB, down
  from 299 KB, averaging 0.6 of 255 off the PNG with no difference visible
  at 3x zoom) and the simple mark lossless (21 KB, down from 24 KB), since
  lossy WebP showed on its fine detail and Chromium's lossless encoder made
  the full logo larger than its PNG.
- **Security headers** (added 2026-10-09 at the user's go-ahead):
  `public/_headers` sends a strict Content-Security-Policy (only the site's
  own files and form post, no inline styles), HSTS without preload, and the
  usual hardening headers. Netlify applies it only once deployed, so it was
  checked by serving the production build with the headers attached in the
  browser: no violations in any engine while every page, font, image, the
  menu, and the form worked. After the deploy, securityheaders.com should
  grade the live site. Anything later added from another origin (analytics,
  a map, an embedded review widget) needs its origin added to the policy.
- **Netlify builds with Node 24.x**, set in the site's Netlify settings
  rather than in the repo.
