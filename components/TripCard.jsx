import Link from "next/link";
import Card from "react-bootstrap/Card";
import TripIcons from "./TripIcons";

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
        <TripIcons trip={trip} />
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}

export default TripCard;
