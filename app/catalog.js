import fs from "node:fs";
import path from "node:path";
import CatalogBrowser from "./catalog-browser";

function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// The first word of each PDF file name is the brand; the rest becomes a short label.
function describeCatalog(file) {
  const words = path
    .basename(file, path.extname(file))
    .split(/[\s_\-.]+/)
    .filter(Boolean);
  const [first = file, ...rest] = words;
  const brand = first === first.toUpperCase() && first.length <= 4 ? first : titleCase(first);
  const ignored = /^(catal(o)?g(u)?e?|brochure|book|price|list|and|new|master|qr|\d+)$/i;
  const label = rest.filter((word) => !ignored.test(word)).map(titleCase).join(" ");

  return { brand, label, file };
}

function getCatalogs() {
  const directory = path.join(process.cwd(), "public", "catalogs");

  return fs
    .readdirSync(directory)
    .filter((file) => file.toLowerCase().endsWith(".pdf"))
    .map(describeCatalog)
    .sort((a, b) => a.brand.localeCompare(b.brand) || a.label.localeCompare(b.label));
}

export default function Catalog() {
  const catalogs = getCatalogs();

  return (
    <section className="catalog-section" id="catalog" aria-labelledby="catalog-title">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Shop by brand</p>
          <h2 id="catalog-title">Brand catalogs.<br /><span>Ideas for every project.</span></h2>
        </div>
        <span className="catalog-count"><strong>{catalogs.length}</strong> catalogs</span>
      </div>

      <p className="catalog-intro">
        Flip through each catalog one page at a time. Tap a page to zoom in for full detail.
      </p>

      <CatalogBrowser catalogs={catalogs} />
    </section>
  );
}
