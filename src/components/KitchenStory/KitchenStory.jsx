import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import styles from "./KitchenStory.module.css";

const features = ["Cabinet choreography", "Water and fixture detail", "Stone surfaces", "Storage in motion"];

export default function KitchenStory() {
  return (
    <section className={styles.section} id="kitchen">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Kitchen showcase"
          title="The kitchen, reconsidered."
          body="Cabinetry, sink, faucet, stone, and lighting move forward as a composed build system, showing how craft turns daily routines into a better room."
        />
        <ul className={styles.features}>
          {features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
      </div>
    </section>
  );
}
