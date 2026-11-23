"use client";

import { useMemo, useState } from "react";
import PdfCatalogGallery from "./pdf-catalog-gallery";

export default function CatalogBrowser({ catalogs }) {
  const [query, setQuery] = useState("");
  const [activeBrand, setActiveBrand] = useState("All");

  const brands = useMemo(() => [...new Set(catalogs.map((catalog) => catalog.brand))], [catalogs]);

  const visible = catalogs.filter((catalog) => {
    if (activeBrand !== "All" && catalog.brand !== activeBrand) return false;
    const text = `${catalog.brand} ${catalog.label}`.toLowerCase();
    return text.includes(query.trim().toLowerCase());
  });

  return (
    <>
      <div className="catalog-toolbar">
        <input
          className="catalog-search"
          type="search"
          placeholder="Search catalogs or brands"
          aria-label="Search catalogs"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="catalog-brand-buttons" role="group" aria-label="Filter by brand">
          {["All", ...brands].map((brand) => (
            <button
              key={brand}
              type="button"
              className={`catalog-brand-button${activeBrand === brand ? " is-active" : ""}`}
              aria-pressed={activeBrand === brand}
              onClick={() => setActiveBrand(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-list" aria-label="Brand catalogs">
        {visible.length === 0 && <p className="pdf-gallery-message">No catalogs match your search.</p>}
        {visible.map((catalog) => (
          <article className="catalog-row" key={catalog.file}>
            <PdfCatalogGallery brand={catalog.brand} label={catalog.label} file={catalog.file} />
          </article>
        ))}
      </div>
    </>
  );
}
