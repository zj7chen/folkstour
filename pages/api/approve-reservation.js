import { tripIdSchema, userIdSchema, yup } from "client/validate";
import { ClientError, postApi } from "server/api";
import prisma from "server/prisma";
import { getSession } from "server/session";

const schema = yup.object().shape({
  userId: userIdSchema.required(),
  tripId: tripIdSchema.required(),
});

export default postApi(
  schema,
  async ({ userId: requestUserId, tripId }, req) => {
    const { userId: loginUserId } = getSession(req);
    const { count } = await prisma.participation.updateMany({
      where: {
        userId: requestUserId,
        trip: {
          id: tripId,
          organizerId: loginUserId,
          // maintain invariant: a trip without `APPROVED` participations is pending deletion,
          // and must not gain new `APPROVED` participants
          participations: {
            some: {
              status: "APPROVED",
            },
          },
        },
      },
      data: {
        status: "APPROVED",
      },
    });
    if (count > 1) {
      throw new Error("BUG: broken update logic");
    }
    if (count === 0) {
      throw new ClientError(403, "Unauthorized operation");
    }
  }
);
