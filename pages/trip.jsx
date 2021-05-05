import countries from "cities.json";
import { displayLocation } from "client/display";
import submit from "client/submit";
import Avatar from "components/Avatar";
import NavBar from "components/NavBar";
import RouteMap from "components/RouteMap";
import TripCapacity from "components/TripCapacity";
import Link from "next/Link";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import prisma from "server/prisma";
import { getSession } from "server/session";
import styles from "./trip.module.css";
import { displayDate } from "client/display";

function TripPage({ trip }) {
  const router = useRouter();

  function isAuthor(reservation) {
    return reservation.user.id === trip.authorId;
  }

  const author = trip.reservations.find(isAuthor).user;
  return (
    <div>
      <NavBar />
      <Container fluid="xl">
        <Row>
          <Col lg={8}>
            <Button
              variant={trip.reserved ? "danger" : "outline-success"}
              onClick={async () => {
                await submit("/api/update-reservation", {
                  tripId: trip.id,
                  reserve: !trip.reserved,
                });
                router.replace(router.asPath);
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
              <li>Start date: {displayDate(new Date(trip.tripBeginTime))}</li>
              <li>End date: {displayDate(new Date(trip.tripEndTime))}</li>
            </ul>
            <h2>Team Capacity</h2>
            <TripCapacity
              teamSize={trip.teamSize}
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
          <Col lg={4}>
            <div className={styles.userList}>
              <section>
                <h2>Founder</h2>
                <Link href={`/profile?id=${author.id}`}>
                  <a>
                    <div className={styles.authorProfile}>
                      <Avatar hash={author.avatarHash} />
                      <div className={styles.authorIdentity}>
                        <h2>{author.name}</h2>
                      </div>
                    </div>
                  </a>
                </Link>
              </section>
              <section>
                <h2>Other Participants</h2>
                <ul className="vertical-user-group">
                  {trip.reservations
                    .filter((r) => !isAuthor(r))
                    .map(({ user: { id, name, avatarHash } }) => {
                      return (
                        <li key={id}>
                          <Link href={`/profile?id=${id}`}>
                            <a>
                              <Avatar hash={avatarHash} />
                              <h3>{name}</h3>
                            </a>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </section>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export async function getServerSideProps({ req, query }) {
  const { userId } = getSession(req);
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
          user: {
            select: {
              id: true,
              name: true,
              avatarHash: true,
            },
          },
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
        reserved: reservations.some((r) => r.user.id === userId),
      },
    },
  };
}
export default TripPage;
