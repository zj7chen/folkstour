import { displayLocation } from "client/display";
import NavBar from "components/NavBar";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import prisma from "server/prisma";
import ProgressBar from "react-bootstrap/ProgressBar";

function TripCard({ trip }) {
  const totalTeamSize = { ONE_THREE: 3, FOUR_SIX: 6 }[trip.teamSize];
  return (
    <Card>
      <Card.Header>{trip.title}</Card.Header>
      <Card.Body>
        <div>
          {displayLocation(trip.locations[0].location)},{" "}
          {displayLocation(trip.locations[trip.locations.length - 1].location)}
        </div>
        <div>
          Trip Time: {trip.tripBeginTime}, {trip.tripEndTime},
        </div>
        {trip.teamSize === "ANY" ? (
          "Any"
        ) : (
          <ProgressBar
            striped
            variant="success"
            now={(trip.reservations / totalTeamSize) * 100}
            label={`${trip.reservations} / ${totalTeamSize}`}
          />
        )}
        <div>Transport: {trip.transport.join(" ")}</div>
      </Card.Body>
    </Card>
  );
}

function SearchTripPage(props) {
  return (
    <div>
      <NavBar />
      <Container fluid="xl">
        <Row>
          <Col lg={4}>Search</Col>
          <Col lg={8}>
            {props.trips.map((trip) => (
              <TripCard trip={trip} />
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  const trips = await prisma.trip.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      tripBeginTime: true,
      tripEndTime: true,
      transport: true,
      teamSize: true,
      locations: {
        orderBy: {
          order: "asc",
        },
        select: {
          location: true,
        },
      },
      _count: {
        select: {
          reservations: true,
        },
      },
    },
  });
  return {
    props: {
      trips: trips.map(
        ({
          tripBeginTime,
          tripEndTime,
          _count: { reservations },
          ...trip
        }) => ({
          ...trip,
          tripBeginTime: tripBeginTime.toISOString(),
          tripEndTime: tripEndTime.toISOString(),
          reservations: reservations + 1,
        })
      ),
    },
  };
}

export default SearchTripPage;
