import { tripSchema } from "client/validate";
import { postApi } from "server/api";
import prisma from "server/prisma";
import { getSession } from "server/session";

export default postApi(
  tripSchema,
  async (
    {
      locations,
      dates,
      transports,
      title,
      description,
      teamSize,
      expense,
      gender,
    },
    req
  ) => {
    const { userId } = getSession(req);
    const trip = await prisma.trip.create({
      data: {
        locations: {
          createMany: {
            data: locations.map((location, order) => ({
              location,
              order,
            })),
          },
        },
        tripBeginTime: dates.start,
        tripEndTime: dates.end,
        transports: {
          create: transports.map((transport) => ({ transport })),
        },
        title,
        description,
        teamSize,
        expectedExpense: expense,
        genderRequirement: gender,
        organizer: { connect: { id: userId } },
        participations: {
          create: {
            userId,
            status: "APPROVED",
          },
        },
      },
    });
    console.log("Created trip:", trip.id);
    return { id: trip.id };
  }
);
