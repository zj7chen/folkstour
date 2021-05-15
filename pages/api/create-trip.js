import prisma from "server/prisma";
import { getSession } from "server/session";

async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = getSession(req);
    const {
      locations,
      dates,
      transports,
      title,
      description,
      teamSize,
      expense,
      gender,
    } = req.body;
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
        tripBeginTime: new Date(dates.start + "T00:00:00.000Z"),
        tripEndTime: new Date(dates.end + "T00:00:00.000Z"),
        transports: {
          create: transports.map((transport) => ({ transport })),
        },
        title,
        description,
        teamSize,
        expectedExpense: expense,
        genderRequirement: gender,
        author: { connect: { id: userId } },
        reservations: {
          create: {
            userId,
            status: "APPROVED",
          },
        },
      },
    });
    console.log(`Created trip ${id}`);
    res.json({ id: trip.id });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
