import countries from "cities.json";
import submit from "client/submit";
import DateInput from "components/DateInput";
import LocationInput from "components/LocationInput";
import { Field, Form, Formik } from "formik";
import FormikAdaptor from "./FormikAdaptor";
import RouteMap from "./RouteMap";
import {
  TEAM_SIZES,
  TEAM_SIZE_DEFAULT,
  TRANSPORTS,
  GENDERS,
  GENDER_DEFAULT,
} from "client/choices";

const FormikLocation = FormikAdaptor(LocationInput);
const FormikDate = FormikAdaptor(DateInput);

function CreateTripForm(props) {
  return (
    <Formik
      initialValues={{
        // City[]
        locations: [],
        dates: { start: null, end: null },
        teamSize: TEAM_SIZE_DEFAULT,
        transports: [],
        gender: GENDER_DEFAULT,
      }}
      validate={(values) => {
        const errors = {};
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        submit("/api/create-trip", values).finally(() => {
          setSubmitting(false);
        });
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            name="title"
            placeholder="Give your trip an attractive title"
          />

          <label htmlFor="locations">Locations</label>
          <Field
            id="locations"
            name="locations"
            component={FormikLocation}
            placeholder="Enter the places of your trip"
            isMulti
          />

          <RouteMap
            locations={values.locations.map(
              (city) => countries[city.country][city.province][city.city]
            )}
          />

          <label htmlFor="dates">Choose your dates</label>
          <br></br>
          <Field id="dates" name="dates" component={FormikDate} />

          <div id="teamSizeGroup">Team Size</div>
          <div role="group" aria-labelledby="teamSizeGroup">
            {Object.entries(TEAM_SIZES).map(([key, { displayText }]) => (
              <label>
                <Field type="radio" name="teamSize" value={key} /> {displayText}
              </label>
            ))}
          </div>

          <div id="transportsGroup">Transport</div>
          <div role="group" aria-labelledby="transportsGroup">
            {Object.entries(TRANSPORTS).map(([key, { displayText }]) => (
              <label>
                <Field type="checkbox" name="transports" value={key} />{" "}
                {displayText}
              </label>
            ))}
          </div>

          <div id="genderGroup">Gender</div>
          <div role="group" aria-labelledby="genderGroup">
            {Object.entries(GENDERS).map(([key, { displayText }]) => (
              <label>
                <Field type="radio" name="gender" value={key} /> {displayText}
              </label>
            ))}
          </div>

          <label htmlFor="expense">Expense Estimate ($/day)</label>
          {/* 是否该用 br 来 换行？*/}
          <br></br>
          <Field id="expense" name="expense" placeholder="e.g. 300" />

          <label htmlFor="description">Description</label>
          <Field
            id="description"
            name="description"
            as="textarea"
            placeholder="Please state any further details about the trip here"
          />

          {/* 是否该用 br 来 换行？*/}
          <br></br>
          <br></br>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default CreateTripForm;
