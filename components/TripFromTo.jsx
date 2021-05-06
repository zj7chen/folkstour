import { displayLocation } from "client/display";
import styles from "./TripFromTo.module.css";
import { displayDate } from "client/display";

function TripFromTo({
  startLocation,
  endLocation,
  startDate,
  endDate,
  length,
}) {
  return (
    <div className={styles.root}>
      <div>
        <div>{displayLocation(startLocation)}</div>
        <div>Start date: {displayDate(startDate)}</div>
      </div>
      {length > 2 && (
        <>
          <span className={styles.separator}>⇀</span>
          <span className={styles.elided}>
            {length - 2} {length === 3 ? "stop" : "stops"}
          </span>
        </>
      )}
      <span className={styles.separator}>⇀</span>
      <div>
        <div>{displayLocation(endLocation)}</div>
        <div>End date: {displayDate(endDate)}</div>
      </div>
    </div>
  );
}

export default TripFromTo;
