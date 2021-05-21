import { ValidationError } from "yup";

export class ClientError extends Error {
  constructor(code, msg) {
    super(msg);
    this.code = code;
    this.message = msg;
  }
}

const api = (method) => (schema, handler) => async (req, res) => {
  if (req.method !== method) {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  let input;
  try {
    input = await schema.validate(req.method === "GET" ? req.query : req.body);
  } catch (e) {
    if (e instanceof ValidationError) {
      const message = "Invalid request data";
      const { path, errors } = e;
      console.log(e);
      res.status(400).json({ message, path, errors });
      return;
    }
    throw e;
  }
  let output;
  try {
    output = await handler(input, req, res);
  } catch (e) {
    if (e instanceof ClientError) {
      const { code, message } = e;
      res.status(code).json({ message });
      return;
    }
    throw e;
  }
  if (!res.writableEnded) {
    res.json(output ?? {});
  }
};

export const getApi = api("GET");
export const postApi = api("POST");
