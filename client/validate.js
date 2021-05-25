import {
  GENDERS,
  GENDER_REQUIREMENTS,
  TEAM_SIZES,
  TRANSPORTS,
} from "client/choices";
import * as yup from "yup";

export { yup };

export const tripIdSchema = yup.number().integer();

export const userIdSchema = yup.number().integer();

// TODO: verify it's in our location list
// TODO: reject extra properties
export const locationSchema = yup.object().shape({
  country: yup.string().required(),
  province: yup.string().required(),
  city: yup.string().required(),
});

export const dateSchema = yup.mixed().transform(function (value) {
  if (!value) return null;
  if (typeof value !== "string") return new Date("");
  return new Date(value + "T00:00:00.000Z");
});

export const nameSchema = yup.string().max(40);

export const genderSchema = yup.mixed().oneOf(Object.keys(GENDERS));

export const genderRequirementSchema = yup
  .mixed()
  .oneOf(Object.keys(GENDER_REQUIREMENTS));

// TODO: check ascii to ensure 76-byte limit
export const passwordSchema = yup.string().max(76);

export const selfIntroSchema = yup.string().max(4000);

export const tripTitleSchema = yup.string().max(190);

export const tripDescriptionSchema = yup.string().max(4000);

export const loginSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: passwordSchema.required(),
});

export const loginSignupSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: passwordSchema.required(),
  confirmPass: yup.mixed().when("signingUp", {
    is: true,
    then: passwordSchema
      .required()
      .test(
        "match-password",
        "Passwords do not match",
        (value, testContext) => value === testContext.parent.password
      ),
  }),
  name: yup
    .mixed()
    .when("signingUp", { is: true, then: nameSchema.required() }),
  gender: yup
    .mixed()
    .when("signingUp", { is: true, then: genderSchema.required() }),
  signingUp: yup.boolean().required(),
  remember: yup.boolean().required(),
});

export const tripSchema = yup.object().shape({
  locations: yup
    .array()
    .required()
    .of(locationSchema)
    .min(1, "at least ${min} location must be selected"),
  dates: yup
    .object()
    .shape({
      start: dateSchema.required("start date is required"),
      end: dateSchema.required("end date is required"),
    })
    .test(
      "start-before-end",
      "end date must not be earlier than start date",
      ({ start, end }) => start <= end
    ),
  transports: yup
    .array()
    .required()
    .of(yup.mixed().oneOf(Object.keys(TRANSPORTS)))
    .min(1, "at least ${min} transport must be selected"),
  title: tripTitleSchema.required(),
  description: tripDescriptionSchema,
  teamSize: yup.mixed().required().oneOf(Object.keys(TEAM_SIZES)),
  expense: yup.number().required().positive(),
  gender: genderRequirementSchema.required(),
});
