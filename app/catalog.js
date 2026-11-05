"use client";

import { useMemo, useState } from "react";

const products = [
  { name: "Soft-Close Drawer Channel", brand: "Ebco", category: "Kitchen fittings", type: "drawer", description: "Smooth, quiet motion for everyday kitchen storage." },
  { name: "Hydraulic Lift-Up Stay", brand: "Ebco", category: "Kitchen fittings", type: "cabinet", description: "Convenient lift-up support for overhead cabinet doors." },
  { name: "Pull-Out Bottle Basket", brand: "Sleek", category: "Kitchen fittings", type: "basket", description: "Make narrow cabinet spaces easier to reach." },
  { name: "Corner Carousel Unit", brand: "Sleek", category: "Kitchen fittings", type: "carousel", description: "Bring hard-to-reach corner storage within easy reach." },
  { name: "Soft-Close Cabinet Hinge", brand: "Häfele", category: "Kitchen fittings", type: "hinge", description: "A clean, controlled close for cabinet doors." },
  { name: "Tall Pantry Pull-Out", brand: "Häfele", category: "Kitchen fittings", type: "pantry", description: "Organized pull-out storage for pantry essentials." },
  { name: "Cabinet Handle", brand: "Ozone", category: "Kitchen fittings", type: "handle", description: "A simple finishing touch for kitchen cabinetry." },
  { name: "Modular Drawer Organizer", brand: "Quba", category: "Kitchen fittings", type: "drawer", description: "Keep kitchen drawers neat and easy to use." },
  { name: "Europa Smart Lock", brand: "Europa", category: "Door hardware", type: "smart-lock", description: "A contemporary smart-lock option for your entrance." },
  { name: "Mortise Door Lock", brand: "Europa", category: "Door hardware", type: "lock", description: "A dependable locking solution for interior doors." },
  { name: "Digital Door Lock", brand: "Ozone", category: "Door hardware", type: "smart-lock", description: "Keyless access with a modern door finish." },
  { name: "Stainless Steel Door Handle", brand: "Dorset", category: "Door hardware", type: "handle", description: "A durable handle with a clean, modern profile." },
  { name: "Door Handle Set", brand: "Quba", category: "Door hardware", type: "handle", description: "A coordinated handle set for a refreshed doorway." },
  { name: "Door Stopper", brand: "Habo", category: "Door hardware", type: "doorstop", description: "A compact finishing accessory for everyday use." },
  { name: "Faber Sink Part 1", brand: "Faber", category: "Sinks & faucets", type: "sink", description: "Kitchen sink component shown in the shared catalog." },
  { name: "Faber Sink Part 2", brand: "Faber", category: "Sinks & faucets", type: "sink", description: "Kitchen sink component shown in the shared catalog." },
  { name: "Stainless Steel Kitchen Sink", brand: "Faber", category: "Sinks & faucets", type: "sink", description: "A practical sink option for a hardworking kitchen." },
  { name: "Sink Mixer Tap", brand: "Faber", category: "Sinks & faucets", type: "faucet", description: "A streamlined mixer tap for kitchen sink setups." },
  { name: "Kitchen Faucet", brand: "Faber", category: "Sinks & faucets", type: "faucet", description: "Everyday kitchen function with a considered finish." },
  { name: "Sink Waste Coupling", brand: "Faber", category: "Sinks & faucets", type: "plumbing", description: "A useful fitting for completing a sink installation." },
  { name: "Built-In Cooktop", brand: "Faber", category: "Kitchen appliances", type: "cooktop", description: "A built-in cooking surface for a fitted kitchen." },
  { name: "Kitchen Chimney Hood", brand: "Faber", category: "Kitchen appliances", type: "hood", description: "A kitchen ventilation option for your cooking area." },
  { name: "Built-In Oven", brand: "Faber", category: "Kitchen appliances", type: "oven", description: "A built-in appliance for baking and everyday cooking." },
  { name: "Glass-Top Gas Hob", brand: "Faber", category: "Kitchen appliances", type: "cooktop", description: "A sleek hob option for a modern kitchen." },
  { name: "Marine Wood Adhesive", brand: "Fevicol", category: "Adhesives & sealants", type: "adhesive", description: "An adhesive option for woodworking applications." },
  { name: "SH Wood Adhesive", brand: "Fevicol", category: "Adhesives & sealants", type: "adhesive", description: "A familiar choice for furniture and wood projects." },
  { name: "Kitchen Silicone Sealant", brand: "Sample range", category: "Adhesives & sealants", type: "sealant", description: "A finishing sealant for kitchen and utility areas." },
  { name: "Precision Screwdriver Set", brand: "Sample range", category: "Tools & fasteners", type: "tools", description: "A handy set for small repairs and detailed work." },
  { name: "Combination Plier", brand: "Sample range", category: "Tools & fasteners", type: "tools", description: "A versatile hand tool for common workshop tasks." },
  { name: "Wall Plugs & Screw Set", brand: "Sample range", category: "Tools & fasteners", type: "fasteners", description: "A practical fixing assortment for home projects." },
  { name: "Stainless Steel Fastener Kit", brand: "Sample range", category: "Tools & fasteners", type: "fasteners", description: "A selection of fasteners for general-purpose use." },
  { name: "Measuring Tape", brand: "Sample range", category: "Tools & fasteners", type: "tools", description: "A workshop essential for quick, accurate measuring." }
];

const categories = ["All products", ...new Set(products.map((product) => product.category))];
const indicativePrices = [
  780, 540, 1580, 2200, 180, 3650, 320, 890,
  4500, 1250, 8900, 760, 980, 180, 3500, 2400,
  5600, 1850, 1490, 260, 6200, 15800, 21900, 4600,
  240, 190, 320, 590, 720, 120, 380, 490
];
const pageSize = 4;

function ProductArtwork({ type }) {
  if (type === "drawer") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <path className="artwork-line" d="M56 52h108v55H56z" />
        <path className="artwork-accent" d="M67 63h86v32H67z" />
        <path className="artwork-line" d="M50 61h-9v9h9m129-9h9v9h-9M63 108v10m94-10v10" />
        <path className="artwork-detail" d="M99 77h22v5H99z" />
      </svg>
    );
  }

  if (type === "cabinet") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <path className="artwork-line" d="M59 44h102v72H59z" />
        <path className="artwork-accent" d="M68 52h84v52H68z" />
        <path className="artwork-line" d="m75 99 45-37 24 7-44 37z" />
        <circle className="artwork-detail" cx="118" cy="62" r="5" />
      </svg>
    );
  }

  if (type === "basket" || type === "pantry") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <path className="artwork-line" d="M69 43h81v72H69z" />
        <path className="artwork-accent" d="M76 51h67v26H76zm0 34h67v22H76z" />
        <path className="artwork-line" d="M83 51v26m17-26v26m17-26v26m17-26v26M83 85v22m17-22v22m17-22v22m17-22v22" />
        <path className="artwork-detail" d="M62 43h95v5H62z" />
      </svg>
    );
  }

  if (type === "carousel") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <path className="artwork-line" d="M110 38v78m-42-9h84m-75-34h66" />
        <path className="artwork-accent" d="M68 73a42 19 0 1 0 84 0 42 19 0 1 0-84 0Zm-9 34a51 18 0 1 0 102 0 51 18 0 1 0-102 0Z" />
        <circle className="artwork-detail" cx="110" cy="74" r="5" />
      </svg>
    );
  }

  if (type === "sink") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <path className="artwork-line" d="M56 48h108l-12 57H68L56 48Z" />
        <path className="artwork-accent" d="M70 60h80l-8 34H78l-8-34Z" />
        <path className="artwork-line" d="M138 45V31c0-12-19-12-19 0v9" />
        <circle className="artwork-detail" cx="110" cy="78" r="5" />
      </svg>
    );
  }

  if (type === "faucet") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <path className="artwork-line" d="M79 112h64M91 111V79c0-27 15-40 36-40h12v18h-9c-10 0-17 8-17 21v33" />
        <path className="artwork-accent" d="M126 56h32v9h-32zM87 111h46v10H87z" />
        <path className="artwork-line" d="M145 40V29h12v11" />
      </svg>
    );
  }

  if (type === "smart-lock" || type === "lock") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <rect className="artwork-line" x="83" y="52" width="54" height="70" rx="8" />
        <path className="artwork-line" d="M94 53V40a16 16 0 0 1 32 0v13" />
        <circle className="artwork-accent" cx="110" cy="83" r="8" />
        <path className="artwork-line" d="M110 91v11" />
      </svg>
    );
  }

  if (type === "cooktop" || type === "oven" || type === "hood") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <rect className="artwork-line" x="55" y="39" width="110" height="77" rx="7" />
        <rect className="artwork-accent" x="67" y="52" width="86" height="47" rx="4" />
        <circle className="artwork-detail" cx="82" cy="108" r="3" />
        <circle className="artwork-detail" cx="99" cy="108" r="3" />
        <circle className="artwork-detail" cx="116" cy="108" r="3" />
        <circle className="artwork-detail" cx="133" cy="108" r="3" />
      </svg>
    );
  }

  if (type === "adhesive" || type === "sealant") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <path className="artwork-line" d="M91 50h38l10 15v55H81V65l10-15Z" />
        <path className="artwork-accent" d="M91 50h38l5 8H86l5-8ZM85 78h50v24H85z" />
        <path className="artwork-line" d="m96 43 4-13h20l4 13" />
      </svg>
    );
  }

  if (type === "tools" || type === "fasteners") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <path className="artwork-line" d="m91 44 14 14-34 34-14-14 34-34ZM104 57l13 13-38 38-13-13M118 70l12 12-29 29-12-12" />
        <path className="artwork-accent" d="m111 38 13 13-9 9-13-13zM131 58l12 12-9 9-12-12z" />
        <path className="artwork-line" d="m58 78-8 8 14 14 8-8" />
      </svg>
    );
  }

  if (type === "handle" || type === "hinge" || type === "doorstop") {
    return (
      <svg viewBox="0 0 220 150" aria-hidden="true">
        <path className="artwork-line" d="M71 48h78v54H71z" />
        <path className="artwork-accent" d="M106 68h36v12h-36z" />
        <circle className="artwork-detail" cx="84" cy="61" r="3" />
        <circle className="artwork-detail" cx="136" cy="89" r="3" />
        <path className="artwork-line" d="M149 55h14v40h-14" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 150" aria-hidden="true">
      <rect className="artwork-line" x="55" y="49" width="110" height="59" rx="5" />
      <path className="artwork-accent" d="M70 65h80v9H70zM70 82h54v9H70z" />
      <circle className="artwork-detail" cx="147" cy="88" r="5" />
    </svg>
  );
}

export default function Catalog({ search, onSearchChange }) {
  const [activeCategory, setActiveCategory] = useState("All products");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("featured");
  const [favorites, setFavorites] = useState(() => new Set());
  const [savedProducts, setSavedProducts] = useState(() => new Set());
  const [cart, setCart] = useState(() => new Set());

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matches = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All products" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
    if (sortOrder === "name") {
      return matches.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortOrder === "price-low" || sortOrder === "price-high") {
      const direction = sortOrder === "price-low" ? 1 : -1;
      return matches.sort(
        (a, b) =>
          (indicativePrices[products.indexOf(a)] - indicativePrices[products.indexOf(b)]) *
          direction
      );
    }
    return matches;
  }, [activeCategory, search, sortOrder]);
  const pageCount = Math.ceil(filteredProducts.length / pageSize);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const firstProduct = filteredProducts.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastProduct = Math.min(currentPage * pageSize, filteredProducts.length);

  function toggleProduct(setter, current, productName) {
    const updated = new Set(current);
    if (updated.has(productName)) updated.delete(productName);
    else updated.add(productName);
    setter(updated);
  }

  function goToPage(page) {
    setCurrentPage(page);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="catalog-section" id="catalog">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Shop the collection</p>
          <h2>Everyday essentials.<br /><span>Better made.</span></h2>
        </div>
        <span className="catalog-count"><strong>{products.length}</strong> product examples</span>
      </div>

      <div className="catalog-toolbar">
        <label className="catalog-search">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.2 4.2" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              onSearchChange(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products or brands"
            aria-label="Search products or brands"
          />
        </label>
        <p className="sample-note">Sample products &amp; indicative prices</p>
      </div>

      <div className="catalog-filters" aria-label="Filter products by category">
        {categories.map((category) => (
          <button
            className={`filter-button${activeCategory === category ? " is-active" : ""}`}
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => {
              setActiveCategory(category);
              setCurrentPage(1);
            }}
          >
            {category}
            <span>{category === "All products" ? products.length : products.filter((product) => product.category === category).length}</span>
          </button>
        ))}
      </div>

      <div className="results-row">
        <p className="results-count" aria-live="polite">
          Showing <strong>{firstProduct}–{lastProduct}</strong> of {filteredProducts.length} products
        </p>
        <label className="sort-control">
          Sort by
          <select
            aria-label="Sort products"
            value={sortOrder}
            onChange={(event) => {
              setSortOrder(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => {
            const productIndex = products.indexOf(product);
            const isFavorite = favorites.has(product.name);
            const isSaved = savedProducts.has(product.name);
            const isInCart = cart.has(product.name);

            return (
            <article className="product-card" key={product.name}>
              <div className={`product-visual visual-${product.type}`} id={`product-${productIndex}`}>
                <span className="product-index">{String(productIndex + 1).padStart(2, "0")}</span>
                <ProductArtwork type={product.type} />
                <div className="product-image-actions">
                  <button
                    className={isFavorite ? "is-selected" : ""}
                    type="button"
                    aria-label={`${isFavorite ? "Remove from" : "Add to"} favorites: ${product.name}`}
                    aria-pressed={isFavorite}
                    onClick={() => toggleProduct(setFavorites, favorites, product.name)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M20.4 8.8c0 4.1-8.4 9.5-8.4 9.5S3.6 12.9 3.6 8.8A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 8.4 1.2Z" />
                    </svg>
                  </button>
                  <button
                    className={isSaved ? "is-selected" : ""}
                    type="button"
                    aria-label={`${isSaved ? "Remove saved" : "Save"} ${product.name}`}
                    aria-pressed={isSaved}
                    onClick={() => toggleProduct(setSavedProducts, savedProducts, product.name)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6.5 4.5h11v16L12 17l-5.5 3.5v-16Z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="product-info">
                <div className="product-meta">
                  <span>{product.brand}</span>
                  <span>{product.category}</span>
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-footer">
                  <strong>₹{indicativePrices[productIndex].toLocaleString("en-IN")}.00</strong>
                  <button
                    className={`shop-button${isInCart ? " is-added" : ""}`}
                    type="button"
                    onClick={() => toggleProduct(setCart, cart, product.name)}
                  >
                    {isInCart ? "Added" : "Shop Now"}
                  </button>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      ) : (
        <div className="catalog-empty">
          <span aria-hidden="true">⌕</span>
          <h3>No matching products</h3>
          <p>Try a different search or choose another category.</p>
          <button
            type="button"
            onClick={() => {
              onSearchChange("");
              setActiveCategory("All products");
              setCurrentPage(1);
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {pageCount > 1 && (
        <nav className="pagination" aria-label="Product pages">
          <button
            type="button"
            className="page-arrow"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >←</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1)
            .filter((page) => page === 1 || page === pageCount || Math.abs(page - currentPage) <= 1)
            .map((page, index, pages) => (
              <span className="page-group" key={page}>
                {index > 0 && page - pages[index - 1] > 1 && <span className="page-ellipsis">…</span>}
                <button
                  type="button"
                  className={`page-number${currentPage === page ? " is-current" : ""}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  onClick={() => goToPage(page)}
                >{page}</button>
              </span>
            ))}
          <button
            type="button"
            className="page-arrow"
            aria-label="Next page"
            disabled={currentPage === pageCount}
            onClick={() => goToPage(currentPage + 1)}
          >→</button>
        </nav>
      )}
    </section>
  );
}
