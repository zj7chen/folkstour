import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
import LocationInput from "components/LocationInput";
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
            placeholder="Where do you want to meet?"
          />

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

          <label htmlFor="expense">Expense estimate (day)</label>
          <Field id="expense" name="expense" placeholder="e.g. 300" />

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default CreateTripForm;
