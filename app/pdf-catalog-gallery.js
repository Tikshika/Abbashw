"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const workerUrl = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const pageCache = new Map();
const pageCacheLimit = 12;
const pdfIds = new WeakMap();
let nextPdfId = 0;

// Renders a page into an offscreen canvas; slide/lightbox results are cached so revisits and prefetched pages show instantly.
async function renderPageBuffer(pdf, pageNumber, frameSize, variant, zoom, onTask) {
  if (!pdfIds.has(pdf)) pdfIds.set(pdf, nextPdfId++);
  const key = `${pdfIds.get(pdf)}:${pageNumber}:${variant}:${frameSize.width}x${frameSize.height}:${zoom}`;
  const cacheable = variant !== "thumbnail";
  if (cacheable && pageCache.has(key)) return pageCache.get(key);

  const page = await pdf.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const baseOutputScale = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
  const padding = variant === "thumbnail" ? 8 : 0;
  const scale =
    Math.min(
      (frameSize.width - padding) / baseViewport.width,
      (frameSize.height - padding) / baseViewport.height
    ) * zoom;
  const viewport = page.getViewport({ scale });
  const maxPixels = 24000000;
  const pixelScale = Math.sqrt(maxPixels / (viewport.width * viewport.height));
  const outputScale = Math.max(1, Math.min(baseOutputScale, pixelScale));

  const buffer = document.createElement("canvas");
  buffer.width = Math.ceil(viewport.width * outputScale);
  buffer.height = Math.ceil(viewport.height * outputScale);

  const task = page.render({
    canvas: buffer,
    canvasContext: buffer.getContext("2d", { alpha: false }),
    viewport,
    transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
    background: "#ffffff"
  });
  onTask?.(task);
  await task.promise;

  const result = { buffer, cssWidth: viewport.width, cssHeight: viewport.height };
  if (cacheable) {
    pageCache.set(key, result);
    if (pageCache.size > pageCacheLimit) pageCache.delete(pageCache.keys().next().value);
  }
  return result;
}

function PdfPageCanvas({ pdf, pageNumber, variant, zoom = 1, pageCount = 0 }) {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [renderState, setRenderState] = useState("loading");

  useEffect(() => {
    const frame = frameRef.current;
    const observedElement = variant === "slide" ? frame?.parentElement : frame;
    if (!observedElement) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setFrameSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      });
    });

    observer.observe(observedElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pdf || !frameSize.width || !frameSize.height) return undefined;

    let cancelled = false;
    let renderTask;

    async function renderPage() {
      try {
        const { buffer, cssWidth, cssHeight } = await renderPageBuffer(
          pdf, pageNumber, frameSize, variant, zoom, (task) => { renderTask = task; }
        );
        if (cancelled) return;

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d", { alpha: false });
        if (!canvas || !context) {
          setRenderState("error");
          return;
        }

        canvas.width = buffer.width;
        canvas.height = buffer.height;
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        context.drawImage(buffer, 0, 0);

        if (variant === "lightbox") {
          // Restart the fade on the same canvas so the old page stays visible until the new one is drawn.
          canvas.style.animation = "none";
          void canvas.offsetWidth;
          canvas.style.animation = "";
        }

        setRenderState("loaded");

        if (variant === "slide") {
          for (const next of [pageNumber + 1, pageNumber - 1]) {
            if (next >= 1 && next <= pageCount) {
              await renderPageBuffer(pdf, next, frameSize, variant, zoom).catch(() => {});
              if (cancelled) return;
            }
          }
        }
      } catch {
        if (!cancelled) setRenderState("error");
      }
    }

    renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [frameSize, pageNumber, pdf, variant, zoom, pageCount]);

  return (
    <div
      className={`pdf-page-frame${variant === "thumbnail" ? " is-thumbnail" : ""}${variant === "slide" ? " is-slide" : ""}${variant === "lightbox" ? " is-lightbox" : ""}${variant === "lightbox" && zoom > 1 ? " is-zoomed" : ""}${renderState === "loaded" ? " is-ready" : ""}`}
      ref={frameRef}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Catalog page ${pageNumber}`}
      />
      {renderState === "loading" && variant !== "lightbox" && <span className="pdf-page-status">Rendering page&hellip;</span>}
      {renderState === "error" && <span className="pdf-page-status">Page unavailable</span>}
    </div>
  );
}

function PdfThumbnail({ pdf, pageNumber, selectedPage, trackRef, onSelect }) {
  const buttonRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const button = buttonRef.current;
    if (!track || !button) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { root: track, rootMargin: "0px 140px", threshold: 0.01 }
    );

    observer.observe(button);
    return () => observer.disconnect();
  }, [trackRef]);

  return (
    <button
      ref={buttonRef}
      className={`pdf-thumbnail${selectedPage === pageNumber ? " is-selected" : ""}`}
      type="button"
      aria-label={`Show page ${pageNumber}`}
      aria-pressed={selectedPage === pageNumber}
      onClick={() => onSelect(pageNumber)}
    >
      {isInView && <PdfPageCanvas pdf={pdf} pageNumber={pageNumber} variant="thumbnail" />}
      <span className="pdf-thumbnail-number">{pageNumber}</span>
    </button>
  );
}

export default function PdfCatalogGallery({ brand, file, label }) {
  const pagesPerSpread = 1;
  const initialPageLimit = 5;
  const [isExpanded, setIsExpanded] = useState(false);
  const direction = useRef("next");
  const galleryRef = useRef(null);
  const trackRef = useRef(null);
  const touchStartX = useRef(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const expand = () => setIsExpanded(true);
  const [pageCount, setPageCount] = useState(0);
  const [loadState, setLoadState] = useState("idle");
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState("");
  const visibleCount = isExpanded ? pageCount : Math.min(initialPageLimit, pageCount);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return undefined;

    if (!("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsNearViewport(true);
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(gallery);
    const bounds = gallery.getBoundingClientRect();
    if (bounds.top <= window.innerHeight + 240 && bounds.bottom >= -240) {
      setIsNearViewport(true);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNearViewport) return undefined;

    let cancelled = false;
    let loadingTask;

    async function loadCatalog() {
      setLoadState("loading");
      setLoadProgress(0);
      setLoadError("");

      try {
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;

        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        loadingTask = pdfjs.getDocument({
          url: `/catalogs/${encodeURIComponent(file)}`,
          disableAutoFetch: true
        });
        loadingTask.onProgress = ({ loaded, total }) => {
          if (!cancelled && total > 0) {
            setLoadProgress(Math.round((loaded / total) * 100));
          }
        };

        const loadedPdf = await loadingTask.promise;
        if (cancelled) {
          await loadedPdf.destroy();
          return;
        }

        setPdf(loadedPdf);
        setPageCount(loadedPdf.numPages);
        setPageNumber(1);
        setLoadState("loaded");
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : String(error));
          setLoadState("error");
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
      if (loadingTask) void loadingTask.destroy();
    };
  }, [file, isNearViewport, loadAttempt]);

  useEffect(() => {
    const track = trackRef.current;
    const selectedThumbnail = track?.querySelector(".pdf-thumbnail.is-selected");
    if (!track || !selectedThumbnail) return;

    const trackBounds = track.getBoundingClientRect();
    const thumbnailBounds = selectedThumbnail.getBoundingClientRect();
    const nextScrollLeft =
      track.scrollLeft +
      thumbnailBounds.left -
      trackBounds.left -
      (track.clientWidth - thumbnailBounds.width) / 2;
    track.scrollTo({ left: nextScrollLeft, behavior: "smooth" });
  }, [loadState, pageNumber]);

  function showPage(nextPage) {
    const boundedPage = Math.max(1, Math.min(nextPage, visibleCount));
    direction.current = boundedPage >= pageNumber ? "next" : "prev";
    if (boundedPage >= initialPageLimit) setIsExpanded(true);
    setPageNumber(Math.floor((boundedPage - 1) / pagesPerSpread) * pagesPerSpread + 1);
  }

  useEffect(() => {
    if (!isZoomOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isZoomOpen]);

  function openZoom() {
    setZoom(1);
    setIsZoomOpen(true);
  }

  function changePage(nextPage) {
    setZoom(1);
    showPage(nextPage);
  }

  function handleGalleryKeyDown(event) {
    if (event.key === "Escape" && isZoomOpen) {
      setIsZoomOpen(false);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPage(pageNumber - pagesPerSpread);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
    showPage(pageNumber + pagesPerSpread);
    }
  }

  return (
    <div
      className="pdf-gallery"
      ref={galleryRef}
      role="region"
      aria-label={`${brand} catalog page gallery`}
      tabIndex={0}
      onKeyDown={handleGalleryKeyDown}
      onPointerEnter={expand}
      onTouchStart={expand}
      onFocus={expand}
    >
      <div
        className="pdf-slide"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null || !pdf) return;
          const deltaX = event.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(deltaX) > 50) showPage(pageNumber + (deltaX < 0 ? pagesPerSpread : -pagesPerSpread));
        }}
      >
        <span className="pdf-gallery-brand">{brand}{label ? <em>{label}</em> : null}</span>
        {loadState === "loaded" && pdf ? (
          <div className="pdf-spread-grid" data-direction={direction.current} aria-label={`Page ${pageNumber}`}>
            {Array.from(
              { length: Math.min(pagesPerSpread, pageCount - pageNumber + 1) },
              (_, index) => {
                const spreadPage = pageNumber + index;

                return (
                  <div
                    className="pdf-spread-page"
                    key={spreadPage}
                    role="button"
                    tabIndex={0}
                    aria-label={`Zoom page ${spreadPage}`}
                    onClick={openZoom}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openZoom();
                      }
                    }}
                  >
                    <PdfPageCanvas pdf={pdf} pageNumber={spreadPage} variant="slide" pageCount={pageCount} />
                    <span className="pdf-spread-page-number">{spreadPage}</span>
                  </div>
                );
              }
            )}
          </div>
        ) : loadState === "error" ? (
          <div className="pdf-gallery-message" role="alert">
            <p>This catalog couldn&rsquo;t be loaded: {loadError}</p>
            <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
              Try again
            </button>
          </div>
        ) : (
          <p className="pdf-gallery-message" aria-live="polite">
            {loadState === "loading"
              ? `Loading catalog${loadProgress ? ` \u00b7 ${loadProgress}%` : "\u2026"}`
              : "Catalog pages load as you browse."}
          </p>
        )}

        {loadState === "loaded" && pdf && (
          <>
            <button
              className="pdf-page-arrow is-prev"
              type="button"
              aria-label="Previous page"
              disabled={pageNumber <= 1}
              onClick={() => showPage(pageNumber - pagesPerSpread)}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button
              className="pdf-page-arrow is-next"
              type="button"
              aria-label="Next page"
              disabled={pageNumber + pagesPerSpread > visibleCount}
              onClick={() => showPage(pageNumber + pagesPerSpread)}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
            <span className="pdf-page-count" aria-live="polite">
              Page <strong>{pageNumber}</strong> of {visibleCount}
            </span>
          </>
        )}
      </div>

      {isZoomOpen && pdf && createPortal(
        <div
          className="pdf-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${brand} page ${pageNumber}`}
          onKeyDown={handleGalleryKeyDown}
        >
          <div className="pdf-lightbox-bar">
            <span className="pdf-lightbox-title">
              {brand}{label ? ` ${label}` : ""} &middot; Page {pageNumber} of {pageCount}
            </span>
            <div className="pdf-lightbox-tools">
              <button type="button" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - 0.5))}>&minus;</button>
              <span>{Math.round(zoom * 100)}%</span>
              <button type="button" aria-label="Zoom in" disabled={zoom >= 4} onClick={() => setZoom((value) => Math.min(4, value + 0.5))}>+</button>
              <button type="button" aria-label="Close zoom view" autoFocus onClick={() => setIsZoomOpen(false)}>&times;</button>
            </div>
          </div>
          <div className="pdf-lightbox-stage" onClick={() => setIsZoomOpen(false)}>
            <div className="pdf-lightbox-page">
              <PdfPageCanvas pdf={pdf} pageNumber={pageNumber} variant="lightbox" zoom={zoom} />
            </div>
          </div>
          <button className="pdf-page-arrow is-prev" type="button" aria-label="Previous page" disabled={pageNumber <= 1} onClick={() => changePage(pageNumber - pagesPerSpread)}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button className="pdf-page-arrow is-next" type="button" aria-label="Next page" disabled={pageNumber + pagesPerSpread > visibleCount} onClick={() => changePage(pageNumber + pagesPerSpread)}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>,
        document.body
      )}

      {loadState === "loaded" && pdf && (
        <div className="pdf-thumbnail-track" ref={trackRef} aria-label="Catalog page thumbnails">
          {Array.from({ length: visibleCount }, (_, index) => {
            const thumbnailPage = index + 1;

            return (
              <PdfThumbnail
                key={thumbnailPage}
                pdf={pdf}
                pageNumber={thumbnailPage}
                selectedPage={pageNumber}
                trackRef={trackRef}
                onSelect={showPage}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
