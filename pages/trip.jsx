import countries from "cities.json";
import { displayDate, displayLocation } from "client/display";
import submit from "client/submit";
import Avatar from "components/Avatar";
import PersonAdd from "components/icons/PersonAdd";
import PersonRemove from "components/icons/PersonRemove";
import RouteMap from "components/RouteMap";
import StickyLayout from "components/StickyLayout";
import TripCapacity from "components/TripCapacity";
import TripIcons from "components/TripIcons";
import Link from "next/Link";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import prisma from "server/prisma";
import { getSession } from "server/session";
import styles from "./trip.module.css";

function UserList({ title, userType, reservations }) {
  if (reservations.length === 0) {
    return <p className="text-muted">No {userType}</p>;
  }
  return (
    <section>
      <h2>{title}</h2>
      <Card body>
        <ul className="vertical-group">
          {reservations.map(({ user: { id, name, avatarHash } }) => (
            <li key={id}>
              <Link href={`/profile?id=${id}`}>
                <a className={styles.authorProfile}>
                  <Avatar hash={avatarHash} />
                  <span>{name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

function TripPage({ trip }) {
  const router = useRouter();

  function isAuthor(reservation) {
    return reservation.user.id === trip.authorId;
  }

  const author = trip.reservations.find(isAuthor).user;
  return (
    <StickyLayout
      flipped
      main={
        <div className="card-list">
          <section>
            <h1>{trip.title}</h1>
            <div className="d-flex justify-content-between">
              <TripIcons trip={trip} />
              <div className="align-self-start">
                {trip.reservationStatus === "NOT_REQUESTED" ? (
                  <Button
                    variant="outline-success"
                    onClick={async () => {
                      await submit("/api/request-reservation", {
                        tripId: trip.id,
                      });
                      router.replace(router.asPath);
                    }}
                  >
                    <div className="iconed-text">
                      <PersonAdd />
                      <span>Request to Join</span>
                    </div>
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={async () => {
                      await submit("/api/cancel-reservation", {
                        tripId: trip.id,
                      });
                      router.replace(router.asPath);
                    }}
                  >
                    <div className="iconed-text">
                      <PersonRemove />
                      <span>
                        {trip.reservationStatus === "PENDING"
                          ? "Cancel Request"
                          : "Leave"}
                      </span>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </section>
          <section>
            <h2>Overview</h2>
            <Card>
              <Card.Body className={styles.overview}>
                <div className="text-muted">Locations:</div>
                <ul className={styles.locations}>
                  {trip.locations.map((location, i) => (
                    <li key={i}>{displayLocation(location)}</li>
                  ))}
                </ul>
                <div className="text-muted">Start date:</div>
                <div>{displayDate(new Date(trip.tripBeginTime))}</div>
                <div className="text-muted">End date:</div>
                <div>{displayDate(new Date(trip.tripEndTime))}</div>
                <div className="text-muted">Expected Expense:</div>
                <div>${trip.expectedExpense} / day</div>
              </Card.Body>
            </Card>
          </section>
          <section>
            <h2>Description</h2>
            <Card body>
              <p>{trip.description}</p>
            </Card>
          </section>
          <section>
            <h2>Route</h2>
            <RouteMap
              locations={trip.locations.map(
                (city) => countries[city.country][city.province][city.city]
              )}
            />
          </section>
        </div>
      }
      side={
        <div className="card-list">
          <section>
            <h2>Capacity</h2>
            <TripCapacity
              teamSize={trip.teamSize}
              reservations={trip.reservations.length}
            />
          </section>
          <section>
            <h2>Founder</h2>
            <Link href={`/profile?id=${author.id}`}>
              <a className={styles.authorProfile}>
                <Avatar hash={author.avatarHash} />
                <span>{author.name}</span>
              </a>
            </Link>
          </section>
          <UserList
            title="Other Participants"
            userType="other participants"
            reservations={trip.reservations.filter(
              (r) => !isAuthor(r) && r.status === "APPROVED"
            )}
          />
          {trip.authoredByCurrentUser && (
            <UserList
              title="Pending Requests"
              userType="pending requests"
              reservations={trip.reservations.filter(
                (r) => r.status === "PENDING"
              )}
            />
          )}
        </div>
      }
    />
  );
}

export async function getServerSideProps({ req, query }) {
  const { userId } = getSession(req);
  let { id } = query;
  id = parseInt(id);
  const {
    authorId,
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
          status: true,
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
        authorId,
        tripBeginTime: tripBeginTime.toISOString(),
        tripEndTime: tripEndTime.toISOString(),
        transports: transports.map(({ transport }) => transport),
        // {city, province, country}[]
        locations: locations.map(({ location }) => location),
        expectedExpense: expectedExpense.toJSON(),
        authoredByCurrentUser: authorId === userId,
        reservations:
          authorId === userId
            ? reservations
            : reservations.filter((r) => r.status == "APPROVED"),
        reservationStatus:
          reservations.find((r) => r.user.id === userId)?.status ??
          "NOT_REQUESTED",
      },
    },
  };
}
export default TripPage;
