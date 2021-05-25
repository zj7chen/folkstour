import bcrypt from "bcrypt";
import { loginSchema } from "client/validate";
import { ClientError, postApi } from "server/api";
import prisma from "server/prisma";
import { setSession } from "server/session";

export default postApi(
  loginSchema,
  async ({ email, password, remember }, req, res) => {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        password: true,
      },
      where: {
        email,
      },
    });
    if (user === null || !(await bcrypt.compare(password, user.password))) {
      throw new ClientError(401, "Unauthorized");
    }

    setSession(res, user.id, { remember });
  }
);
