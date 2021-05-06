import ProgressBar from "react-bootstrap/ProgressBar";

function TripCapacity({ teamSize, reservations }) {
  const totalTeamSize = { ONE_THREE: 3, FOUR_SIX: 6 }[teamSize];
  return teamSize === "ANY" ? (
    "Unlimited number of participants"
  ) : (
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
