import styles from "./SectionHeading.module.css";

export default function SectionHeading({ eyebrow, title, body }) {
  return (
    <div className={styles.heading}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}
