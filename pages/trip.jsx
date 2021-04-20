import { displayLocation } from "client/display";
import countries from "cities.json";
import NavBar from "components/NavBar";
import TripCapacity from "components/TripCapacity";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import prisma from "server/prisma";
import RouteMap from "components/RouteMap";
import admin from "server/server";
import Button from "react-bootstrap/Button";
import submit from "client/submit";

function TripPage({ trip }) {
  return (
    <div>
      <NavBar />
      <Container fluid="xl">
        <Row>
          <Col lg={8}>
            <Button
              variant={trip.reserved ? "danger" : "outline-success"}
              // Why need async await for onClick?
              onClick={async () => {
                await submit("/api/update-reservation", {
                  tripId: trip.id,
                  reserve: !trip.reserved,
                });
              }}
            >
              {trip.reserved ? "Quit" : "Join"}
            </Button>
            <h1>{trip.title}</h1>
            <ul>
              <li>{trip.genderRequirement}</li>
              <li>{trip.transports}</li>
            </ul>
            <h2>Locations</h2>
            <ul>
              {trip.locations.map((location, i) => (
                <li key={i}>{displayLocation(location)}</li>
              ))}
            </ul>
            <ul>
              <li>Start date: {trip.tripBeginTime}</li>
              <li>End date: {trip.tripEndTime}</li>
            </ul>
            <h2>Team Capacity</h2>
            <TripCapacity
              teamSize={trip.teamSize}
              // Can we get length from a relation?
              reservations={trip.reservations.length}
            />
            <h2>Expected Expense</h2>
            <span>${trip.expectedExpense}</span>
            <h2>Description</h2>
            <p>{trip.description}</p>

            <h2>Route</h2>
            <RouteMap
              locations={trip.locations.map(
                (city) => countries[city.country][city.province][city.city]
              )}
            />
          </Col>
          <Col lg={4}>User Info</Col>
        </Row>
      </Container>
    </div>
  );
}

export async function getServerSideProps({ req, query }) {
  const sessionCookie = req.cookies.session || "";
  // firebase-admin
  const decodedClaims = await admin
    .auth()
    .verifySessionCookie(sessionCookie, true);
  let { id } = query;
  id = parseInt(id);
  const {
    tripBeginTime,
    tripEndTime,
    transports,
    locations,
    expectedExpense,
    reservations,
    ...rest
  } = await prisma.trip.findUnique({
    select: {
      id: true,
      title: true,
      authorId: true,
      genderRequirement: true,
      tripBeginTime: true,
      tripEndTime: true,
      expectedExpense: true,
      description: true,
      transports: {
        select: {
          transport: true,
        },
      },
      teamSize: true,
      locations: {
        orderBy: {
          order: "asc",
        },
        select: {
          location: true,
        },
      },
      reservations: {
        select: {
          userId: true,
        },
      },
    },
    where: {
      // id: id
      id,
    },
  });
  return {
    props: {
      trip: {
        ...rest,
        tripBeginTime: tripBeginTime.toISOString(),
        tripEndTime: tripEndTime.toISOString(),
        transports: transports.map(({ transport }) => transport),
        // {city, province, country}[]
        locations: locations.map(({ location }) => location),
        expectedExpense: expectedExpense.toJSON(),
        reservations,
        reserved: reservations.some((r) => r.userId === decodedClaims.uid),
      },
    },
  };
}
export default TripPage;
