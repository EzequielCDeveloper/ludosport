import styles from "@/app/styles/starfield.module.css";

export default function Starfield() {
  return (
    <div className={styles.stars} aria-hidden="true">
      <span className={styles.stars__large} />
    </div>
  );
}
