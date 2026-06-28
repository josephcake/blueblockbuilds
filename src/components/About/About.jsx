import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={`${styles.section} surface-band`}>
      <div className="section-shell">
        <div className={styles.layout}>
          <SectionHeading eyebrow="About" title="Built with care. Managed with clarity." />
          <div className={styles.copy}>
            <p>
              Blue Block Builds is a Seattle-area renovation company focused on kitchens, bathrooms, and interior transformations. We believe good contracting combines skilled work with clear expectations, careful planning, and respect for the homeowner&apos;s space.
            </p>
            <p>
              Business credentials, license information, insurance details, and verified testimonials should be added only after the owner confirms them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
