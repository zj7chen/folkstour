import { tripIdSchema, yup } from "client/validate";
import { postApi } from "server/api";
import prisma from "server/prisma";
import { getSession } from "server/session";

const schema = yup.object().shape({
  tripId: tripIdSchema.required(),
});

export default postApi(schema, async ({ tripId }, req) => {
  const { userId } = getSession(req);
  try {
    await prisma.reservation.delete({
      where: {
        tripId_userId: {
          userId,
          tripId,
        },
      },
    });
  } catch (e) {
    // TODO: find out exception type
    console.log(e);
    return;
  }
});
