import ProgressBar from "react-bootstrap/ProgressBar";

function TripCapacity({ teamSize, reservations }) {
  if (teamSize === "ANY") return "Unlimited number of participants";
  const totalTeamSize = { ONE_THREE: 3, FOUR_SIX: 6 }[teamSize];
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
