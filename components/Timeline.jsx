import styles from "./Timeline.module.css";

export function Timeline({ children }) {
  return <div>{children}</div>;
}

export function TimelineItem({ children }) {
  return (
    <div className={styles.row}>
      <div className={styles.date}>Feb 4</div>
      <div className={styles.line} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
