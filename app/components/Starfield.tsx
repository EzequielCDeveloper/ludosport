import styles from "@/app/styles/starfield.module.css";

type Props = {
  /** Override styles (default: position: fixed; inset: 0; z-index: -1 from CSS) */
  style?: React.CSSProperties;
};

export default function Starfield({ style }: Props) {
  return (
    <div className={styles.stars} style={style} aria-hidden="true">
      <span className={styles.stars__large} />
    </div>
  );
}
