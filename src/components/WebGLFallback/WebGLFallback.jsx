import styles from "./WebGLFallback.module.css";

export default function WebGLFallback() {
  return (
    <div className={styles.fallback} role="img" aria-label="Abstract kitchen and bathroom renovation composition">
      <span className={styles.blockA} />
      <span className={styles.blockB} />
      <span className={styles.blockC} />
      <span className={styles.blockD} />
    </div>
  );
}
