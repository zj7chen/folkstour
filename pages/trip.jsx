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
import { withSessionProps } from "server/session";
import styles from "./trip.module.css";

function UserList({ title, userType, users, actions }) {
  return (
    <section>
      <h2>{title}</h2>
      {users.length === 0 ? (
        <p className="text-muted">No {userType}</p>
      ) : (
        <Card body>
          <ul className="vertical-group">
            {users.map((user) => (
              <li
                key={user.id}
                className="d-flex justify-content-between align-items-center"
              >
                <Link href={`/profile?id=${user.id}`}>
                  <a className={styles.authorProfile}>
                    <Avatar hash={user.avatarHash} />
                    <span>{user.name}</span>
                  </a>
                </Link>
                {actions?.(user)}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}

function TripPage({ currentUser, trip }) {
  const router = useRouter();

  function isAuthor(reservation) {
    return reservation.user.id === trip.authorId;
  }

  const author = trip.reservations.find(isAuthor).user;
  return (
    <StickyLayout
      currentUser={currentUser}
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
                    className="inline-icon"
                    variant="outline-success"
                    onClick={async () => {
                      if (!currentUser) {
                        router.push({
                          pathname: "/login",
                          query: { redirect: router.asPath },
                        });
                        return;
                      }
                      await submit("/api/request-reservation", {
                        tripId: trip.id,
                      });
                      router.replace(router.asPath);
                    }}
                  >
                    <PersonAdd />
                    <span>Request to Join</span>
                  </Button>
                ) : (
                  <Button
                    className="inline-icon"
                    variant="danger"
                    onClick={async () => {
                      await submit("/api/cancel-reservation", {
                        tripId: trip.id,
                      });
                      router.replace(router.asPath);
                    }}
                  >
                    <PersonRemove />
                    <span>
                      {trip.reservationStatus === "PENDING"
                        ? "Cancel Request"
                        : "Leave"}
                    </span>
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
              reservations={
                trip.reservations.filter((r) => r.status === "APPROVED").length
              }
            />
          </section>
          <section>
            <h2>Organizer</h2>
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
            users={trip.reservations
              .filter((r) => !isAuthor(r) && r.status === "APPROVED")
              .map(({ user }) => user)}
          />
          {trip.authoredByCurrentUser && (
            <UserList
              title="Pending Requests"
              userType="pending requests"
              users={trip.reservations
                .filter((r) => r.status === "PENDING")
                .map(({ user }) => user)}
              actions={(user) => (
                <Button
                  className="inline-icon"
                  onClick={async () => {
                    await submit("/api/approve-reservation", {
                      userId: user.id,
                      tripId: trip.id,
                    });
                    router.replace(router.asPath);
                  }}
                >
                  <PersonAdd />
                </Button>
              )}
            />
          )}
        </div>
      }
    />
  );
}

export const getServerSideProps = withSessionProps(
  async ({ query, session }) => {
    let { id } = query;
    let trip;
    if (typeof id === "string") {
      id = parseInt(id);
      trip = await prisma.trip.findUnique({
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
    }
    if (!trip) {
      return { notFound: true };
    }
    const {
      authorId,
      tripBeginTime,
      tripEndTime,
      transports,
      locations,
      expectedExpense,
      reservations,
      ...rest
    } = trip;
    const userId = session?.userId;
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
  },
  { optional: true }
);

export default TripPage;
