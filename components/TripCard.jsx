import Cycling from "components/icons/Cycling";
import Driving from "components/icons/Driving";
import Female from "components/icons/Female";
import Male from "components/icons/Male";
import Trekking from "components/icons/Trekking";
import Link from "next/link";
import Card from "react-bootstrap/Card";

// { trip } in this case is actually {trip: trip} = props
function TripCard({ trip, children }) {
  return (
    <Card className="mb-2">
      <Card.Header className="d-flex justify-content-between">
        <div>
          <Link href={`/trip?id=${trip.id}`}>
            <a>{trip.title}</a>
          </Link>
        </div>
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
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}

export default TripCard;
