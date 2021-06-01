import countries from "cities.json";
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

export const locationSchema = yup
  .mixed()
  .transform(function (value) {
    return yup
      .object()
      .shape({
        country: yup.string().required(),
        province: yup.string().required(),
        city: yup.string().required(),
      })
      .noUnknown()
      .validateSync(value);
  })
  .test(
    "city-exists",
    "city does not exist",
    (v) => !v || countries[v.country]?.[v.province]?.[v.city] !== undefined
  );

export const dateSchema = yup.mixed().transform(function (value) {
  if (!value) return null;
  if (typeof value !== "string") return new Date("");
  return new Date(value + "T00:00:00.000Z");
});

export const nameSchema = yup.string().max(40);

export const expenseSchema = yup.number().positive();

export const genderSchema = yup.mixed().oneOf(Object.keys(GENDERS));

export const teamSizeSchema = yup.mixed().oneOf(Object.keys(TEAM_SIZES));

export const transportSchema = yup.mixed().oneOf(Object.keys(TRANSPORTS));

export const genderRequirementSchema = yup
  .mixed()
  .oneOf(Object.keys(GENDER_REQUIREMENTS));

export const passwordSchema = yup
  .string()
  .matches(/[\x20-\x7e]+/)
  .max(76);

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
    .of(transportSchema)
    .min(1, "at least ${min} transport must be selected"),
  title: tripTitleSchema.required(),
  description: tripDescriptionSchema,
  teamSize: teamSizeSchema.required(),
  expense: expenseSchema.required(),
  gender: genderRequirementSchema.required(),
});

export const searchTripSchema = yup.object().shape({
  title: tripTitleSchema,
  location: locationSchema,
  dates: yup
    .array()
    .of(dateSchema)
    .length(2)
    .test(
      "start-before-end",
      "end date must not be earlier than start date",
      (dates) => {
        if (!dates) return true;
        const [start, end] = dates;
        return start <= end;
      }
    ),
  teamsize: yup.array().of(teamSizeSchema),
  transports: yup.array().of(transportSchema),
  expense: expenseSchema,
});
