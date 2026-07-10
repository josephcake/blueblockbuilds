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

Copy `.env.example` to `.env` and set:

```bash
VITE_CONTACT_FORM_ENDPOINT=
```

The estimate form posts `FormData` to this endpoint. It is ready for Formspree, Basin, or a Cloudflare Worker. Optional photo uploads depend on the selected provider and must be enabled there too.

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
- Phone, email, Instagram, contractor registration in `src/data/site.js`
- Verified business copy, testimonials, and service proof points
- Verified contact form endpoint
