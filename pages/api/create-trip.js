import prisma from "server/prisma";
import admin from "server/server";

async function handler(req, res) {
  if (req.method === "POST") {
    const sessionCookie = req.cookies.session || "";
    // firebase-admin
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    await prisma.trip.create({
      data: {
        locations: {
          create: req.body.locations.map((location, order) => ({
            location,
            order,
          })),
        },
        tripBeginTime: new Date(req.body.dates.start + "T00:00:00.000Z"),
        tripEndTime: new Date(req.body.dates.end + "T00:00:00.000Z"),
        transports: {
          create: req.body.transports.map((transport) => ({ transport })),
        },
        title: req.body.title,
        description: req.body.description,
        teamSize: req.body.teamSize,
        expectedExpense: req.body.expense,
        genderRequirement: req.body.gender,
        author: { connect: { id: decodedClaims.uid } },
        reservations: {
          create: { userId: decodedClaims.uid },
        },
      },
    });
    res.json({});
    // .catch((error) => {
    //   console.log(error);
    //   res.status(400).json({ message: "Failed" });
    // });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
