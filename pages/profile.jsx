import { displayLocation } from "client/display";
import Avatar from "components/Avatar";
import Female from "components/icons/Female";
import Male from "components/icons/Male";
import StickyLayout from "components/StickyLayout";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import ReactMarkdown from "react-markdown";
import prisma from "server/prisma";
import styles from "./profile.module.css";

function TripCard({ trip }) {
  return (
    <Card>
      <Card.Header>
        <Link href={`/trip?id=${trip.id}`}>
          <a>{trip.title}</a>
        </Link>
      </Card.Header>
      <Card.Body>
        <div>
          {displayLocation(trip.startLocation)},{" "}
          {displayLocation(trip.endLocation)}
        </div>
        <div>
          Trip Time: {trip.tripBeginTime}, {trip.tripEndTime},
        </div>
        {trip.reservations.map(({ user: { id, avatarHash } }) => (
          <Avatar key={id} hash={avatarHash} />
        ))}
      </Card.Body>
    </Card>
  );
}

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
        <>
          <section>
            <h2>Self Introduction</h2>
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
          </section>

          <section>
            <h2>Participating Trips</h2>
            {user.reservations.map(({ trip }) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </section>
        </>
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
