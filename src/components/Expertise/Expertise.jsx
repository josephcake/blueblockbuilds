import { services } from "../../data/services.js";
import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./Expertise.module.css";

export default function Expertise() {
  return (
    <section id="expertise" className={`${styles.section} surface-band`}>
      <div className="section-shell">
        <div className={styles.header}>
          <SectionHeading eyebrow="Expertise" title="Focused renovation work, clearly scoped." />
          <p>
            Kitchens, bathrooms, cabinetry, and interior upgrades handled with practical planning,
            clean sequencing, and a finish-first eye.
          </p>
        </div>
        <div className={styles.grid}>
          <ol className={styles.list}>
            {services.map((service) => (
              <li key={service.name} className={styles.service}>
                <span>{service.number}</span>
                <div>
                  <strong>{service.name}</strong>
                  <em>{service.description}</em>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
