import { searchTripSchema } from "client/validate";
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
              numParticipants={trip.numParticipants}
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
    let locationJson;
    if (query.location) {
      try {
        locationJson = JSON.parse(query.location);
      } catch (e) {
        return { notFound: true };
      }
    }
    let { title, location, dates, teamsize, transports, expense } =
      await searchTripSchema.validate({
        title: query.title,
        location: locationJson,
        dates: query.dates ? query.dates.split(",") : undefined,
        teamsize: query.teamsize ? query.teamsize.split(",") : undefined,
        transports: query.transports ? query.transports.split(",") : undefined,
        expense: query.expense || undefined,
      });
    // 30 days
    const margin = 30 * 24 * 60 * 60 * 1000;
    let start, end;
    if (dates) {
      [start, end] = dates;
      start = new Date(start.getTime() - margin);
      end = new Date(end.getTime() + margin);
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
        participations: {
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
              equals: location,
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
          in: teamsize,
        },
        transports: {
          every: {
            transport: {
              in: transports,
            },
          },
        },
        expectedExpense: {
          lte: expense,
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
            participations,
            ...rest
          }) => ({
            ...rest,
            tripBeginTime: tripBeginTime.toISOString(),
            tripEndTime: tripEndTime.toISOString(),
            transports: transports.map(({ transport }) => transport),
            startLocation: locations[0].location,
            endLocation: locations[locations.length - 1].location,
            numLocations: locations.length,
            numParticipants: participations.length,
          })
        ),
      },
    };
  },
  { optional: true }
);

export default SearchTripPage;
