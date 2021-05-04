import { displayDate } from "client/display";
import Avatar from "components/Avatar";
import Female from "components/icons/Female";
import Male from "components/icons/Male";
import LocationOverview from "components/LocationOverview";
import StickyLayout from "components/StickyLayout";
import TripCard from "components/TripCard";
import Card from "react-bootstrap/Card";
import ReactMarkdown from "react-markdown";
import prisma from "server/prisma";
import styles from "./profile.module.css";

function ProfilePage({ user }) {
  const Gender = { MALE: Male, FEMALE: Female }[user.gender];
  const genderClass = { MALE: styles.male, FEMALE: styles.female }[user.gender];
  return (
    <StickyLayout
      left={
        <div className={styles.userProfile}>
          <Avatar hash={user.avatarHash} />
          <div className={`${styles.userIdentity} ${genderClass}`}>
            <h1>{user.name}</h1>
            <Gender />
          </div>
        </div>
      }
      right={
        <div className={styles.userContent}>
          <section>
            <h2>Intro</h2>
            <Card body>
              <ReactMarkdown
                allowedElements={[
                  "strong",
                  "em",
                  "ul",
                  "ol",
                  "code",
                  "blockquote",
                  "li",
                  "p",
                ]}
                skipHtml
              >
                {user.selfIntro}
              </ReactMarkdown>
            </Card>
          </section>

          <section>
            <h2>Participating Trips</h2>
            {user.reservations.map(({ trip }) => (
              <TripCard key={trip.id} trip={trip}>
                <LocationOverview
                  start={trip.startLocation}
                  end={trip.endLocation}
                  length={trip.numLocations}
                />
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    Start date: {displayDate(new Date(trip.tripBeginTime))}
                  </div>
                  <div>End date: {displayDate(new Date(trip.tripEndTime))}</div>
                </div>
                <ul className="horizontal-image-group">
                  {trip.reservations.map(({ user: { id, avatarHash } }) => (
                    <li key={id}>
                      <Avatar hash={avatarHash} />
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

export async function getServerSideProps({ query }) {
  let { id } = query;
  id = parseInt(id);
  const { reservations, ...rest } = await prisma.user.findUnique({
    select: {
      name: true,
      avatarHash: true,
      selfIntro: true,
      gender: true,
      reservations: {
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
              tripBeginTime: true,
              tripEndTime: true,
              locations: {
                orderBy: {
                  order: "asc",
                },
                select: {
                  location: true,
                },
              },
              reservations: {
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
      id: true,
    },
    where: {
      id,
    },
  });
  return {
    props: {
      user: {
        ...rest,
        reservations: reservations.map(
          ({ trip: { tripBeginTime, tripEndTime, locations, ...rest } }) => ({
            trip: {
              ...rest,
              tripBeginTime: tripBeginTime.toISOString(),
              tripEndTime: tripEndTime.toISOString(),
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
}

export default ProfilePage;
