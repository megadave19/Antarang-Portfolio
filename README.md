# Antarang Portfolio

A 3D, scroll-driven personal site for **Antarang Gaur** — AI Product Manager &amp; Growth Strategist, currently at sovity GmbH (Catena-X ecosystem). Built with React, Three.js, React Three Fiber, GSAP, and Rapier physics.

> © 2026 Antarang Gaur. All rights reserved.

---

## What this is

A single-page portfolio designed to read like a story rather than a CV dump:

- **Landing** — name, role, swap-tagline.
- **About** — one-paragraph positioning statement.
- **Career** — animated timeline from sovity back to Transparency Market Research.
- **What I Do** — two pillars: *Discovery &amp; Delivery* and *Growth &amp; GTM*, each with skill chips.
- **Work** — carousel of case studies (Sovity Sales Intelligence first).
- **Tech Stack** — physics-driven 3D cluster of spheres, each with the tool's logo on one hemisphere and the tool's name on the opposite hemisphere.
- **Contact** — direct lines (email, IN + DE phone), social links, downloadable résumé.

The 3D character, smooth scrolling, custom cursor, and loading sequence are part of the experience; they are not decorative add-ons.

---

## Stack

| Layer | Choice |
| --- | --- |
| Build | Vite 5, TypeScript 5 |
| UI | React 18 |
| 3D / Physics | three.js 0.168, @react-three/fiber, @react-three/drei, @react-three/rapier, @react-three/postprocessing |
| Animation | GSAP 3 + ScrollSmoother / ScrollTrigger |
| Icons | react-icons (Fa6, Si, Md, Tb) |
| Misc | react-fast-marquee, @vercel/analytics |

---

## Local development

Requirements: Node 18+, npm 9+.

```bash
npm install
npm run dev      # starts Vite on http://localhost:5173
npm run build    # type-check + production bundle to /dist
npm run preview  # serve the production build locally
npm run lint     # ESLint
```

---

## Project layout

```
src/
├── components/
│   ├── About.tsx
│   ├── Career.tsx
│   ├── Character/       # 3D character + scene
│   ├── Contact.tsx
│   ├── Cursor.tsx
│   ├── Landing.tsx
│   ├── Loading.tsx
│   ├── MainContainer.tsx
│   ├── Navbar.tsx
│   ├── SocialIcons.tsx
│   ├── TechStack.tsx    # canvas-texture 3D logo bubbles
│   ├── WhatIDo.tsx
│   ├── Work.tsx
│   ├── styles/          # per-section CSS
│   └── utils/           # GSAP setup, initial FX
├── context/             # LoadingProvider
├── data/                # boneData for the 3D rig
└── App.tsx, main.tsx

public/
├── images/              # logos (SVG), case-study covers, character textures
├── models/              # character.enc + HDR environment
└── Antarang_Gaur_CV.pdf
```

---

## Notable implementation details

### Two-sided 3D logo bubbles
Each sphere in the Tech Stack section is rendered with a dynamically generated `CanvasTexture` (1024 × 512). The canvas is split in half: the left half (which maps around `u ≈ 0.25` on the sphere) carries the tool's logo, and the right half (`u ≈ 0.75`) carries the tool's name in bold black, auto-fit to a single line. Because the two halves wrap to opposite hemispheres, you see logo from one angle and name from the other as the physics engine tumbles the cluster.

### Logo asset pipeline
All 15 tech-stack logos are sourced from **Iconify** (`logos/*` collection and `simple-icons/anthropic` / `devicon/lovable`). Each downloaded SVG is wrapped at build time into a 256 × 256 square with a white background and the logo inset to ~60% — this gives the spheres a clean white finish that matches the original design language.

### Career timeline alignment
Date column kept on a fixed 130px right-aligned track so multi-line role titles never push the years out of alignment.

### Smooth scrolling + section narrative
GSAP ScrollSmoother drives the page; each section uses ScrollTrigger to swap visibility states (e.g. the Tech Stack physics activate only once the user scrolls past `#work`).

---

## Asset sources

| Asset | Source |
| --- | --- |
| Tech-stack logos | [Iconify](https://iconify.design/) — `logos/*`, `simple-icons/anthropic`, `devicon/lovable` |
| 3D character + HDR | bundled with project (encrypted) |
| Fonts | system fallbacks (Inter / Helvetica Neue) |
| Résumé PDF | authored by Antarang Gaur |
| SSI case-study cover | authored by Antarang Gaur |

---

## Roadmap

See the [Issues](../../issues) tab — every feature, refinement, and known TODO is filed there.

---

## License &amp; ownership

The 3D portfolio framework this project is built on is open-source under the MIT License; that original notice lives in [`LICENSE`](./LICENSE) as required by the license terms.

All **content** of this site — the bio, career history, case studies, résumé, photographs, skill descriptions, and all customizations made on top of the framework — is © 2026 **Antarang Gaur**. Cloning, redistribution, or reuse of the personalised content is not permitted without written consent.
