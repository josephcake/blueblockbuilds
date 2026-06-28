import { processSteps } from "../../data/site.js";
import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./Process.module.css";

export default function Process() {
  return (
    <section id="process" className={styles.section}>
      <div className="section-shell">
        <SectionHeading eyebrow="Process" title="Clear from first call to final walkthrough." />
        <ol className={styles.steps}>
          {processSteps.map(([number, title, body]) => (
            <li key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
