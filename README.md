# Abbas Hardware

A responsive static hardware-store landing page built with Next.js.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the page.

## Static build

Create a production-ready static export:

```bash
npm run build
```

The exported site is written to the `out/` directory.

Brand catalog PDFs are served from `public/catalogs/` and displayed in the
Shop Now section as page-by-page galleries with thumbnails. Add new PDFs there
and update the catalog entries in `app/catalog.js` to show them on the page.