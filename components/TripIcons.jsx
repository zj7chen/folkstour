import Cycling from "components/icons/Cycling";
import Driving from "components/icons/Driving";
import Female from "components/icons/Female";
import Male from "components/icons/Male";
import Trekking from "components/icons/Trekking";

function TripIcons({ trip }) {
  return (
    <div className="d-flex">
      <ul className="horizontal-group group-size-text mr-4">
        {(trip.genderRequirement === "ANY" ||
          trip.genderRequirement === "MALE") && (
          <li className="male">
            <Male />
          </li>
        )}
        {(trip.genderRequirement === "ANY" ||
          trip.genderRequirement === "FEMALE") && (
          <li className="female">
            <Female />
          </li>
        )}
      </ul>
      <ul className="horizontal-group group-size-text">
        {trip.transports.map((transport) => {
          const Transport = {
            DRIVING: Driving,
            TREKKING: Trekking,
            CYCLING: Cycling,
          }[transport];
          return (
            <li key={transport}>
              <Transport />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TripIcons;
