import prisma from "server/prisma";
import { getSession } from "server/session";

async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = getSession(req);
    if (req.body.reserve) {
      await prisma.reservation.create({
        data: {
          userId,
          tripId: req.body.tripId,
        },
      });
    } else {
      await prisma.reservation.delete({
        where: {
          tripId_userId: {
            userId,
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
