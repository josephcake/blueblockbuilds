import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project, index, onOpen }) {
  return (
    <article className={`${styles.card} ${index === 0 ? styles.featured : ""}`}>
      <button type="button" className={styles.imageButton} onClick={onOpen}>
        <span className={styles.image} role="img" aria-label={`${project.title} placeholder image`} />
        <span className={styles.open}>View project</span>
      </button>
      <div className={styles.meta}>
        <span>{String(index + 1).padStart(2, "0")} / {project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.location}</p>
        <p>{project.summary}</p>
      </div>
    </article>
  );
}
