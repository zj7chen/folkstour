import ProgressBar from "react-bootstrap/ProgressBar";
import { TEAM_SIZES } from "client/choices";

function TripCapacity({ teamSize, reservations }) {
  const totalTeamSize = TEAM_SIZES[teamSize].limit;
  return (
    <ProgressBar
      striped
      variant={
        reservations === totalTeamSize
          ? "danger"
          : reservations > totalTeamSize / 2
          ? "warning"
          : "success"
      }
      now={(reservations / totalTeamSize) * 100}
      label={`${reservations} / ${totalTeamSize}`}
    />
  );
}

export default TripCapacity;
