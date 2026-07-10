import { useEffect, useState } from "react";
import { useEscapeKey } from "../../hooks/useEscapeKey.js";
import { useScrollLock } from "../../hooks/useScrollLock.js";
import styles from "./Header.module.css";

const links = [
  ["Expertise", "#expertise"],
  // ["Studio", "#studio"],
  // ["Explorer", "#explorer"],
  ["Process", "#process"],
  ["Portfolio", "#portfolio"],
  ["About", "#about"],
  ["Contact", "#contact"]
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEscapeKey(open, () => setOpen(false));
  useScrollLock(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`${styles.header} ${scrolled || open ? styles.solid : ""}`}>
      <a className={styles.wordmark} href="#top" aria-label="Blue Block Builds home">
        <span aria-hidden="true">BB</span>
        <strong>Blue Block Builds</strong>
      </a>
      <button
        className={styles.menuButton}
        type="button"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      <nav id="site-nav" className={`${styles.nav} ${open ? styles.open : ""}`} aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={close}>{label}</a>
        ))}
        <a className={styles.cta} href="#contact" onClick={close}>Request an Estimate</a>
      </nav>
    </header>
  );
}
