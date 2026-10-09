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
- **The name isn't consistent yet**: the source uses both "Seal and Shield
  LLC" and "Seal & Shield". Which one is canonical is settled with the user
  during the SEO pass, then used everywhere.
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
   after each: Vite 8 with `@vitejs/plugin-react` 6, React 19, React Router 7,
   then TypeScript 6.0 (the newest `typescript-eslint` supports).
3. **ESLint**, set up from ease-my-life's `eslint.config.ts`.
4. **Playwright and axe** in all three engines, with baseline screenshots
   taken before anything moves, so later steps can prove nothing changed on
   screen.
5. **Directory structure**.
6. **Formatting, naming, and comment passes, CSS modules, and design
   tokens**, then the horizontal layout decision above.
7. **New features**: the 404 page, SEO, social previews, and interaction
   feedback.

## Known issues
- **`README.md` describes Reese Roofing**, the project this site was copied
  from (its name, placeholder contact details, and file layout). It gets
  rewritten for Seal and Shield once the directory structure settles.
