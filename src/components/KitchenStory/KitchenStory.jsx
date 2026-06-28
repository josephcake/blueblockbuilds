import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./KitchenStory.module.css";

const features = ["Purposeful layouts", "Durable materials", "Refined finishes", "Thoughtful storage"];

export default function KitchenStory() {
  return (
    <section className={styles.section} id="kitchen">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Kitchen showcase"
          title="The kitchen, reconsidered."
          body="From the cabinet layout to the final fixture, we shape kitchens around how the home is actually used."
        />
        <ul className={styles.features}>
          {features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
      </div>
    </section>
  );
}
