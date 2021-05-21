import * as yup from "yup";

export { yup };

export const tripIdSchema = yup.number().integer();

export const userIdSchema = yup.number().integer();

// TODO: verify it's in our location list
export const locationSchema = yup.object().shape({
  country: yup.string().required(),
  province: yup.string().required(),
  city: yup.string().required(),
});

export const dateSchema = yup.string().transform(function (value) {
  if (!this.isType(value) || value === null) return value;
  return new Date(value + "T00:00:00.000Z");
});

export const nameSchema = yup.string().max(40);

// TODO: check ascii to ensure 76-byte limit
export const passwordSchema = yup.string().max(76);

export const selfIntroSchema = yup.string().max(4000);

export const tripTitleSchema = yup.string().max(190);

export const tripDescriptionSchema = yup.string().max(4000);
