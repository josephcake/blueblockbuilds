import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen({ ready }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!ready) {
      const timeout = window.setTimeout(() => setVisible(false), 3200);
      return () => window.clearTimeout(timeout);
    }
    const timeout = window.setTimeout(() => setVisible(false), 220);
    return () => window.clearTimeout(timeout);
  }, [ready]);

  if (!visible) return null;

  return (
    <div className={`${styles.loader} ${ready ? styles.ready : ""}`} role="status" aria-live="polite">
      <div className={styles.mark} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>Blue Block Builds</p>
      <div className={styles.progress}><span /></div>
    </div>
  );
}
