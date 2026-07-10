import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import { services } from "../../data/services.js";
import styles from "./InteractiveStudio.module.css";

const moments = [
  {
    label: "Kitchen Systems",
    text: "Cabinetry, countertop, faucet, lighting, and storage decisions are treated as one working composition."
  },
  {
    label: "Bathroom Systems",
    text: "Bathing, vanity, tile, fixtures, and storage are balanced for calm proportion and daily use."
  },
  {
    label: "Interior Flow",
    text: "Open rooms, sightlines, finish work, and material transitions are planned before the build starts."
  }
];

export default function InteractiveStudio() {
  return (
    <section id="studio" className={`${styles.section} surface-band`}>
      <div className="section-shell">
        <div className={styles.layout}>
          <SectionHeading
            eyebrow="Interactive studio"
            title="No stock gallery. Just the way the work comes together."
            body="Blue Block Builds uses the site experience to show how kitchens, bathrooms, cabinetry, surfaces, and fixtures relate as a complete renovation system."
          />
          <div className={styles.panel} aria-label="Renovation focus areas">
            {moments.map((moment) => (
              <article key={moment.label}>
                <span>{moment.label}</span>
                <p>{moment.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.serviceStrip} aria-label="Service capabilities">
          {services.map((service) => (
            <span key={service.name}>{service.name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
