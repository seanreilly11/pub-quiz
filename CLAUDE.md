# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # dev server (Turbopack, default in Next.js 16)
npm run build     # production build
npm run start     # production server
npm run lint      # ESLint (next build no longer runs lint automatically in v16)
```

Type-check without emitting:

```bash
npx tsc --noEmit
```

## Next.js 16 Key Changes

This project uses **Next.js 16.2.9** — several breaking changes from v14/v15:

- **Turbopack is the default bundler** (`next dev` uses Turbopack). Use `next dev --webpack` to opt out.
- **`next build` does not run lint**. Run `npm run lint` separately.
- **`next lint` CLI is removed** — lint runs via `eslint` directly (see `package.json`).
- ESLint config uses the flat config format (`eslint.config.mjs`), not `.eslintrc`.

Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/`.

## Code Reuse

If a component or function is used in two or more places, extract it into a shared module. Components go in `components/`, utilities in `lib/`. Don't duplicate — abstract.

## Commit messages

Never include any message about "Co-authored by Claude" or anything similar. Keep the commit message succinct.

## Architecture

- **App Router** only — no Pages Router. All routes live under `app/`.
- **`@/*` alias** maps to the repo root (e.g. `@/components/Foo` → `./components/Foo`).
- **Tailwind CSS v4** — config via PostCSS (`postcss.config.mjs`), no `tailwind.config.js`.
- **React 19** — use React 19 APIs; avoid patterns deprecated in React 18.
- Fonts loaded via `next/font/google` in `app/layout.tsx`; CSS variables `--font-geist-sans` and `--font-geist-mono` are available globally.
