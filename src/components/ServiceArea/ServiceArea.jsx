import { serviceAreas } from "../../data/site.js";
import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./ServiceArea.module.css";

export default function ServiceArea() {
  return (
    <section className={styles.section}>
      <div className="section-shell">
        <SectionHeading eyebrow="Service area" title="Greater Seattle renovation work." />
        <div className={styles.area}>
          {serviceAreas.map((area) => <span key={area}>{area}</span>)}
        </div>
      </div>
    </section>
  );
}
