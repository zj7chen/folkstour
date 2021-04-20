import prisma from "server/prisma";
import admin from "server/server";

async function handler(req, res) {
  if (req.method === "POST") {
    const sessionCookie = req.cookies.session || "";
    // firebase-admin
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    if (req.body.reserve) {
      await prisma.reservation.create({
        data: {
          userId: decodedClaims.uid,
          tripId: req.body.tripId,
        },
      });
    } else {
      await prisma.reservation.delete({
        where: {
          tripId_userId: {
            userId: decodedClaims.uid,
            tripId: req.body.tripId,
          },
        },
      });
    }

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
