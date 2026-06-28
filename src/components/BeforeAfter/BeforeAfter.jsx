import styles from "./BeforeAfter.module.css";

export default function BeforeAfter({ project }) {
  return (
    <div className={styles.compare} aria-label={`Before and after for ${project.title}`}>
      <figure>
        <div className={`${styles.placeholder} ${styles.before}`} role="img" aria-label={`Before view placeholder for ${project.title}`} />
        <figcaption>Before</figcaption>
      </figure>
      <figure>
        <div className={`${styles.placeholder} ${styles.after}`} role="img" aria-label={`After view placeholder for ${project.title}`} />
        <figcaption>After</figcaption>
      </figure>
    </div>
  );
}
