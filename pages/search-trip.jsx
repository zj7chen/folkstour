import SearchTripForm from "components/SearchTripForm";
import StickyLayout from "components/StickyLayout";
import TripCapacity from "components/TripCapacity";
import TripCard from "components/TripCard";
import TripFromTo from "components/TripFromTo";
import prisma from "server/prisma";
import { withSessionProps } from "server/session";
import styles from "./search-trip.module.css";

function SearchTripPage({ currentUser, trips }) {
  return (
    <StickyLayout
      currentUser={currentUser}
      side={<SearchTripForm />}
      main={trips.map((trip) => (
        <TripCard key={trip.id} trip={trip}>
          <TripFromTo
            startLocation={trip.startLocation}
            endLocation={trip.endLocation}
            startDate={new Date(trip.tripBeginTime)}
            endDate={new Date(trip.tripEndTime)}
            length={trip.numLocations}
          />
          <div className={styles.capacity}>
            <div>Capacity:</div>
            <TripCapacity
              teamSize={trip.teamSize}
              reservations={trip.numReservations}
            />
          </div>
        </TripCard>
      ))}
    />
  );
}

// context stores query and other stuff
export const getServerSideProps = withSessionProps(
  async ({ query, session }) => {
    // e.g. const { title: t } = context.query
    // 是取 context.query 中 key 为 title 的 property 并赋值到 变量 t 上
    const { title, location, dates, teamsize, transports, expense } = query;
    let start, end;
    if (dates) {
      [start, end] = dates
        .split(",")
        .map((d) => new Date(d + "T00:00:00.000Z"));
      start = new Date(start.getTime() - 30 * 24 * 60 * 60 * 1000);
      end = new Date(end.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    let user = null;
    if (session) {
      user = await prisma.user.findUnique({
        select: {
          gender: true,
        },
        where: {
          id: session.userId,
        },
      });
    }
    const trips = await prisma.trip.findMany({
      orderBy: {
        updatedAt: "desc",
      },
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
          where: {
            status: "APPROVED",
          },
          select: {
            id: true,
          },
        },
      },
      where: {
        title: {
          contains: title,
        },
        locations: {
          some: {
            location: {
              equals: location ? JSON.parse(location) : undefined,
            },
          },
        },
        tripBeginTime: {
          gte: start,
        },
        tripEndTime: {
          lte: end,
        },
        OR: [
          user
            ? {
                genderRequirement: {
                  equals: user.gender,
                },
              }
            : undefined,
          {
            genderRequirement: {
              equals: "ANY",
            },
          },
        ],
        teamSize: {
          in: teamsize ? teamsize.split(",") : undefined,
        },
        transports: {
          every: {
            transport: { in: transports ? transports.split(",") : undefined },
          },
        },
        expectedExpense: {
          lte: expense ? parseFloat(expense) : undefined,
        },
      },
    });
    return {
      props: {
        trips: trips.map(
          ({
            tripBeginTime,
            tripEndTime,
            transports,
            locations,
            reservations,
            ...rest
          }) => ({
            ...rest,
            tripBeginTime: tripBeginTime.toISOString(),
            tripEndTime: tripEndTime.toISOString(),
            transports: transports.map(({ transport }) => transport),
            startLocation: locations[0].location,
            endLocation: locations[locations.length - 1].location,
            numLocations: locations.length,
            numReservations: reservations.length,
          })
        ),
      },
    };
  },
  { optional: true }
);

export default SearchTripPage;
