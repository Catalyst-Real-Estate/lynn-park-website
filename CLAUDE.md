# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML website for Lynn Corporate Park — an industrial/warehouse property in Wixom, Michigan. Hosted on GitHub Pages at `lynn-park.com`. No build tools or frameworks; everything is vanilla HTML5, CSS3, and JavaScript.

## Validation

HTML is validated via HTMLHint in CI. To validate locally:

```bash
npm install -g htmlhint
htmlhint "**/*.html"
```

CI runs automatically on push/PR to `main` via `.github/workflows/validate.yml`.

## Deployment

Pushing to `main` automatically deploys via GitHub Pages. No manual deploy step. The `.nojekyll` file disables Jekyll processing so HTML is served as-is.

## Architecture

The entire site is a single file: `index.html` (~1,640 lines). All CSS is in a `<style>` block and all JavaScript is in a `<script>` block at the bottom — no external JS or CSS files.

**Section order in index.html:**
1. `<nav>` — sticky header
2. Hero — image carousel (5 images from `images/Slider/`, 5.5s auto-rotate)
3. Testimonials carousel
4. Available Spaces — filterable grid with Photo/Floor Plan tabs and a lightbox for floor plans
5. Gallery — 8-image masonry grid
6. Features, Who Leases Here, About the Park, Location (embedded map), FAQ (accordion), CTA banner, Footer

**Key CSS variables** (defined at `:root`): forest green primary, orange accent, warm white backgrounds.

**JavaScript patterns**: all vanilla JS with no libraries. Uses `querySelectorAll` + event delegation. Intercom chat widget loaded via CDN snippet at bottom of `<body>`.

**Images** live in `images/`:
- `Slider/` — hero carousel JPGs
- `floorplan-*.png` — floor plan diagrams
- `gallerypic-*.jpg` — gallery photos
- `site-plan*.png` — site plan variants

**Schema.org** markup (`LocalBusiness` + `FAQPage`) and Open Graph meta tags are in `<head>` for SEO.
