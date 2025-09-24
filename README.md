# Adventures in Faith

A fast, mobile-friendly **book reader** for the memoirs of **Duane H. Klepel** and related works. Built with **Vite +
React**, styled with **Chakra UI**, and shipped as a **PWA** to GitHub Pages at **https://books.klepel.org**.

> **Live site:** https://books.klepel.org  
> **Repo:** https://github.com/israel-dryer/adventures-in-faith

## Features

- 📖 **Book viewer** with responsive layout and SPA routing
- ⚡ **Vite** dev server + production build
- 🧭 **React Router** SPA fallback (404.html) for deep links
- 📱 **PWA**: manifest, service worker, installable on mobile/desktop
- 🖼️ **Optimized images** (AVIF/WebP/JPEG) with simple manifest per book
- 🎨 **Chakra UI** components and theme
- 🚀 **CI/CD** via GitHub Actions → GitHub Pages
- 🔒 **Custom domain** `books.klepel.org` with HTTPS

## Tech Stack

- React 18 + React Router
- Vite
- Chakra UI
- TypeScript (if enabled)
- GitHub Actions (Pages)
- PWA (web manifest + service worker)

## Quick Start

```bash
# 1) Install
npm install

# 2) Run dev server
npm run dev
# -> http://localhost:5173

# 3) Build for production
npm run build
# output in /dist

# 4) Preview the production build locally
npm run preview
```

## Project Structure

```
adventures-in-faith/
├─ public/                 # static assets copied as-is
│  ├─ CNAME                # books.klepel.org
│  ├─ manifest.webmanifest # PWA manifest
│  └─ icons/               # PWA icons (including maskable if available)
├─ src/
│  ├─ assets/              # local images, backgrounds, fonts
│  ├─ components/          # React UI components
│  ├─ pages/               # Route pages (Home, Book, About, etc.)
│  ├─ books/               # Book manifests (JSON) and helpers
│  ├─ main.tsx             # App bootstrap
│  └─ router.tsx           # React Router config
├─ .github/workflows/
│  └─ deploy.yml           # Build + deploy to GitHub Pages
├─ index.html              # App shell
├─ vite.config.ts
├─ package.json
└─ README.md
```

## Adding a Book

Each book has a simple **manifest JSON** describing pages and sources:

```jsonc
{
  "id": "thailand-adventure",
  "title": "Thailand Adventure",
  "year": "2001",
  "creator": "Duane Klepel",
  "basePath": "/assets/books/thailand-adventure/pages",
  "pageRatioWH": "100/131", // width/height ratio hint (see note below)
  "pages": [
    {
      "id": "001",
      "label": "1",
      "src": {
        "avif":  "/assets/books/thailand-adventure/pages/thailand-adventure.001-1600.avif",
        "avif2x":"/assets/books/thailand-adventure/pages/thailand-adventure.001-2600.avif",
        "webp":  "/assets/books/thailand-adventure/pages/thailand-adventure.001-1600.webp",
        "webp2x":"/assets/books/thailand-adventure/pages/thailand-adventure.001-2600.webp",
        "jpg":   "/assets/books/thailand-adventure/pages/thailand-adventure.001-1600.jpg"
      }
    }
    // ...
  ]
}
```

**Aspect ratio tip**  
Use `pageRatioWH = width / height` expressed as `100/N`.

- *Jerusalem Adventure* → 1600×2608 → 1600/2608 ≈ **0.6135** ≈ **100/163**
- *Thailand Adventure* → 1600×2092 → 1600/2092 ≈ **0.764** ≈ **100/131** ✅

This helps the layout reserve correct space while images load (less content shift).

## PWA Notes

- `manifest.webmanifest` is referenced from `index.html` with a root-relative path (`/manifest.webmanifest`).
- A minimal service worker can precache app shell + manifest icons. If you add Workbox later, install as a dev
  dependency and generate SW at build; otherwise a custom `sw.js` is fine.
- **Maskable icons:** recommended but not required. If you don’t have them, keep standard PNG icons; add maskable
  variants later for better Android install UX.

## Deployment (GitHub Pages)

This repo deploys automatically via **GitHub Actions**:

- Workflow: `.github/workflows/deploy.yml`
- Steps:
    - Install → Build (`npm run build`) → copy SPA fallback (`dist/index.html → dist/404.html`)
    - Write `dist/CNAME` (`books.klepel.org`)
    - Upload artifact → Deploy with `actions/deploy-pages`

**Repo Settings**

- **Settings → Pages → Build and deployment → Source: GitHub Actions**
- After the first successful deploy, enable **Enforce HTTPS**

**DNS (Squarespace)**

- Add a **CNAME** record:
    - **Host**: `books`
    - **Value**: `israel-dryer.github.io`

## Environment & Scripts

`package.json` should include:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

If you change Vite’s `build.outDir`, also update the workflow’s artifact path and the SPA fallback copy step.

## Contributing

Issues and PRs are welcome. Please:

- Use clear commit messages
- Keep UI changes accessible and responsive
- Prefer AVIF/WebP where possible; include a JPEG fallback if needed


### Acknowledgements

- In loving memory of **Duane H. Klepel (1937–2024)**
- Thanks to the open-source communities behind React, Vite, and Chakra UI
