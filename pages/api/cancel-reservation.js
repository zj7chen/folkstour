import prisma from "server/prisma";
import { withApiUser } from "server/session";

export default withApiUser(async (req, res, { userId }) => {
  if (req.method === "POST") {
    try {
      await prisma.reservation.delete({
        where: {
          tripId_userId: {
            userId,
            tripId: req.body.tripId,
          },
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
});
