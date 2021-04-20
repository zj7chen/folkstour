import ProgressBar from "react-bootstrap/ProgressBar";

function TripCapacity({ teamSize, reservations }) {
  const totalTeamSize = { ONE_THREE: 3, FOUR_SIX: 6 }[teamSize];
  return teamSize === "ANY" ? (
    "Any"
  ) : (
    <ProgressBar
      striped
      variant="success"
      now={(reservations / totalTeamSize) * 100}
      label={`${reservations} / ${totalTeamSize}`}
    />
  );
}

export default TripCapacity;
