import { useCallback, useEffect, useRef, useState } from "react";
import { portfolioPhotos } from "../../data/portfolio.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./Portfolio.module.css";

function getActiveIndex(track) {
  const trackCenter = track.scrollLeft + track.clientWidth / 2;
  let closest = 0;
  let minDistance = Infinity;

  [...track.children].forEach((child, index) => {
    const childCenter = child.offsetLeft + child.offsetWidth / 2;
    const distance = Math.abs(trackCenter - childCenter);
    if (distance < minDistance) {
      minDistance = distance;
      closest = index;
    }
  });

  return closest;
}

export default function Portfolio() {
  const trackRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const total = portfolioPhotos.length;

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setActiveIndex(getActiveIndex(track));
  }, []);

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index];
    if (!slide) return;

    slide.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest"
    });
  }, [reducedMotion]);

  const goTo = useCallback((direction) => {
    const nextIndex = (activeIndex + direction + total) % total;
    scrollToIndex(nextIndex);
  }, [activeIndex, scrollToIndex, total]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    updateActiveIndex();

    const onScroll = () => updateActiveIndex();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo]);

  const onPointerDown = (event) => {
    const track = trackRef.current;
    if (
      !track ||
      event.button !== 0 ||
      event.pointerType === "touch"
    ) {
      return;
    }

    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: track.scrollLeft
    };
    track.setPointerCapture(event.pointerId);
    track.classList.add(styles.dragging);
  };

  const onPointerMove = (event) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (
      !track ||
      !drag.active ||
      event.pointerType === "touch"
    ) {
      return;
    }

    const delta = event.clientX - drag.startX;
    track.scrollLeft = drag.scrollLeft - delta;
  };

  const endDrag = (event) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag.active) return;

    drag.active = false;
    track.classList.remove(styles.dragging);
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    updateActiveIndex();
  };

  const progress = total > 1 ? ((activeIndex + 1) / total) * 100 : 100;

  return (
    <section id="portfolio" className={`${styles.section} surface-band`} aria-label="Portfolio gallery">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Portfolio"
          title="Recent work, in motion."
          body="A rolling look at kitchens, bathrooms, and interior renovations across the greater Seattle area."
        />
      </div>

      <div className={styles.carousel}>
        <div className={styles.edgeFade} aria-hidden="true" />

        <button
          className={`${styles.navButton} ${styles.navPrev}`}
          type="button"
          aria-label="Previous photo"
          onClick={() => goTo(-1)}
        >
          <span aria-hidden="true" />
        </button>

        <button
          className={`${styles.navButton} ${styles.navNext}`}
          type="button"
          aria-label="Next photo"
          onClick={() => goTo(1)}
        >
          <span aria-hidden="true" />
        </button>

        <div
          ref={trackRef}
          className={styles.track}
          role="region"
          aria-roledescription="carousel"
          aria-label="Project photos"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {portfolioPhotos.map((photo, index) => (
            <figure
              key={photo.id}
              className={`${styles.slide} ${index === activeIndex ? styles.slideActive : ""}`}
              aria-hidden={index !== activeIndex}
            >
              <div className={styles.frame}>
                {photo.src ? (
                  <img
                    className={styles.media}
                    src={photo.src}
                    alt={photo.alt}
                    loading={index <= 1 ? "eager" : "lazy"}
                    draggable="false"
                  />
                ) : (
                  <div className={styles.placeholder} aria-label={photo.alt}>
                    <span>{photo.alt}</span>
                    <small>Photo coming soon</small>
                  </div>
                )}
              </div>
              {photo.caption ? <figcaption className={styles.caption}>{photo.caption}</figcaption> : null}
            </figure>
          ))}
        </div>

        <div className={styles.meta}>
          <p className={styles.counter} aria-live="polite">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <em aria-hidden="true">/</em>
            <span>{String(total).padStart(2, "0")}</span>
          </p>
          <div className={styles.progress} aria-hidden="true">
            <span className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
