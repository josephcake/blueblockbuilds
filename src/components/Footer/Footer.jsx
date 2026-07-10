import { contactDetails, serviceAreas } from "../../data/site.js";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="section-shell">
        <div className={styles.grid}>
          <div>
            <h2>Blue Block Builds</h2>
            <p>Kitchen, bathroom, and interior renovations throughout the greater Seattle area.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#expertise">Expertise</a>
            <a href="#studio">Studio</a>
            <a href="#process">Process</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <div>
            <strong>Services</strong>
            <p>Kitchen renovations, bathroom renovations, open-concept remodels, cabinetry, fixtures, finish work.</p>
          </div>
          <div>
            <strong>Contact placeholders</strong>
            <p>{contactDetails.phone}<br />{contactDetails.email}<br />{contactDetails.instagram}<br />{contactDetails.contractorRegistration}</p>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>Service area: {serviceAreas.join(", ")}</span>
          <span>© {new Date().getFullYear()} Blue Block Builds</span>
          <a href={contactDetails.privacyUrl}>Privacy placeholder</a>
        </div>
      </div>
    </footer>
  );
}
