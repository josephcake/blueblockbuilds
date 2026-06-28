import { useState } from "react";
import { services } from "../../data/services.js";
import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./Expertise.module.css";

export default function Expertise() {
  const [active, setActive] = useState(0);

  return (
    <section id="expertise" className={`${styles.section} surface-band`}>
      <div className="section-shell">
        <SectionHeading eyebrow="Expertise" title="Renovation work with a clear point of view." />
        <div className={styles.grid}>
          <div className={styles.list}>
            {services.map((service, index) => (
              <button
                key={service.name}
                className={`${styles.service} ${active === index ? styles.active : ""}`}
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <span>{service.number}</span>
                <strong>{service.name}</strong>
                <em>{service.description}</em>
              </button>
            ))}
          </div>
          <aside className={styles.cue} aria-live="polite">
            <span>{services[active].cue}</span>
            <p>{services[active].description}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
