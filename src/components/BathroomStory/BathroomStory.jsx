import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./BathroomStory.module.css";

export default function BathroomStory() {
  return (
    <section className={`${styles.section} surface-band`} id="bathroom">
      <div className="section-shell">
        <div className={styles.copy}>
          <SectionHeading
            eyebrow="Bathroom showcase"
            title="Bathrooms built for the quieter moments."
            body="We bring together proportion, lighting, fixtures, surfaces, and storage to create bathrooms that feel calm and work beautifully."
          />
        </div>
      </div>
    </section>
  );
}
