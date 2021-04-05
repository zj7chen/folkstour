import LocationInput from "components/LocationInput";
import DateInput from "components/DateInput";
import { Formik, Form, Field, ErrorMessage } from "formik";
import submit from "client/submit";
import RouteMap from "./RouteMap";
import countries from "cities.json";

// date: must be moment.js date
function localToISODate(date) {
  console.log(date);
  return new Date(date.format("YYYY-MM-DD") + "T00:00:00.000Z").toISOString();
}

function CreateTripForm(props) {
  return (
    <Formik
      initialValues={{
        // {country, province, city}[]
        locations: [],
        // teamSize options: "1-3", "4-6", "any"
        teamSize: "1-3",
        // transport allowed: "driving", "cycling", "trekking"
        transport: [],
        // gender options: "any", "male", "female"
        gender: "any",
      }}
      validate={(values) => {
        const errors = {};
        return errors;
      }}
      onSubmit={({ travelDates, ...values }, { setSubmitting }) => {
        submit("/api/create-trip", {
          tripBeginTime: localToISODate(travelDates.start),
          tripEndTime: localToISODate(travelDates.end),
          ...values,
        }).finally(() => {
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
            component={LocationInput}
            placeholder="Enter the places of your trip"
          />

          <RouteMap
            locations={values.locations.map(
              (city) => countries[city.country][city.province][city.city]
            )}
          />

          <label htmlFor="travelDates">Choose your dates</label>
          {/* 是否该用 br 来 换行？*/}
          <br></br>
          <Field id="travelDates" name="travelDates" component={DateInput} />

          <div id="teamSizeGroup">Team Size</div>
          <div role="group" aria-labelledby="teamSizeGroup">
            <label>
              <Field type="radio" name="teamSize" value="1-3" /> 1-3
            </label>
            <label>
              <Field type="radio" name="teamSize" value="4-6" /> 4-6
            </label>
            <label>
              <Field type="radio" name="teamSize" value="any" /> Any
            </label>
          </div>

          <div id="transportGroup">Transport</div>
          <div role="group" aria-labelledby="transportGroup">
            <label>
              <Field type="checkbox" name="transport" value="driving" /> Driving
            </label>
            <label>
              <Field type="checkbox" name="transport" value="cycling" /> Cycling
            </label>
            <label>
              <Field type="checkbox" name="transport" value="trekking" />{" "}
              Trekking
            </label>
          </div>

          <div id="genderGroup">Gender</div>
          <div role="group" aria-labelledby="transportGroup">
            <label>
              <Field type="radio" name="gender" value="any" /> Any
            </label>
            <label>
              <Field type="radio" name="gender" value="male" /> Male
            </label>
            <label>
              <Field type="radio" name="gender" value="female" /> Female
            </label>
          </div>

          <label htmlFor="expense">Expense estimate ($/day)</label>
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
