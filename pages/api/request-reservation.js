import { tripIdSchema, yup } from "client/validate";
import { ClientError, postApi } from "server/api";
import prisma from "server/prisma";
import { getSession } from "server/session";

const schema = yup.object().shape({
  tripId: tripIdSchema.required(),
});

export default postApi(schema, async ({ tripId }, req) => {
  const { userId } = getSession(req);
  const { count } = await prisma.participation.createMany({
    data: [
      {
        userId,
        tripId,
        status: "PENDING",
      },
    ],
    skipDuplicates: true,
  });
  if (count > 1) {
    throw new Error("BUG: broken update logic");
  }
  if (count === 0) {
    throw new ClientError(409, "Already exists");
  }
});
