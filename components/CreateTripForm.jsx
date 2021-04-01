import LocationInput from "components/LocationInput";
import DateInput from "components/DateInput";
import { Formik, Form, Field, ErrorMessage } from "formik";

function CreateTripForm(props) {
  return (
    <Formik
      initialValues={{
        departure: null,
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
      // 这个set time out做什么？
      // 需要加个 resetForm() 吗？
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <label htmlFor="departure">Departure</label>
          <Field
            id="departure"
            name="departure"
            component={LocationInput}
            placeholder="Where do you start?"
          />

          <label htmlFor="destination">Destination</label>
          <Field
            id="destination"
            name="destination"
            component={LocationInput}
            placeholder="Where do you go?"
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
