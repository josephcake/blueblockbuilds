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
            body="The bathroom scene brings the freestanding bathtub and toilet into focus with calm proportions, controlled lighting, and fixture movement."
          />
        </div>
      </div>
    </section>
  );
}
