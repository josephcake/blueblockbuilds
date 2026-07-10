# Blue Block Builds

Production-ready static React site for Blue Block Builds, designed for Cloudflare Pages.

## Requirements

- Node.js 20 or newer
- npm

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

Cloudflare Pages settings:

- Build command: `npm run build`
- Output directory: `dist`

## Environment Variables

Copy `.env.example` to `.env` if you need to override the contact form endpoint locally.

The estimate form posts to `/api/contact`, a Cloudflare Pages Function that emails submissions to `info@blueblockbuilds.com` through [Resend](https://resend.com).

Set these secrets in the Cloudflare Pages dashboard before launch:

- `RESEND_API_KEY` — API key from Resend (never commit this to git)
- `CONTACT_TO_EMAIL` — optional, defaults to `info@blueblockbuilds.com`
- `CONTACT_FROM_EMAIL` — optional, defaults to `onboarding@resend.dev`

For local function testing, copy `.dev.vars.example` to `.dev.vars`, add your Resend API key, then run `npm run build && npm run pages:dev`.

Once `blueblockbuilds.com` is verified in Resend, switch `CONTACT_FROM_EMAIL` to something like `Blue Block Builds <notifications@blueblockbuilds.com>`.

Optional photo uploads are sent as email attachments. Each file must be JPG, PNG, WebP, or PDF and 5 MB or smaller.

## Editing Content

- Services: `src/data/services.js`
- 3D product explorer categories and variants: `src/data/explorerCategories.js`
- Process, service area, contact placeholders: `src/data/site.js`

Before launch, replace all `PLACEHOLDER_*` values with verified business details. Do not add license numbers, claims, or awards unless they are confirmed.

## Visual Direction

The site is intentionally focused on interactive 3D renovation storytelling, using modeled kitchens, cabinetry, appliances, surfaces, and finish details as the primary proof of craft. The product explorer is data-driven in `src/data/explorerCategories.js`, with reusable React Three Fiber geometry in `src/three/explorer/`.

## Replacing 3D Placeholders

The current 3D renovation objects are handcrafted React Three Fiber geometry in `src/three/models/`. To replace them:

1. Add optimized `.glb` files to `public/models/`.
2. Load with `useGLTF` from `@react-three/drei`.
3. Keep fallback geometry in place for failed loads.
4. Compress assets with Draco or Meshopt.
5. Reuse materials and keep polygon counts modest.

Recommended optimization workflow:

```bash
npx gltf-transform optimize input.glb output.glb --compress meshopt
```

## Testing

```bash
npm run lint
npm run test
npm run build
```

WebGL fallback testing:

- Add `?fallback=1` to the local URL.
- Enable reduced motion in the OS/browser to verify calmer animation.
- Use a browser/device without WebGL to confirm the static composition appears.

## Launch Placeholders

- Canonical URL in `index.html`
- Open Graph image in `index.html`
- Phone, email, and privacy link in `src/data/site.js`
- Verified business copy, testimonials, and service proof points
- Resend API key and verified sender domain in Cloudflare Pages
