# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This folder is the Git repository root. The Next.js application lives in `frontend/` (all npm commands run there; Node 22+), and Firebase configuration (Firestore rules, indexes, hosting) lives in `backend/` (all `firebase` commands run there). There is no custom server: Firebase Auth + Firestore are the backend. Stack: Next.js 16.4 (App Router), React 19.3, TypeScript 6, Tailwind CSS 4, Framer Motion, Lucide icons, Cairo and Plus Jakarta Sans fonts (bundled locally through `@fontsource`). The root-level PNGs are gitignored design references (brand identity board, mockups).

Run these from the repository root, or drop `--prefix ./frontend` when inside `frontend/`:

| Task | Command |
|---|---|
| Development (site at `/`, admin at `/admin`) | `npm --prefix ./frontend run dev` |
| Lint | `npm --prefix ./frontend run lint` |
| Production build (also type-checks; output in `frontend/out/`) | `npm --prefix ./frontend run build` |
| Tests | `npm --prefix ./frontend test` |
| Single test (from `frontend/`) | `node --experimental-strip-types --test --test-name-pattern="rejects executable" tests/site-content.test.mjs` |

Tests use the built-in `node:test` runner and import `.ts` sources directly via `--experimental-strip-types`, so code under test (`src/shared/content/`) must stay free of path aliases and non-erasable TS syntax. Lint must stay at zero problems; `react-hooks/set-state-in-effect` is enforced, so set state inside promise callbacks rather than synchronously in an effect.

## Deployment (all free tiers, project name LDG)

- **GitHub:** public repo `Eldesouky97/LDG`. Pushing to `main` runs `.github/workflows/deploy-pages.yml`, which builds with `NEXT_PUBLIC_BASE_PATH=/LDG` and deploys to GitHub Pages (https://eldesouky97.github.io/LDG/). For a local base-path build in Git Bash, prefix `MSYS_NO_PATHCONV=1` or the path gets mangled.
- **Vercel:** project `ldg` (https://ldg-eta.vercel.app), Root Directory `frontend`, connected to the GitHub repo, so every push to `main` deploys automatically. Manual deploy: `vercel --prod`.
- **Production domain (Cloudflare):** https://liliandata.com is served by the Cloudflare Worker `liliandata` (static assets only, `frontend/wrangler.jsonc`). DNS for `liliandata.com` is on Cloudflare (registrar: Hostinger). The apex is a Worker custom domain, and `www` is a Worker route over its proxied CNAME. To deploy: run `npm run build` in `frontend/` without the base path, then `npx wrangler deploy` there. The `social.` and `social-api.` subdomains belong to the separate LDG Social Command Center project.
- **Firebase Hosting:** project ID `ldg-website-app` (display name "LDG Website"; Google requires at least 4 characters, and `ldg-website` was taken), https://ldg-website-app.web.app. Run `npm run build` without the base path, then from `backend/` run `node prepare-hosting.mjs` (wipes and recopies `frontend/out` into the ignored `backend/hosting/`) and `firebase deploy --only "hosting,firestore" --project ldg-website-app`. Use `--only firestore` to deploy rule changes alone. Deploys never touch editor drafts or published content.

## Next.js version caveat (from `frontend/AGENTS.md`)

This Next.js version has breaking changes from what you may know. Before writing Next.js-specific code, read the relevant guide in `frontend/node_modules/next/dist/docs/` and heed deprecation notices. `next dev` re-adds the agent-rules block to `AGENTS.md`, so don't remove it.

`next.config.ts` sets `output: "export"` (static site in `out/`) with `images.unoptimized`; `cacheComponents`/PPR is incompatible with export mode, so don't re-enable it. `NEXT_PUBLIC_BASE_PATH` sets `basePath` for the GitHub Pages build (`/LDG`), and `next/image` sources must be prefixed with it manually (see `logoSrc` in `src/site/HomePage.tsx`). Because image optimization is off, the page uses `public/ldg-ribbon-logo.webp` (800px, ~60 KB) rather than the 1.2 MB source PNG; regenerate the WebP with `sharp` if the logo changes.

TypeScript is pinned to 6.x because typescript-eslint (used by `eslint-config-next`) rejects TypeScript 7. The remaining `npm audit` warnings come from `braces` inside the ESLint toolchain (dev-only, no fix published); don't run `npm audit fix --force`, since it downgrades `eslint-config-next` to 14. Tailwind runs through a Turbopack CSS loader rule (`@tailwindcss/turbopack`), not PostCSS. Layouts use the global `LayoutProps<"/">` type helper.

## Architecture

Paths in this section are relative to `frontend/` unless prefixed otherwise.

- **The public site is a client component.** `src/site/HomePage.tsx` (`"use client"`) renders the whole homepage. `layout.tsx` only loads fonts, sets metadata, and renders `<html lang="ar" dir="rtl">`.
- **Bilingual copy:** static user-facing text lives in the `content` object in `src/site/content/translations.ts`, keyed by `ar` and `en`. Its structure is identical in both languages, and it is declared `as const`. Any text change must update both languages, and parallel arrays (such as `products`, `productTypes` and `productText`) must stay aligned with the icon arrays `serviceIcons` and `solutionIcons`. Likewise, `content.*.nav` labels map by index to `navIds`, which must match the `id` of each `<section>` (`about`, `services`, `solutions`, …). Most CTAs and cards link to `#contact`.
- **Admin-editable content:** company details, contact links, portfolio and partners come from `SiteContent` (`src/shared/content/site-content.ts`), with `defaultSiteContent` as the static fallback. The homepage subscribes to Firestore `site/published`; `/admin` (`src/admin/AdminPage.tsx`) edits `site/draft` and publishes. Both documents store the content as a JSON string `payload` plus an integer `revision`; `src/services/firebase/content-repository.ts` writes them in transactions that check the revision, and `backend/firebase/firestore.rules` independently enforces the shape (`payload`/`revision`/`updatedAt` only, payload ≤ 800 KB, revision +1, admin = verified email with an enabled `admins/{email}` doc). Every read goes through `parseSiteContent`, so adding a field to `SiteContent` means updating its type, `defaultSiteContent`, the parser, the admin form, and the tests together. Draft preview: admin writes the draft into `sessionStorage['ldg-preview']` and opens `/?preview=1`. Render admin-supplied URLs only through `safeLink`/`safeImage`. See `frontend/ADMIN.md`.
- **Language toggle:** `language` state drives `t = content[language]`. A `useEffect` syncs `document.documentElement.lang` and `dir`, and `<main>` also receives `dir`.
- **Styling:** semantic CSS classes in `src/site/styles/site.css` (e.g. `hero-section`, `button button-primary`), not Tailwind utility classes. Brand tokens are CSS custom properties on `:root` (`--ink`, `--blue`, `--cyan`, `--violet`, `--pink`, `--gradient`, …). Follow this pattern rather than mixing in utility classes. Responsive rules and a `prefers-reduced-motion` block are at the end of the file.
- **Contact form:** `sendInquiry` validates the fields and builds a `mailto:` URL with no recipient. The "demo" and "quote" buttons on products set `inquiryKind` and `inquiryInterest` to prefill it.
- **Assets:** the approved ribbon logo is `public/ldg-ribbon-logo.png` (source), served as `ldg-ribbon-logo.webp`.

## Brand system (from the identity board)

- **Colors:** cyan, blue, purple, and pink with the signature LDG gradient. Use light backgrounds; do not rely on navy or dark hero sections.
- **Fonts:** Cairo for Arabic and Plus Jakarta Sans for Latin text. Both are bundled locally.
- **Taglines:** "DATA • SYSTEMS • DIGITAL TRANSFORMATION" and "Turning Data Into Smart Solutions"
- **Icon style:** thin outline icons with gradient strokes
- **Services:** Data & Analytics, Business Intelligence, Web & Mobile, Enterprise Systems/ERP, Cloud Solutions, Digital Transformation.
- **Visual language:** clean, light, and spacious, using restrained cyan-violet-pink gradients, connected-data motifs, and subtle motion.
- **Content integrity:** the product names and project cards are illustrative concepts pending LDG confirmation. Do not invent metrics, clients, case studies, or company contact details.
- **Contact workflow:** the current form opens a prefilled `mailto:` draft. Configure an approved LDG email address or submission API before launch.

## Website structure

The site is Arabic-first and supports English. Keep `lang` and `dir` synchronized with the language toggle, and use logical CSS properties for RTL layouts. The homepage includes navigation, hero, company overview, services, product showcase, industries, illustrative projects, insights, contact form, and footer.

Directional arrows should point left as the forward direction in RTL. Use logical CSS properties such as `margin-inline-start` and `inset-inline-end` where practical.
