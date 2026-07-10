import { useEffect, useRef } from "react";
import { useEscapeKey } from "../../hooks/useEscapeKey.js";
import { useFocusTrap } from "../../hooks/useFocusTrap.js";
import { useScrollLock } from "../../hooks/useScrollLock.js";
import styles from "./ProjectModal.module.css";

export default function ProjectModal({ project, projects, onClose, onSelect, returnFocusRef }) {
  const dialogRef = useRef(null);
  const active = Boolean(project);
  useEscapeKey(active, onClose);
  useFocusTrap(dialogRef, active);
  useScrollLock(active);

  useEffect(() => {
    if (!active) return undefined;
    const returnTarget = returnFocusRef.current;
    return () => returnTarget?.focus();
  }, [active, returnFocusRef]);

  if (!project) return null;

  const index = projects.findIndex((item) => item.id === project.id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <div className={styles.backdrop} role="presentation">
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={dialogRef}
      >
        <button className={styles.close} type="button" onClick={onClose}>Close</button>
        {project.coverImage ? (
          <img className={styles.heroImage} src={project.coverImage} alt={`${project.title} main finished project view`} />
        ) : (
          <div className={styles.heroImage} role="img" aria-label={`${project.title} main image placeholder`} />
        )}
        <div className={styles.content}>
          <p className="eyebrow">{project.category} / {project.location} / {project.year}</p>
          <h2 id="project-modal-title">{project.title}</h2>
          <p>{project.description}</p>
          <h3>Scope</h3>
          <ul>
            {project.scope.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h3>Gallery</h3>
          <div className={styles.gallery}>
            {project.gallery.map((item) => (
              typeof item === "string" ? (
                <span key={item}>{item}</span>
              ) : (
                <img key={item.src} src={item.src} alt={item.alt} loading="lazy" />
              )
            ))}
          </div>
          <div className={styles.controls}>
            <button type="button" onClick={() => onSelect(prev)}>{prev.title}</button>
            <button type="button" onClick={() => onSelect(next)}>{next.title}</button>
          </div>
        </div>
      </section>
    </div>
  );
}
