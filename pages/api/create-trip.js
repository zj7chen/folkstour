import prisma from "server/prisma";
import admin from "server/server";

function handler(req, res) {
  if (req.method === "POST") {
    const sessionCookie = req.cookies.session || "";
    console.log("coo " + sessionCookie);
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    return admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then((decodedClaims) => {
        return prisma.trip.create({
          data: {
            locations: {
              create: req.body.locations.map((location, order) => ({
                location,
                order,
              })),
            },
            tripBeginTime: req.body.travelDates.start,
            tripEndTime: req.body.travelDates.end,
            transport: req.body.transport,
            title: req.body.title,
            description: req.body.description,
            teamSize: {
              "1-3": "ONE_THREE",
              "4-6": "FOUR_SIX",
              any: "ANY",
            }[req.body.teamSize],
            expectedExpense: req.body.expense,
            genderRequirement: {
              male: "MALE",
              female: "FEMALE",
              any: "ANY",
            }[req.body.gender],
            author: { connect: { id: decodedClaims.uid } },
          },
        });
      })
      .then(() => {
        res.json({});
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ message: "Failed" });
      });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
