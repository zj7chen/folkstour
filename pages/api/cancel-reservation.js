import { tripIdSchema, userIdSchema, yup } from "client/validate";
import { ClientError, postApi } from "server/api";
import prisma from "server/prisma";
import { getSession } from "server/session";

const schema = yup.object().shape({
  userId: userIdSchema,
  tripId: tripIdSchema.required(),
});

export default postApi(
  schema,
  async ({ userId: requestUserId, tripId }, req) => {
    const { userId: loginUserId } = getSession(req);

    // am organizer, rm self, last - parti, trip
    // am organizer, rm self, not last - noop
    // am organizer, rm other - parti
    // am not organizer, rm self - parti
    // am not organizer, rm other - noop

    // use `deleteMany` because primsa requires uniqueness for `deleteUnique` which `OR` does not provide
    const { count } = await prisma.participation.deleteMany({
      where: {
        userId: requestUserId ?? loginUserId,
        tripId,
        // permission check: only user or trip author can perform this operation
        OR: [
          {
            trip: {
              // we are the author of the trip
              authorId: loginUserId,
              // we are the only one left in the trip
              // (`every` because prisma doesn't support `count` here)
              participations: {
                every: {
                  OR: [{ status: "PENDING" }, { userId: loginUserId }],
                },
              },
            },
          },
          {
            userId: { not: loginUserId },
            trip: {
              // we are the author of the trip
              authorId: loginUserId,
            },
          },
          {
            userId: loginUserId,
            trip: {
              // we are the author of the trip
              authorId: { not: loginUserId },
            },
          },
        ],
      },
    });
    if (count > 1) {
      throw new Error("BUG: broken update logic");
    }
    if (count === 0) {
      throw new ClientError(403, "Unauthorized operation");
    }
    const approvedLeft = await prisma.participation.count({
      where: {
        tripId,
        status: "APPROVED",
      },
    });
    if (approvedLeft === 0) {
      // nobody left in the trip, delete trip
      await prisma.$transaction([
        prisma.tripLocation.deleteMany({
          where: { tripId },
        }),
        prisma.tripTransport.deleteMany({
          where: { tripId },
        }),
        prisma.participation.deleteMany({
          where: { tripId },
        }),
        prisma.trip.delete({
          where: { id: tripId },
        }),
      ]);
    }
  }
);
