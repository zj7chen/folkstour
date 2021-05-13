import NavBar from "components/NavBar";
import { getSession } from "server/session";
import Container from "react-bootstrap/Container";
import styles from "./dashboard.module.css";

function DashboardPage({ myTrips, participatingTrips, requestedTrips }) {
  return (
    <>
      <NavBar />
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
          <div className={styles.tripList}>
            {requestedTrips.map(({ title }) => (
              <div>
                <p>{title}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { userId } = getSession(req);
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
}

export default DashboardPage;
