import { displayLocation } from "client/display";
import styles from "./LocationOverview.module.css";

function LocationOverview({ start, end, length }) {
  return (
    <div className={styles.root}>
      <div>{displayLocation(start)}</div>
      {length > 1 && (
        <>
          {length > 2 && (
            <>
              <span className={styles.separator}>⇀</span>
              <span className={styles.elided}>
                {length - 2} {length === 3 ? "stop" : "stops"}
              </span>
            </>
          )}
          <span className={styles.separator}>⇀</span>
          <div>{displayLocation(end)}</div>
        </>
      )}
    </div>
  );
}

export default LocationOverview;
