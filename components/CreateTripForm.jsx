import countries from "cities.json";
import {
  GENDER_REQUIREMENTS,
  GENDER_REQUIREMENT_DEFAULT,
  TEAM_SIZES,
  TEAM_SIZE_DEFAULT,
  TRANSPORTS,
} from "client/choices";
import submit from "client/submit";
import { tripSchema } from "client/validate";
import DateInput from "components/DateInput";
import FormikAdaptor from "components/FormikAdaptor";
import LocationInput from "components/LocationInput";
import RouteMap from "components/RouteMap";
import { Field, Formik } from "formik";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Feedback from "react-bootstrap/Feedback";
import Form from "react-bootstrap/Form";

const FormikLocation = FormikAdaptor(LocationInput);
const FormikDate = FormikAdaptor(DateInput);

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

function CreateTripForm() {
  const router = useRouter();
  return (
    <Formik
      validationSchema={tripSchema}
      initialValues={{
        title: "",
        // City[]
        locations: [],
        dates: { start: null, end: null },
        teamSize: TEAM_SIZE_DEFAULT,
        transports: [],
        gender: GENDER_REQUIREMENT_DEFAULT,
        expense: "",
        description: "",
      }}
      onSubmit={async (values) => {
        const { id } = await submit("/api/create-trip", values);
        router.push({ pathname: "trip", query: { id: id } });
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
        setFieldValue,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.title && !errors.title}
              isInvalid={touched.title && !!errors.title}
              placeholder="Give your trip an attractive title"
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="locations">
            <Form.Label>Locations</Form.Label>
            <Field
              id="locations"
              name="locations"
              component={FormikLocation}
              onBlur={handleBlur}
              placeholder="Enter the places of your trip"
              isMulti
            />
            <Feedback type="invalid" style={{ display: "block" }}>
              {touched.locations && errors.locations}
            </Feedback>
            <RouteMap
              locations={values.locations.map(
                (city) => countries[city.country][city.province][city.city]
              )}
            />
          </Form.Group>

          <Form.Group controlId="dates">
            <Form.Label>Choose your dates</Form.Label>
            <Field id="dates" name="dates" component={FormikDate} />
          </Form.Group>

          <Form.Group controlId="teamSize">
            <Form.Label>Team Size</Form.Label>
            <div>
              {Object.entries(TEAM_SIZES).map(([key, { displayText }]) => (
                <Form.Check
                  key={key}
                  id={`teamSize-${key}`}
                  inline
                  type="radio"
                  label={displayText}
                  name="teamSize"
                  value={key}
                  onChange={handleChange}
                  checked={values.teamSize === key}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group controlId="transports">
            <Form.Label>Transport</Form.Label>
            <div>
              {Object.entries(TRANSPORTS).map(([key, { displayText }]) => (
                <Form.Check
                  key={key}
                  id={`transports-${key}`}
                  inline
                  type="checkbox"
                  label={displayText}
                  name="transports"
                  value={key}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.transports && !!errors.transports}
                  checked={values.transports.indexOf(key) !== -1}
                />
              ))}
            </div>
            <Feedback type="invalid" style={{ display: "block" }}>
              {touched.transports && errors.transports}
            </Feedback>
          </Form.Group>

          <Form.Group controlId="gender">
            <Form.Label>Gender</Form.Label>
            <div>
              {Object.entries(GENDER_REQUIREMENTS).map(
                ([key, { displayText }]) => (
                  <Form.Check
                    key={key}
                    id={`gender-${key}`}
                    inline
                    type="radio"
                    label={displayText}
                    name="gender"
                    value={key}
                    onChange={handleChange}
                    checked={values.gender === key}
                  />
                )
              )}
            </div>
          </Form.Group>

          <Form.Group controlId="expense">
            <Form.Label>Expense Estimate ($/day)</Form.Label>
            <Form.Control
              type="number"
              value={values.expense}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.expense && !errors.expense}
              isInvalid={touched.expense && !!errors.expense}
              placeholder="e.g. 300"
            />
            <Form.Control.Feedback type="invalid">
              {errors.expense}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <MarkdownEditor
              initialValue={values.description}
              onChange={(value) => {
                setFieldValue("description", value);
              }}
              placeholder="Please state any further details about the trip here"
            />
            <Form.Text className="text-muted">
              Maximum of 4000 characters
            </Form.Text>
            <Feedback type="invalid" style={{ display: "block" }}>
              {errors.description}
            </Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default CreateTripForm;
