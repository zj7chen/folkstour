import { displayDate } from "client/display";
import Home from "components/Home";
import Flag from "components/icons/Flag";
import Mail from "components/icons/Mail";
import People from "components/icons/People";
import NavBar from "components/NavBar";
import { Timeline, TimelineItem } from "components/Timeline";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import { withSessionProps } from "server/session";

function Dashboard({ currentUser, trips }) {
  return (
    <>
      <NavBar currentUser={currentUser} />
      <Container fluid="xl" className="card-list mt-3">
        {trips.length === 0 ? (
          <p>You are not participating in any trips</p>
        ) : (
          <Timeline>
            {trips.map(
              ({
                id,
                title,
                tripBeginTime,
                authorId,
                numReservations,
                reservationStatus,
              }) => (
                <TimelineItem
                  key={id}
                  date={displayDate(new Date(tripBeginTime))}
                >
                  <div className="d-flex justify-content-between">
                    <Link href={`/trip?id=${id}`}>
                      <a>{title}</a>
                    </Link>
                    <div>
                      {numReservations
                        ? `${numReservations} pending requests`
                        : ""}
                    </div>
                  </div>
                  {authorId === currentUser.id ? (
                    <div className="text-muted inline-icon">
                      <Flag />
                      <span>Organizer</span>
                    </div>
                  ) : reservationStatus === "APPROVAL" ? (
                    <div className="text-muted inline-icon">
                      <People />
                      <span>Participant</span>
                    </div>
                  ) : (
                    <div className="text-info inline-icon">
                      <Mail />
                      <span>Requested</span>
                    </div>
                  )}
                </TimelineItem>
              )
            )}
          </Timeline>
        )}
      </Container>
    </>
  );
}

function HomePage(props) {
  if (!props.currentUser) {
    return <Home {...props} />;
  } else {
    return <Dashboard {...props} />;
  }
}

export const getServerSideProps = withSessionProps(
  async ({ session }) => {
    if (!session) {
      return { props: {} };
    }
    const { userId } = session;
    const trips = await prisma.trip.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        tripBeginTime: true,
        authorId: true,
        reservations: {
          select: {
            userId: true,
            status: true,
          },
        },
      },
      where: {
        OR: [
          { authorId: userId },
          {
            authorId: {
              not: userId,
            },
            reservations: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    });

    console.log(trips[0].reservations);
    return {
      props: {
        trips: trips.map(
          ({ tripBeginTime, reservations, authorId, ...rest }) => ({
            ...rest,
            tripBeginTime: tripBeginTime.toISOString(),
            reservationStatus: reservations.find((r) => r.userId === userId)
              .status,
            numReservations:
              authorId === userId
                ? reservations.filter((r) => r.status === "PENDING").length
                : null,
            authorId,
          })
        ),
      },
    };
  },
  { optional: true }
);

export default HomePage;
