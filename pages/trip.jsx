import countries from "cities.json";
import { displayDate, displayLocation } from "client/display";
import submit from "client/submit";
import Avatar from "components/Avatar";
import ConfirmModal from "components/ConfirmModal";
import EllipsisVertical from "components/icons/EllipsisVertical";
import PersonAdd from "components/icons/PersonAdd";
import PersonRemove from "components/icons/PersonRemove";
import Warning from "components/icons/Warning";
import MarkdownViewer from "components/MarkdownViewer";
import RouteMap from "components/RouteMap";
import StickyLayout from "components/StickyLayout";
import TripCapacity from "components/TripCapacity";
import TripIcons from "components/TripIcons";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
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
                  <a className={styles.organizerProfile}>
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

const EllipsisToggle = forwardRef(({ onClick, children }, ref) => {
  return (
    <a
      className={styles.dropdownLink}
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <EllipsisVertical />
    </a>
  );
});

function TripPage({ currentUser, trip }) {
  const router = useRouter();
  const [confirmProps, setConfirmProps] = useState();

  function isOrganizer(participation) {
    return participation.user.id === trip.organizerId;
  }

  const organizer = trip.participations.find(isOrganizer).user;
  const approvedParticipants = trip.participations
    .filter((r) => !isOrganizer(r) && r.status === "APPROVED")
    .map(({ user }) => user);
  const pendingParticipants = trip.participations
    .filter((r) => r.status === "PENDING")
    .map(({ user }) => user);
  return (
    <>
      <ConfirmModal
        show={!!confirmProps}
        onClose={() => setConfirmProps(undefined)}
        {...confirmProps}
      />
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
                            query: {
                              redirect: router.asPath,
                            },
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
                        console.log({
                          trip,
                          currentUser,
                          approvedParticipants,
                        });
                        const noop =
                          trip.organizerId === currentUser?.id &&
                          approvedParticipants.length > 0;
                        const onConfirm = noop
                          ? undefined
                          : async () => {
                              await submit("/api/cancel-reservation", {
                                tripId: trip.id,
                              });
                              router.push("/");
                            };
                        setConfirmProps({
                          body: noop ? (
                            <p>
                              Please transfer the organizer role to another
                              participant before leaving the trip.
                            </p>
                          ) : (
                            <p>
                              You will leave the trip. To rejoin you must
                              request to join again.
                            </p>
                          ),
                          onConfirm,
                        });
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
                <MarkdownViewer value={trip.description} />
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
                numParticipants={
                  trip.participations.filter((r) => r.status === "APPROVED")
                    .length
                }
              />
            </section>
            <section>
              <h2>Organizer</h2>
              <Link href={`/profile?id=${organizer.id}`}>
                <a className={styles.organizerProfile}>
                  <Avatar hash={organizer.avatarHash} />
                  <span>{organizer.name}</span>
                </a>
              </Link>
            </section>
            <UserList
              title="Other Participants"
              userType="other participants"
              users={approvedParticipants}
              actions={(user) =>
                trip.organizerId === currentUser?.id && (
                  <Dropdown>
                    <Dropdown.Toggle
                      as={EllipsisToggle}
                      id={`user-dropdown-${user.id}`}
                    />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          setConfirmProps({
                            body: (
                              <>
                                <p>
                                  {user.name} will become the organizer of this
                                  trip.
                                </p>
                                <p className="text-danger inline-icon">
                                  <Warning />
                                  <span>
                                    You will lose your role as the organizer.
                                  </span>
                                </p>
                              </>
                            ),
                            onConfirm: async () => {
                              await submit("/api/update-organizer", {
                                userId: user.id,
                                tripId: trip.id,
                              });
                              router.replace(router.asPath);
                            },
                          });
                        }}
                      >
                        Transfer organizer role
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setConfirmProps({
                            body: (
                              <p>{user.name} will be removed from this trip.</p>
                            ),
                            onConfirm: async () => {
                              await submit("/api/cancel-reservation", {
                                userId: user.id,
                                tripId: trip.id,
                              });
                              router.replace(router.asPath);
                            },
                          });
                        }}
                      >
                        Remove from trip
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )
              }
            />
            {trip.organizedByCurrentUser && (
              <UserList
                title="Pending Requests"
                userType="pending requests"
                users={pendingParticipants}
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
    </>
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
          organizerId: true,
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
          participations: {
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
      organizerId,
      tripBeginTime,
      tripEndTime,
      transports,
      locations,
      expectedExpense,
      participations,
      ...rest
    } = trip;
    const userId = session?.userId;
    return {
      props: {
        trip: {
          ...rest,
          organizerId,
          tripBeginTime: tripBeginTime.toISOString(),
          tripEndTime: tripEndTime.toISOString(),
          transports: transports.map(({ transport }) => transport),
          // {city, province, country}[]
          locations: locations.map(({ location }) => location),
          expectedExpense: expectedExpense.toJSON(),
          organizedByCurrentUser: organizerId === userId,
          participations:
            organizerId === userId
              ? participations
              : participations.filter((r) => r.status == "APPROVED"),
          reservationStatus:
            participations.find((r) => r.user.id === userId)?.status ??
            "NOT_REQUESTED",
        },
      },
    };
  },
  { optional: true }
);

export default TripPage;
