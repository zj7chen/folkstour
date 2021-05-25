import bcrypt from "bcrypt";
import { GENDERS } from "client/choices";
import { nameSchema, passwordSchema, yup } from "client/validate";
import { ClientError, postApi } from "server/api";
import prisma from "server/prisma";
import { setSession } from "server/session";

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: passwordSchema.required(),
  name: nameSchema.required(),
  gender: yup.mixed().required().oneOf(Object.keys(GENDERS)),
});

export default postApi(
  schema,
  async ({ email, password, name, gender }, req, res) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email,
          password: hash,
          name,
          gender,
        },
      });
    } catch (error) {
      console.log("Error creating new user:", error);
      // TODO: only throw ClientError if email is dup
      throw new ClientError(400, error.message);
    }
    console.log("Successfully created new user:", user.id);
    setSession(res, user.id);
  }
);
