import ProgressBar from "react-bootstrap/ProgressBar";
import { TEAM_SIZES } from "client/choices";

function TripCapacity({ teamSize, numParticipants }) {
  const totalTeamSize = TEAM_SIZES[teamSize].limit;
  return (
    <ProgressBar
      striped
      variant={
        numParticipants === totalTeamSize
          ? "danger"
          : numParticipants > totalTeamSize / 2
          ? "warning"
          : "success"
      }
      now={(numParticipants / totalTeamSize) * 100}
      label={`${numParticipants} / ${totalTeamSize}`}
    />
  );
}

export default TripCapacity;
