import { GENDER_REQUIREMENTS, TEAM_SIZES, TRANSPORTS } from "client/choices";
import {
  dateSchema,
  locationSchema,
  tripDescriptionSchema,
  tripTitleSchema,
  yup,
} from "client/validate";
import { postApi } from "server/api";
import prisma from "server/prisma";
import { getSession } from "server/session";

const schema = yup.object().shape({
  locations: yup.array().required().of(locationSchema),
  dates: yup.object().shape({
    start: dateSchema.required(),
    end: dateSchema.required(),
  }),
  transports: yup
    .array()
    .required()
    .of(yup.mixed().oneOf(Object.keys(TRANSPORTS))),
  title: tripTitleSchema.required(),
  description: tripDescriptionSchema.required(),
  teamSize: yup.mixed().required().oneOf(Object.keys(TEAM_SIZES)),
  expense: yup.number().required().positive(),
  gender: yup.mixed().required().oneOf(Object.keys(GENDER_REQUIREMENTS)),
});

export default postApi(
  schema,
  async (
    {
      locations,
      dates,
      transports,
      title,
      description,
      teamSize,
      expense,
      gender,
    },
    req
  ) => {
    const { userId } = getSession(req);
    const trip = await prisma.trip.create({
      data: {
        locations: {
          createMany: {
            data: locations.map((location, order) => ({
              location,
              order,
            })),
          },
        },
        tripBeginTime: dates.start,
        tripEndTime: dates.end,
        transports: {
          create: transports.map((transport) => ({ transport })),
        },
        title,
        description,
        teamSize,
        expectedExpense: expense,
        genderRequirement: gender,
        author: { connect: { id: userId } },
        reservations: {
          create: {
            userId,
            status: "APPROVED",
          },
        },
      },
    });
    console.log("Created trip:", trip.id);
    return { id: trip.id };
  }
);
