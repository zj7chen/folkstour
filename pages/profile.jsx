import { displayLocation } from "client/display";
import Avatar from "components/Avatar";
import StickyLayout from "components/StickyLayout";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import ReactMarkdown from "react-markdown";
import prisma from "server/prisma";

function TripCard({ trip }) {
  console.log(trip.locations);
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
        {trip.reservations.map(({ user: { id } }) => (
          <Avatar key={id} id={id} />
        ))}
      </Card.Body>
    </Card>
  );
}

function ProfilePage({ user }) {
  return (
    <StickyLayout
      left={
        <>
          <Avatar id={user.id} />
          <span>{user.name}</span>
          <span>{user.gender}</span>
        </>
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
