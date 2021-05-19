import styles from "./Timeline.module.css";

export function Timeline({ children }) {
  return <div>{children}</div>;
}

export function TimelineItem({ date, children }) {
  return (
    <div className={styles.row}>
      <div className={styles.date}>{date}</div>
      <div className={styles.line} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
