import prisma from "server/prisma";
import { getSession } from "server/session";

async function handler(req, res) {
  if (req.method === "POST") {
    const { userId: loginUserId } = getSession(req);
    const { userId: requestUserId, tripId } = req.body;
    const { count } = await prisma.reservation.updateMany({
      where: {
        userId: requestUserId,
        trip: {
          id: tripId,
          authorId: loginUserId,
        },
      },
      data: {
        status: "APPROVED",
      },
    });
    if (count > 1) throw new Error("BUG: broken update logic");
    if (count === 0) {
      res.status(403).json({ message: "Unauthorized operation" });
      return;
    }

    res.json({});
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
