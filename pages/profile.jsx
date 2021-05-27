import Avatar from "components/Avatar";
import Female from "components/icons/Female";
import Male from "components/icons/Male";
import MarkdownViewer from "components/MarkdownViewer";
import StickyLayout from "components/StickyLayout";
import TripCard from "components/TripCard";
import TripFromTo from "components/TripFromTo";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import prisma from "server/prisma";
import { withSessionProps } from "server/session";
import styles from "./profile.module.css";

function ProfilePage({ currentUser, user }) {
  const Gender = { MALE: Male, FEMALE: Female }[user.gender];
  const genderClass = { MALE: "male", FEMALE: "female" }[user.gender];
  return (
    <StickyLayout
      currentUser={currentUser}
      side={
        <div className={styles.userProfile}>
          <Avatar hash={user.avatarHash} />
          <div className={`${styles.userIdentity} ${genderClass}`}>
            <h1>{user.name}</h1>
            <Gender />
          </div>
        </div>
      }
      main={
        <div className={styles.userContent}>
          <section>
            <h2>Intro</h2>
            <Card body>
              <MarkdownViewer value={user.selfIntro} />
            </Card>
          </section>

          <section>
            <h2>Participating Trips</h2>
            {user.reservations.map(({ trip }) => (
              <TripCard key={trip.id} trip={trip}>
                <TripFromTo
                  startLocation={trip.startLocation}
                  endLocation={trip.endLocation}
                  startDate={new Date(trip.tripBeginTime)}
                  endDate={new Date(trip.tripEndTime)}
                  length={trip.numLocations}
                />
                <div className="mb-2" />
                <ul className="horizontal-group group-size-avatar">
                  {trip.reservations.map(({ user: { id, avatarHash } }) => (
                    <li key={id}>
                      <Link href={`/profile?id=${id}`}>
                        <a>
                          <Avatar hash={avatarHash} />
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </TripCard>
            ))}
          </section>
        </div>
      }
    />
  );
}

export const getServerSideProps = withSessionProps(async ({ query }) => {
  let { id } = query;
  let user;
  if (typeof id === "string") {
    id = parseInt(id);
    user = await prisma.user.findUnique({
      select: {
        name: true,
        avatarHash: true,
        selfIntro: true,
        gender: true,
        reservations: {
          where: {
            status: "APPROVED",
          },
          orderBy: {
            trip: {
              title: "asc",
            },
          },
          select: {
            trip: {
              select: {
                id: true,
                title: true,
                genderRequirement: true,
                tripBeginTime: true,
                tripEndTime: true,
                transports: {
                  select: {
                    transport: true,
                  },
                },
                locations: {
                  orderBy: {
                    order: "asc",
                  },
                  select: {
                    location: true,
                  },
                },
                reservations: {
                  where: {
                    status: "APPROVED",
                  },
                  orderBy: {
                    user: {
                      name: "asc",
                    },
                  },
                  select: {
                    user: {
                      select: {
                        id: true,
                        avatarHash: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });
  }
  if (!user) {
    return { notFound: true };
  }
  const { reservations, ...rest } = user;
  return {
    props: {
      user: {
        ...rest,
        reservations: reservations.map(
          ({
            trip: {
              tripBeginTime,
              tripEndTime,
              transports,
              locations,
              ...rest
            },
          }) => ({
            trip: {
              ...rest,
              tripBeginTime: tripBeginTime.toISOString(),
              tripEndTime: tripEndTime.toISOString(),
              transports: transports.map(({ transport }) => transport),
              startLocation: locations[0].location,
              endLocation: locations[locations.length - 1].location,
              numLocations: locations.length,
            },
          })
        ),
        id,
      },
    },
  };
});

export default ProfilePage;
