# HexTorq Portfolio 2

Production portfolio template for HexTorq.

Live site: https://portfolio-2.hextorq.tech/

## Website Overview

HexTorq Portfolio 2 presents the company through an interactive dashboard-style interface. The design feels like a futuristic engineering console with active section tracking, animated modules, product interaction areas, and a contact flow styled like a communication gateway.

This version is best suited when HexTorq should feel like a high-tech engineering partner with a strong interactive product-demo character.

## Page Flow

- Home: oversized HexTorq branding, short positioning, and action buttons.
- About: company story, stats, and milestone-style visuals.
- Services: interactive engineering pillars.
- Products: selectable product showcase.
- Projects and process routes: mapped into the closest available sections for consistent template switching.
- Contact: form-style communication terminal with success feedback.

## UI Direction

- Dark cyber-interface style with cyan, violet, and amber highlights.
- Floating navigation and scroll progress details.
- HUD-style supporting elements for a technical systems feel.
- Interactive cards and tabs for services and products.
- Small template-switch control for moving to another HexTorq portfolio style while keeping the same route.

## Static Build And SEO

The project uses Vite with a prerender step. Running the build generates static HTML route folders in `dist/`, so deployed pages can be served directly as HTML, CSS, and JavaScript.

```bash
npm install
npm run build
```

The generated output includes prerendered pages such as `/about/`, `/services/`, `/products/`, `/projects/`, `/process/`, and `/contact/`.

## Deployment Notes

This site is intended for Vercel static deployment. The included `vercel.json` allows cross-origin asset loading and iframe embedding from HexTorq domains so the portfolio mix website can preload and display this template.

## Content Editing

The main visible UI is organized across `src/App.tsx` and files inside `src/components`. Update those files for final company wording, service labels, product details, and contact text.
