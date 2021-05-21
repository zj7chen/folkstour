import { yup } from "client/validate";
import { postApi } from "server/api";
import { clearSession } from "server/session";

const schema = yup.object();

export default postApi(schema, async ({}, req, res) => {
  clearSession(res);
});
