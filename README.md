# Ceylon Spicera — Landing Page

Premium Sri Lankan spice exporter. Frontend built to match the Lanka Ivory
Destinations stack: **Next.js 15 (App Router) · TypeScript · Tailwind CSS v4**.
Runs on **port 3001** so it can sit alongside Lanka Ivory (port 3000).

## Run it (Windows / IntelliJ terminal)

```bash
npm install
npm run dev
```

Then open **http://localhost:3001**

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build on port 3001
```

## What's here (Phase 1 — Foundation)

- Next.js 15 + React 19 + TypeScript 6, App Router
- Tailwind CSS v4 with brand design tokens in `app/globals.css` (`@theme`)
- Self-hosted fonts (Cormorant Garamond + Manrope) via `next/font/local` —
  no runtime Google Fonts dependency, files in `app/fonts/`
- The crest at `public/logo/CS.png`
- All section content typed in `lib/site-data.ts`
- A temporary foundation-check page at `app/page.tsx` (palette + type proof);
  it gets replaced section-by-section from Phase 2 on

### Design tokens

| Token        | Utility            | Hex       |
| ------------ | ------------------ | --------- |
| Cream        | `bg-cream`         | `#F7F3EA` |
| Panel        | `bg-panel`         | `#FBF8F1` |
| Charcoal     | `text-charcoal`    | `#2C2C2C` |
| Spice        | `text-spice`       | `#7A4A22` |
| Gold         | `text-gold`        | `#C59A3D` |
| Forest       | `text-forest`      | `#1F3A2A` |

Type: `font-display` (Cormorant Garamond) · `font-sans` (Manrope)

## Build roadmap

1. **Foundation** — scaffold, tokens, fonts, logo ✅ (this delivery)
2. Header + Hero
3. Featured Categories + Why Ceylon Spicera
4. Best Sellers + Our Heritage
5. Export to the World + Reviews
6. Spice Experience masonry + Newsletter + Footer
7. Polish — Framer Motion, responsive/mobile, final QA

_Framer Motion is intentionally deferred to the polish phase, as with Lanka Ivory._
