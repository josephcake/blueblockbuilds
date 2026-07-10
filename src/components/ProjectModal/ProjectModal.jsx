import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey } from "../../hooks/useEscapeKey.js";
import { useFocusTrap } from "../../hooks/useFocusTrap.js";
import { useScrollLock } from "../../hooks/useScrollLock.js";
import styles from "./ProjectModal.module.css";

export default function ProjectModal({ project, projects, onClose, onSelect, returnFocusRef }) {
  const dialogRef = useRef(null);
  const active = Boolean(project);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  useEscapeKey(active, onClose);
  useFocusTrap(dialogRef, active);
  useScrollLock(active);

  useEffect(() => {
    if (!active) return undefined;
    const returnTarget = returnFocusRef.current;
    return () => returnTarget?.focus();
  }, [active, returnFocusRef]);

  const images = useMemo(() => {
    if (!project) return [];
    const cover = project.coverImage ? [{ src: project.coverImage, alt: `${project.title} main finished project view` }] : [];
    const gallery = project.gallery
      .filter((item) => typeof item !== "string")
      .map((item) => ({ src: item.src, alt: item.alt }));
    return [...cover, ...gallery];
  }, [project]);
  const activeImage = images[activeImageIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!project) return;
    setActiveImageIndex(0);
  }, [project]);

  useEffect(() => {
    if (!active || !hasMultipleImages) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveImageIndex((current) => (current - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveImageIndex((current) => (current + 1) % images.length);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, hasMultipleImages, images.length]);

  const showPreviousImage = () => {
    setActiveImageIndex((current) => (current - 1 + images.length) % images.length);
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % images.length);
  };

  if (!project) return null;

  const index = projects.findIndex((item) => item.id === project.id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return createPortal(
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={dialogRef}
      >
        <button
          className={styles.close}
          type="button"
          onPointerDown={(event) => {
            event.preventDefault();
            onClose();
          }}
          onClick={onClose}
          aria-label="Close project details"
        >
          Close
        </button>
        <div className={styles.viewer}>
          {activeImage ? (
            <img className={styles.heroImage} src={activeImage.src} alt={activeImage.alt} />
          ) : (
            <div className={styles.heroImage} role="img" aria-label={`${project.title} main image placeholder`} />
          )}
          {hasMultipleImages && (
            <div className={styles.imageControls} aria-label="Project image controls">
              <button type="button" onClick={showPreviousImage} aria-label="Previous project image">←</button>
              <span>{activeImageIndex + 1} / {images.length}</span>
              <button type="button" onClick={showNextImage} aria-label="Next project image">→</button>
            </div>
          )}
        </div>
        <div className={styles.content}>
          <p className="eyebrow">{project.category} / {project.location} / {project.year}</p>
          <h2 id="project-modal-title">{project.title}</h2>
          <p>{project.description}</p>
          <h3>Scope</h3>
          <ul>
            {project.scope.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {images.length > 0 && (
            <>
              <h3>Gallery</h3>
              <div className={styles.gallery} aria-label="Project image thumbnails">
                {images.map((item, imageIndex) => (
                  <button
                    key={item.src}
                    type="button"
                    className={activeImageIndex === imageIndex ? styles.selectedThumb : ""}
                    onClick={() => setActiveImageIndex(imageIndex)}
                    aria-label={`View image ${imageIndex + 1} of ${images.length}`}
                    aria-current={activeImageIndex === imageIndex ? "true" : undefined}
                  >
                    <img src={item.src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </>
          )}
          <div className={styles.controls}>
            <button type="button" onClick={() => onSelect(prev)}>{prev.title}</button>
            <button type="button" onClick={() => onSelect(next)}>{next.title}</button>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}
