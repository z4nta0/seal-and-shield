# Project CLAUDE.md: seal-and-shield

A marketing website for Seal and Shield LLC, a real commercial roofing
contractor based in Lawrence, Kansas (React, Vite, React Router, deployed on
Netlify at https://sealandshieldroof.com/). It's also a portfolio piece by
techgeek.dev, linked from https://techgeek.dev. Every rule in the
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
  brand name and copyright line, the About story's founding sentence, the
  full logo's alt text (the image itself reads "LLC"), the bar's brand,
  which sets a small "LLC" beneath the name like the logo's own lockup, and
  the head's `author` meta and the structured data's `legalName`, which name
  the business legally (both recorded 2026-10-22), the social card's copy of
  the full logo, whose alt text is the logo's own, and the opening line of
  the README and of this file, which introduce the business itself (both
  recorded 2026-10-23); the bar's and
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
- **Off-site work handed to the business** (closed 2026-10-10): the user
  verified the domain in Google Search Console and submitted the sitemap,
  then passed the rest to the company as optional but worthwhile: a Google
  Business Profile as a service-area business with the address hidden, Bing
  Webmaster Tools, directory listings (Apple Business Connect, Bing Places,
  Yelp, the BBB, Angi, Nextdoor, the Lawrence Chamber of Commerce, Conklin's
  contractor locator) with the identical name, phone, and city, and Google
  reviews. No social accounts were provided; if the company ever shares
  real ones, they join the preview tags as `twitter:site` and the
  structured data as `sameAs`.
- **Google's rich results warnings** (decided 2026-10-17): the test flags
  a missing `streetAddress`, `postalCode`, and `priceRange`. All three stay
  out: there's no business address to give, a ZIP code would point at the
  owner's home area, and the page shows no prices for a range to match. They
  are optional fields, so the warnings don't affect eligibility.
- **The canonical stays in `index.html`** (decided 2026-10-18): the only other
  route is the `noindex` 404 page, so under the user-level SEO rule the site
  counts as one indexed page, and crawlers that never run scripts still read
  the canonical. The 404 page carries the home page's canonical beside its
  `noindex`, which is accepted, since the `noindex` keeps it out of search.

## Label casing
Decided 2026-10-22: the site's eyebrow labels (the small uppercase line above
each heading, the menu's included) and its form field labels are written in
Title Case in the source ("Get In Touch", "Tell Us About Your Roof"), even
where CSS uppercases them on screen, since screen readers read the source.
Buttons keep their own wording ("Get a Free Quote", "Submit Free Quote
Request").

## Multi-page scroll position
Decided 2026-10-17: the user-level "Multi-Page React Sites: Scroll Position"
rule doesn't apply here. The 404 page is the only other route, and it's a
short page rather than a scrollable one, so a scroll-to-top hook would add
complexity for no real gain. For the same reason there's no back to top link
(decided 2026-10-17): the home page's footer and bar already have Home, and
the 404 page is too short to need one.

## Section links
Decided 2026-10-18: `ui/section-link.ts` exports `useSecCliFun` and, since
the skip link (2026-10-23), `modCliFun`, while `useSecLinFun`, which the
user-level "## Section Links: No Hash In The Address" implementation bullet
also has the file export, stays internal to it: every section link goes
through the shared click handler, and nothing else needs it.

## Skip link
Added 2026-10-23, under the user-level "## Skip Link And Modal Layers" rule.
The main content is everything between the bar and the footer: the home
page's four sections, and the 404 page's message and its two buttons. The
bar's `NavBarCom` renders the link first on both pages, a blue button waiting
above the screen that slides down over the bar's corner when focused, and
both pages' `<main>` carry `id='main'` and `tabIndex={ -1 }` as its target.
Before the link, axe reported `bypass` as needing review in the `menu-phone`
state, the expected result of the open menu making the page inert, as the
rule explains; with the link in place every state passes it outright. The
gradient contrast review (axe's `color-contrast` needing review over the
hero, Contact section, and footer) was checked by eye and marked done by the
user on 2026-10-23.

## Horizontal layout
Decided 2026-10-09, after comparing both options from the user-level "Width
is decided per project" rule: reese-roofing's method, applied in `45b71d0`.
The user compared it with the live site across device widths and kept it,
so it's settled (2026-10-10).
- **Fluid (horizontal rhythm)**: layout values only. The page gutter
  (`--gut-sid-pad`, reese-roofing's own), the column gaps between section
  columns, panel and button side padding, and the footer's column gap are
  each a `clamp()` of a `--hor-rhy-*` step between two `--spa-hor-*` steps.
  The logos and the Services header take `max()` of a rhythm-step floor and
  a horizontal step, since their columns already cap them.
- **Fixed (rem steps)**: everything inside a component: small gaps, card,
  field, and tag padding, the heading rules, and the menu lines. The phone
  menu's call and Free Quote buttons count as component padding too
  (decided 2026-10-18), on a fixed `--spa-hor-m01`, the same as the phone
  menu buttons in reese-roofing, hair-designs, and tonys-toppers, while the
  bar's own buttons stay fluid. The 3px
  value markers stay literal, since no step lands within 10%.
- **Content cap**: a fixed `1920px / ρ` (about 1,449.4px), the same as
  reese-roofing.
- **Hero ring**: follows the logo at a fixed offset (`--rin-ver-off` and
  `--rin-hor-off`, one per axis), the way reese-roofing's oval follows its
  logo, so it never falls behind a growing logo.
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
  assets/                images and fonts used by 2 or more pages
                         (logo-simple.webp, fonts/)
  pages/
    home/                the home page, its sections, and logo-full.webp
    not-found/           the 404 page
  ui/                    components used by 2 or more pages (nav, footer),
                         section-link.ts, and sections.ts
  styles/                global CSS only (fonts.css, styles.css)
  utils/                 app-agnostic helpers (motion.ts, rhythm.ts)
```
Outside `src/`: `tests/` holds the Playwright suites (see "## Test
suites"), and `design/` holds source artwork that isn't served, with the
scripts that render it: `design/og-image/` (the social preview card) and
`design/icons/` (the favicon set), into `public/`, and `design/logos/` (both
logos), into `src/`.
- **`pages/` takes the place of `tabs/`.** Each route gets its own folder,
  and a component only that page uses (the hero, Services, About, and
  Contact sections) lives in that folder. The 404 page is
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
     Return Home button, a Get a Free Quote button to the Contact section,
     and its own title and noindex tag. Every section link works from it
     through `ui/section-link.ts`, and the home page scrolls to a hash it
     arrives with and then clears it, as asked for the same day.
   - **Security headers, WebP logos, and SEO: done 2026-10-09**, as recorded
     under "Kind of site" and "Accessibility pass".
   - **Social previews: done 2026-10-09.** The 1,200x630 card
     (`public/og-image-2.png` since 2026-10-23, 270 KB) shows the logo over
     "Commercial Roofing" and "Lawrence, KS" on the hero's navy, grid, and
     glow, inside the center square; it's rendered by `npm run og-image` from
     `design/og-image/card.html`, which reads the site's own fonts and tokens.
     The Open Graph and Twitter tags match the page's title and description,
     and the favicon set (ICO, 16 to 512px PNGs, and a 180px Apple touch icon
     on white) is rendered by `npm run icons` from `design/icons/mark.png`, the
     old 1,210px `public/favicon.png`. A changed card needs a new filename,
     since apps cache previews: on 2026-10-23 it was rebuilt from the
     re-encoded full logo as `og-image-2.png`, so the next change takes
     `og-image-3.png`. The user checked the live card with a preview checker on
     2026-10-10, and it came back with no problems.
   - **Interaction feedback: done 2026-10-09.** Every link and button changes
     color on hover, and the buttons also lift a pixel (the service cards 3px,
     while the bar's menu toggle only changes color); buttons press in to 0.97
     and text links dim. Focus rings ease in from a zero-width outline set once
     in `styles.css`, drawn in `--foc-rin-col`, which the skip link, the dark
     bar, hero, About card, Contact section, footer, and 404 page set to the
     light accent for contrast. The contact form's success panel fades up with
     its check popping in once, its error fades in, and the submit button's
     label fades to Sending... while a request is out. Since 2026-10-18 the
     panel and the error also leave the way they came, sinking out quicker
     (209ms and 158ms) before the form returns or a retry goes out; their exits
     shorten to .01ms under reduced motion, since the page waits on their end
     to remove them. Everything has a reduced-motion variant. The service cards
     lift and the service area tags fill on hover even though neither is
     clickable, which the user chose to keep (2026-10-18). The menu's phone
     button carries a border the same blue as its fill, so when hover empties
     the fill to leave a blue outline with light blue text, the button keeps
     its size and nothing beside it moves.
   - **Reveal hooks go on a wrapper** wherever the revealed element has its
     own hover or press transform: the reveal's global rule sets
     `transition` and `transform` on the element it marks, which silently
     cancelled the service cards' lift (in every engine, before this pass)
     and would have cancelled the Call Now button's. Each card and that
     button now sit inside a plain reveal div.
   - **Section links and the phone menu updated 2026-10-17**, on the
     `rules-update` branch. Every section link (bar, menu, hero, footer, and
     404 page) is now a real `/#section` link handled by `ui/section-link.ts`'s
     `useSecCliFun`, copied from hair-designs: a plain click scrolls in place
     or navigates home with no hash left behind, while a Ctrl, Cmd, or middle
     click opens the section in a new tab, which jumps there once the fonts
     load and clears its hash. The footer's section buttons became links.
     The phone menu gained a dimmer behind it (`--scr-mai-col`, the inverse
     navy at about 0.57 opacity) that closes it on a tap, and, copied from
     reese-roofing, it makes the page behind it inert, closes on Escape
     (returning focus to its button), and closes when the screen widens past
     the breakpoint. It also gained a staggered entrance; an active section
     dot; a label that nudges sideways on hover; and a contact block with the
     phone number and Free Quote buttons side by side above the hours and
     service area. The user may drop the Free Quote button if the menu looks
     crowded.

## Test suites
Added 2026-10-08, adapted from reese-roofing's. Playwright suites live in
`tests/`, one project per suite and engine in `tests/playwright.config.ts`,
which starts its own dev server on port 5197 (never the usual 5173, nor the
5190 to 5196 its sibling projects use) and stops it afterwards. Every suite
runs in Chromium, Firefox, and WebKit. Results,
screenshots, and traces go to `tests/output/` (git-ignored); `npx playwright
show-report tests/output/report` opens the HTML report. The states the suites
visit (the home page and the 404 page at 390px and 1,440px, plus the mobile
menu open at 390px) are listed in `tests/support/states.ts`. Its `opeStaFun`
scrolls through the page before checking it, since the Services, About, and
Contact sections only fade their content in once scrolled into view, and skips
animations that repeat forever (the hero logo's `logRinDivLoopPulse`) when
waiting for the page to settle.
- `npm run test:accessibility`: the pre-commit accessibility scan. axe-core
  checks each state, and the contact form's thank-you message and error (sent
  against a faked Netlify answer), against WCAG 2.2 A and AA plus best
  practices (`axe.spec.ts`), and scripted checks (`scripted.spec.ts`) cover
  link and button names, a Tab walk (order, traps, focus on screen, uncovered,
  and visible), reflow at 320px, motion under reduced motion, and the contact
  form's announcements: its alert region waits in the page empty and gains the
  error, focus stays on the submit button after a failed send, and focus moves
  to the thank-you message and back to the form. axe's "needs review" results
  are printed and attached to the report rather than failing the run.
- `npm run test:interaction`: checks what the controls do, with
  `behavior.spec.ts` opening each page under reduced motion so scrolls land at
  once. The bar's links, brand, menu, footer links, and hero buttons land on
  their sections with a clean address, the first Tab on each page reaches the
  skip link and clicking it focuses the main content, a Ctrl or Cmd click and a
  middle click on the bar's About link each open it in a new tab, a Ctrl or Cmd
  click on the menu's About link leaves the menu open, and the menu closes on
  Escape, on a tap of its dimmer, and when the screen widens; the contact form
  refuses incomplete requests and reports a faked Netlify answer honestly; and
  the 404 page, its buttons, and a section address like /#about lead where they
  should. `feedback.spec.ts`, adapted from reese-roofing's, checks that every
  control in every state has a hover and press change, with every property each
  change touches (on the control or anything inside it) eased by a transition,
  and transitions its focus ring's outline (the phone link in the contact
  form's error message included, reached after a faked failed send), that every
  form field has a focus change that eases in, that the home page's service
  cards and area tags have a hover change that eases in, that the focus ring
  eases in to full width, and that feedback stays without motion under reduced
  motion. Its two every-control probes are marked slow, since each takes about
  28 seconds in Chromium. The open menu state parks the pointer in the bar's
  corner after tapping the toggle, so the toggle's hover color stays out of
  every check of it.
- `npm run test:rendering`: compares a full-page screenshot of every state with
  its baseline in `tests/rendering/baselines/`, with zero tolerance: no pixel
  may differ, and the per-pixel color threshold is 0 too, since Playwright's
  default of 0.2 let a slight color change pass unnoticed. The footer's
  copyright line is masked, since its year changes. After an intended visual
  change, refresh with `npm run test:rendering -- --update-snapshots` and
  commit the baselines with it. Baselines are captured on Linux.
- `npm run test:responsive`: measures the home page and the 404 page at 18
  widths from 320 to 1,920px (a pixel either side of each breakpoint included),
  and the open menu at each of those up to its 768px breakpoint, failing on
  sideways scrolling, an unclipped element past either edge, text spilling its
  box, two reachable controls overlapping, or a grid whose rows hold different
  counts (a lone centered last card aside).
- `npm run test:seo`: checks each route's title, description, canonical,
  robots, and single h1, and the author on the home page; that the structured
  data is a RoofingContractor with the site's name and live URL, that its phone
  matches every call link and its city, hours, founding year, legal name, and
  service areas all appear on the page, and that it gives no street address;
  that the social tags are complete and match the page, the theme color names
  the site's darkest navy, the card is a 1,200x630 PNG under 300 KB, and every
  linked icon is served at its size; and that robots.txt and the sitemap say
  what they should.
- `npm test` runs every suite.

## Live checks
Done by the user on 2026-10-10, after the step 7 deploy:
- **Contact form**: a test submission arrived in Netlify's Forms tab. The
  hidden detection copy of the form in `index.html` carries its `name`,
  `data-netlify`, and `hidden`, and each field carries its `name`, an
  `aria-label` (added for WAVE, below), and, on the inputs, a `type`. It was
  rebuilt from pasted JSX that repeated the React form's input ids.
- **Security headers and social preview**: both graded with no problems.
- **Contrast over the gradients**, which axe can't measure (the hero's,
  Contact section's, and footer's text): checked by eye and passed.
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
  addresses, and each number sits where a visitor may want to call. Since
  2026-10-17 the phone menu's call link adds a sixth, and the contact form's
  error message a seventh after a failed send, both kept for the same reason
  (recorded 2026-10-22).

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
adjusted to clear 4.5:1. All 144 tests then passed in all three engines.
- **The logos are rendered by a script** (done 2026-10-22): both originals
  (`logo-full.png`, 4,763x4,640, and `logo-simple.png`, 1,210x1,025) were
  restored from git history into `design/logos/`, and `npm run logos`
  (`design/logos/render.mts`) writes both WebP copies into `src/` through
  Chromium's canvas. The full logo stays 968x943 at 0.95 quality (57 KB),
  under 3x its widest drawing of about 628px, and the simple mark became
  131x111 lossless (15 KB, down from 21 KB), under 3x its 44.876px box,
  each keeping the original's proportions to within about 0.01px where it's
  drawn.
- **The logos stay raster** (confirmed 2026-10-17): the company has no SVG
  version of either logo, so the WebP copies the logo script renders remain
  until it does.
- **The logos were resized on 2026-10-08** (at the user's go-ahead, ahead
  of step 7): `logo-full.png` went from 4,763x4,640 (3.7 MB, about 88 MB
  decoded) to 968x943 (299 KB), at least 2x its largest display and 3x the
  phone hero, and `logo-simple.png` from 1,210x1,025 (705 KB) to 157x133
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
  menu, and the form worked, and the live site's grade came back with no
  problems after the deploy. Anything later added from another origin
  (analytics, a map, an embedded review widget) needs its origin added to the
  policy.
- **Netlify builds with Node 24.x**, set in the site's Netlify settings
  rather than in the repo.
