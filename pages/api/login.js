import bcrypt from "bcrypt";
import { passwordSchema, yup } from "client/validate";
import { ClientError, postApi } from "server/api";
import prisma from "server/prisma";
import { setSession } from "server/session";

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: passwordSchema.required(),
});

export default postApi(schema, async ({ email, password }, req, res) => {
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      password: true,
    },
    where: {
      email,
    },
  });
  if (!(await bcrypt.compare(password, user.password))) {
    throw new ClientError(401, "Unauthorized");
  }

  setSession(res, user.id);
});
