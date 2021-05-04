import Link from "next/link";
import Card from "react-bootstrap/Card";

// { trip } in this case is actually {trip: trip} = props.trip
function TripCard({ trip, children }) {
  return (
    <Card className="mb-2">
      <Card.Header>
        <Link href={`/trip?id=${trip.id}`}>
          <a>{trip.title}</a>
        </Link>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}

export default TripCard;
