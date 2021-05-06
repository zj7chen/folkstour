import styles from "./Avatar.module.css";

function Avatar({ hash }) {
  return (
    <img
      className={styles.image}
      src={hash ? `/api/image?hash=${hash}` : "/avatar_placeholder.png"}
    />
  );
}

export default Avatar;
