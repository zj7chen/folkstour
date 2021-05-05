import { displayLocation } from "client/display";
import SearchTripForm from "components/SearchTripForm";
import StickyLayout from "components/StickyLayout";
import TripCapacity from "components/TripCapacity";
import TripCard from "components/TripCard";
import prisma from "server/prisma";
import { getSession } from "server/session";
import LocationOverview from "components/LocationOverview";
import { displayDate } from "client/display";
import Driving from "components/icons/Driving";
import Trekking from "components/icons/Trekking";
import Cycling from "components/icons/Cycling";
import styles from "./search-trip.module.css";

function SearchTripPage(props) {
  return (
    <StickyLayout
      left={<SearchTripForm />}
      right={props.trips.map((trip) => (
        <TripCard key={trip.id} trip={trip}>
          {/* This is the object, so why can't I do .location in return props? 
          {
              location: { city: 'Ottawa', country: 'Canada', province: 'Ontario' }
          }*/}
          <LocationOverview
            start={trip.startLocation.location}
            end={trip.endLocation.location}
            length={trip.numLocations}
          />
          <div className="d-flex justify-content-between mb-2">
            <div>Start date: {displayDate(new Date(trip.tripBeginTime))}</div>
            <div>End date: {displayDate(new Date(trip.tripEndTime))}</div>
          </div>
          <TripCapacity
            teamSize={trip.teamSize}
            reservations={trip.reservations}
          />
          <ul className={styles.tripTransports}>
            {trip.transports.map((transport, i) => {
              const Transport = {
                DRIVING: Driving,
                TREKKING: Trekking,
                CYCLING: Cycling,
              }[transport];
              return (
                // Anything better than 'i' as a key?
                <li key={i}>
                  <Transport />
                </li>
              );
            })}
          </ul>
        </TripCard>
      ))}
    />
  );
}

// context stores query and other stuff
export async function getServerSideProps({ req, query }) {
  const { userId } = await getSession(req);
  // e.g. const { title: t } = context.query
  // 是取 context.query 中 key 为 title 的 property 并赋值到 变量 t 上
  const { title, location, dates, teamsize, transports, expense } = query;
  let start, end;
  if (dates) {
    [start, end] = dates.split(",").map((d) => new Date(d + "T00:00:00.000Z"));
    start = new Date(start.getTime() - 30 * 24 * 60 * 60 * 1000);
    end = new Date(end.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
  const user = await prisma.user.findUnique({
    select: {
      gender: true,
    },
    where: {
      id: userId,
    },
  });
  const trips = await prisma.trip.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
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
      _count: {
        select: {
          reservations: true,
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
        {
          genderRequirement: {
            equals: user.gender,
          },
        },
        {
          genderRequirement: {
            equals: "ANY",
          },
        },
      ],
      teamSize: {
        equals: teamsize !== "ANY" ? teamsize : undefined,
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
          _count: { reservations },
          ...rest
        }) => ({
          ...rest,
          tripBeginTime: tripBeginTime.toISOString(),
          tripEndTime: tripEndTime.toISOString(),
          transports: transports.map(({ transport }) => transport),
          startLocation: locations[0],
          endLocation: locations[locations.length - 1],
          numLocations: locations.length,
          reservations,
        })
      ),
    },
  };
}

export default SearchTripPage;
