# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

The workspace folder Lilian Data Group is the project and Git repository root. The Next.js application lives in `frontend/`, and Firebase deployment configuration lives in `backend/`. It uses Next.js 16.4 (App Router), React 19.3, TypeScript, Tailwind CSS 4, Framer Motion, Lucide icons, and the Cairo and Plus Jakarta Sans fonts (bundled locally through `@fontsource`).

The workspace root contains repository metadata, frontend/, backend/, guides, and existing design reference files.

Run these commands from the workspace root, or drop `--prefix .\frontend` when running inside `frontend/`:

| Task | Command |
|---|---|
| Development | `npm --prefix .\frontend run dev` |
| Lint | `npm --prefix .\frontend run lint` |
| Production build (also type-checks) | `npm --prefix .\frontend run build` |

Run `npm --prefix ./frontend test` for the Node.js content validation tests. Use build to verify TypeScript and production export.

## Deployment (all free tiers, project name LDG)

- **GitHub:** public repo `Eldesouky97/LDG`. Pushing to `main` runs `.github/workflows/deploy-pages.yml`, which builds with `NEXT_PUBLIC_BASE_PATH=/LDG` and deploys to GitHub Pages (https://eldesouky97.github.io/LDG/). For a local base-path build in Git Bash, prefix `MSYS_NO_PATHCONV=1` or the path gets mangled.
- **Vercel:** project `ldg` (https://ldg-eta.vercel.app), connected to the GitHub repo, so every push to `main` deploys automatically. Manual deploy: `vercel --prod`.
- **Firebase Hosting:** project ID `ldg-website-app` (display name "LDG Website"; Google requires at least 4 characters, and `ldg-website` was taken), https://ldg-website-app.web.app. Run `npm run build` without the base path, then run `node prepare-hosting.mjs` and `firebase deploy --only hosting` from backend/.

## Next.js version caveat (from `frontend/AGENTS.md`)

This Next.js version has breaking changes from what you may know. Before writing Next.js-specific code, read the relevant guide in `frontend/node_modules/next/dist/docs/` and heed deprecation notices. `next dev` re-adds the agent-rules block to `AGENTS.md`, so don't remove it.

`next.config.ts` sets `output: "export"` (static site in `out/`) with `images.unoptimized`; `cacheComponents`/PPR is incompatible with export mode, so don't re-enable it. `NEXT_PUBLIC_BASE_PATH` sets `basePath` for the GitHub Pages build (`/LDG`), and `next/image` sources must be prefixed with it manually (see `logoSrc` in `page.tsx`). Because image optimization is off, the page uses `public/ldg-ribbon-logo.webp` (800px, ~60 KB) rather than the 1.2 MB source PNG; regenerate the WebP with `sharp` if the logo changes.

TypeScript is pinned to 6.x because typescript-eslint (used by `eslint-config-next`) rejects TypeScript 7. The remaining `npm audit` warnings come from `braces` inside the ESLint toolchain (dev-only, no fix published); don't run `npm audit fix --force`, since it downgrades `eslint-config-next` to 14. Tailwind runs through a Turbopack CSS loader rule (`@tailwindcss/turbopack`), not PostCSS. Layouts use the global `LayoutProps<"/">` type helper.

## Architecture

- **The public site is a client component.** `frontend/src/site/HomePage.tsx` (`"use client"`) renders the whole homepage. `layout.tsx` only loads fonts, sets metadata, and renders `<html lang="ar" dir="rtl">`.
- **Bilingual copy:** all user-facing text lives in the `content` object at the top of `page.tsx`, keyed by `ar` and `en`. Its structure is identical in both languages, and it is declared `as const`. Any text change must update both languages, and parallel arrays (such as `products`, `productTypes` and `productText`) must stay aligned with the icon arrays `serviceIcons` and `solutionIcons`. Likewise, `content.*.nav` labels map by index to `navIds`, which must match the `id` of each `<section>` (`about`, `services`, `solutions`, …). Most CTAs and cards link to `#contact`.
- **Language toggle:** `language` state drives `t = content[language]`. A `useEffect` syncs `document.documentElement.lang` and `dir`, and `<main>` also receives `dir`.
- **Styling:** semantic CSS classes in `src/site/styles/site.css` (e.g. `hero-section`, `button button-primary`), not Tailwind utility classes. Brand tokens are CSS custom properties on `:root` (`--ink`, `--blue`, `--cyan`, `--violet`, `--pink`, `--gradient`, …). Follow this pattern rather than mixing in utility classes. Responsive rules and a `prefers-reduced-motion` block are at the end of the file.
- **Contact form:** `sendInquiry` validates the fields and builds a `mailto:` URL with no recipient. The "demo" and "quote" buttons on products set `inquiryKind` and `inquiryInterest` to prefill it.
- **Assets:** the approved ribbon logo is `public/ldg-ribbon-logo.png` (source), served as `ldg-ribbon-logo.webp`. The other SVGs in `public/` are create-next-app leftovers.

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
