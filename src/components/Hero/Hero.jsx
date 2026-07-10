import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className="section-shell">
        <div className={styles.copy}>
          <p className="eyebrow">Seattle-Area Kitchen & Bathroom Renovations</p>
          <h1>We build spaces worth living in.</h1>
          <p>
            Blue Block Builds creates thoughtful kitchens, refined bathrooms, and carefully crafted interiors throughout the greater Seattle area.
          </p>
          <div className={styles.actions}>
            <a href="#contact">Start Your Project</a>
            <a href="#studio">Explore the Studio</a>
          </div>
        </div>
      </div>
      <div className={styles.nextHint} aria-hidden="true">Expertise</div>
    </section>
  );
}
