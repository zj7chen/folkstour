import prisma from "server/prisma";
import { getSession } from "server/session";

async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = getSession(req);
    try {
      await prisma.reservation.create({
        data: {
          userId,
          tripId: req.body.tripId,
          status: "PENDING",
        },
      });
    } catch (e) {
      // TODO: find out exception type
      console.log(e);
      return;
    }

    res.json({});
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
