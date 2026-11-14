import PdfCatalogGallery from "./pdf-catalog-gallery";

const catalogs = [
  {
    brand: "Hettich",
    file: "hittich.pdf"
  },
  {
    brand: "Manish",
    file: "Manish.pdf"
  },
  {
    brand: "Taymor",
    file: "Taymor.pdf"
  }
];

export default function Catalog() {
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
        View each page at full viewer width, use the thumbnails to jump between pages, or open the full PDF.
      </p>

      <div className="catalog-list" aria-label="Brand catalogs">
        {catalogs.map((catalog) => {
          return (
            <article className="catalog-row" key={catalog.file}>
              <PdfCatalogGallery brand={catalog.brand} file={catalog.file} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
