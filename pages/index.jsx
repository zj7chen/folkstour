import Home from "components/Home";
import NavBar from "components/NavBar";
import Container from "react-bootstrap/Container";
import { withSessionProps } from "server/session";
import styles from "./index.module.css";

function Dashboard({
  currentUser,
  myTrips,
  participatingTrips,
  requestedTrips,
}) {
  return (
    <>
      <NavBar currentUser={currentUser} />
      <Container fluid="xl" className="card-list mt-3">
        <section>
          <h2>My Trips</h2>
          <div className={styles.tripList}>
            {myTrips.map(({ title, numReservations }) => (
              <div>
                <p>{title}</p>
                <p>{numReservations}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2>Participating Trips</h2>
          <div className={styles.tripList}>
            {participatingTrips.map(({ title }) => (
              <div>
                <p>{title}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2>Requested</h2>
          {requestedTrips.length !== 0 ? (
            <div className={styles.tripList}>
              {requestedTrips.map(({ title }) => (
                <div>
                  <p>{title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">
              None of your requests are waiting for approval
            </p>
          )}
        </section>
      </Container>
    </>
  );
}

function HomePage(props) {
  if (!props.currentUser) {
    return <Home />;
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
    const myTrips = await prisma.trip.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        title: true,
        reservations: {
          where: {
            status: "PENDING",
          },
          select: {
            id: true,
          },
        },
      },
      where: {
        authorId: userId,
      },
    });
    const participatingTrips = await prisma.trip.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        title: true,
      },
      where: {
        authorId: {
          not: userId,
        },
        reservations: {
          some: {
            userId,
            status: "APPROVED",
          },
        },
      },
    });
    const requestedTrips = await prisma.trip.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        title: true,
      },
      where: {
        authorId: {
          not: userId,
        },
        reservations: {
          some: {
            userId,
            status: "PENDING",
          },
        },
      },
    });

    return {
      props: {
        myTrips: myTrips.map(({ reservations, ...rest }) => ({
          ...rest,
          numReservations: reservations.length,
        })),
        participatingTrips,
        requestedTrips,
      },
    };
  },
  { optional: true }
);

export default HomePage;
