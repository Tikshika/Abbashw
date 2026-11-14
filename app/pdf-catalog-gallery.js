"use client";

import { useEffect, useRef, useState } from "react";

const workerUrl = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

function PdfPageCanvas({ pdf, pageNumber, variant }) {
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
      setRenderState("loading");

      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d", { alpha: false });
        if (!canvas || !context) {
          setRenderState("error");
          return;
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const outputScale = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
        const isSlide = variant === "slide";
        const padding = variant === "thumbnail" ? 8 : 0;
        const fitScale = Math.min(
          (frameSize.width - padding) / baseViewport.width,
          (frameSize.height - padding) / baseViewport.height
        );
        const scale = isSlide ? 1 : fitScale;
        const viewport = page.getViewport({ scale });

        canvas.width = Math.ceil((isSlide ? frameSize.width : viewport.width) * outputScale);
        canvas.height = Math.ceil((isSlide ? frameSize.height : viewport.height) * outputScale);
        canvas.style.width = `${isSlide ? frameSize.width : viewport.width}px`;
        canvas.style.height = `${isSlide ? frameSize.height : viewport.height}px`;
        context.fillStyle = isSlide ? "#e4eaee" : "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const slideOffsetX = (frameSize.width - baseViewport.width * fitScale) / 2;
        const slideOffsetY = (frameSize.height - baseViewport.height * fitScale) / 2;
        if (isSlide) {
          context.shadowColor = "rgba(17, 40, 67, 0.18)";
          context.shadowBlur = 12 * outputScale;
          context.shadowOffsetY = 3 * outputScale;
          context.fillStyle = "#ffffff";
          context.fillRect(
            slideOffsetX * outputScale,
            slideOffsetY * outputScale,
            baseViewport.width * fitScale * outputScale,
            baseViewport.height * fitScale * outputScale
          );
          context.shadowColor = "transparent";
          context.shadowBlur = 0;
          context.shadowOffsetY = 0;
        }

        renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform: isSlide
            ? [
                fitScale * outputScale,
                0,
                0,
                fitScale * outputScale,
                slideOffsetX * outputScale,
                slideOffsetY * outputScale
              ]
            : outputScale === 1
              ? null
              : [outputScale, 0, 0, outputScale, 0, 0]
        });
        await renderTask.promise;

        if (!cancelled) setRenderState("loaded");
      } catch {
        if (!cancelled) setRenderState("error");
      }
    }

    renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [frameSize, pageNumber, pdf, variant]);

  return (
    <div
      className={`pdf-page-frame${variant === "thumbnail" ? " is-thumbnail" : ""}${variant === "slide" ? " is-slide" : ""}`}
      ref={frameRef}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Catalog page ${pageNumber}`}
      />
      {renderState === "loading" && <span className="pdf-page-status">Rendering page…</span>}
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

export default function PdfCatalogGallery({ brand, file }) {
  const galleryRef = useRef(null);
  const trackRef = useRef(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loadState, setLoadState] = useState("idle");
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState("");

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
        loadingTask = pdfjs.getDocument({ url: `/catalogs/${file}` });
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
    setPageNumber(Math.max(1, Math.min(nextPage, pageCount)));
  }

  function handleGalleryKeyDown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPage(pageNumber - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showPage(pageNumber + 1);
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
    >
      <div className="pdf-slide">
        <span className="pdf-gallery-brand">{brand}</span>
        {loadState === "loaded" && pdf ? (
          <PdfPageCanvas pdf={pdf} pageNumber={pageNumber} variant="slide" />
        ) : loadState === "error" ? (
          <div className="pdf-gallery-message" role="alert">
            <p>This catalog couldn’t be loaded: {loadError}</p>
            <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
              Try again
            </button>
          </div>
        ) : (
          <p className="pdf-gallery-message" aria-live="polite">
            {loadState === "loading"
              ? `Loading catalog${loadProgress ? ` · ${loadProgress}%` : "…"}`
              : "Catalog pages load as you browse."}
          </p>
        )}
      </div>

      {loadState === "loaded" && pdf && (
        <div className="pdf-gallery-controls">
          <button
            className="pdf-page-arrow"
            type="button"
            aria-label="Previous page"
            disabled={pageNumber <= 1}
            onClick={() => showPage(pageNumber - 1)}
          >
            ←
          </button>
          <span className="pdf-page-count" aria-live="polite">
            Page <strong>{pageNumber}</strong> of {pageCount}
          </span>
          <button
            className="pdf-page-arrow"
            type="button"
            aria-label="Next page"
            disabled={pageNumber >= pageCount}
            onClick={() => showPage(pageNumber + 1)}
          >
            →
          </button>
        </div>
      )}

      {loadState === "loaded" && pdf && (
        <div className="pdf-thumbnail-track" ref={trackRef} aria-label="Catalog page thumbnails">
          {Array.from({ length: pageCount }, (_, index) => {
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
