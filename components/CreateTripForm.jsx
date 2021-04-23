import countries from "cities.json";
import {
  GENDERS,
  GENDER_DEFAULT,
  TEAM_SIZES,
  TEAM_SIZE_DEFAULT,
  TRANSPORTS,
} from "client/choices";
import submit from "client/submit";
import DateInput from "components/DateInput";
import FormikAdaptor from "components/FormikAdaptor";
import LocationInput from "components/LocationInput";
import RouteMap from "components/RouteMap";
import { Field, Formik } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const FormikLocation = FormikAdaptor(LocationInput);
const FormikDate = FormikAdaptor(DateInput);

function CreateTripForm(props) {
  return (
    <Formik
      initialValues={{
        title: "",
        // City[]
        locations: [],
        dates: { start: null, end: null },
        teamSize: TEAM_SIZE_DEFAULT,
        transports: [],
        gender: GENDER_DEFAULT,
        expense: "",
        description: "",
      }}
      onSubmit={async (values) => {
        await submit("/api/create-trip", values);
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={values.title}
              onChange={handleChange}
              placeholder="Give your trip an attractive title"
            />
          </Form.Group>

          <Form.Group controlId="locations">
            <Form.Label>Locations</Form.Label>
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
                  id={`teamSize-${key}`}
                  inline
                  type="radio"
                  label={displayText}
                  name="teamSize"
                  value={key}
                  onChange={handleChange}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group controlId="transports">
            <Form.Label>Transport</Form.Label>
            <div>
              {Object.entries(TRANSPORTS).map(([key, { displayText }]) => (
                <Form.Check
                  id={`transports-${key}`}
                  inline
                  type="checkbox"
                  label={displayText}
                  name="transports"
                  value={key}
                  onChange={handleChange}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group controlId="gender">
            <Form.Label>Gender</Form.Label>
            <div>
              {Object.entries(GENDERS).map(([key, { displayText }]) => (
                <Form.Check
                  id={`gender-${key}`}
                  inline
                  type="radio"
                  label={displayText}
                  name="gender"
                  value={key}
                  onChange={handleChange}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group controlId="expense">
            <Form.Label>Expense Estimate ($/day)</Form.Label>
            <Form.Control
              type="number"
              value={values.expense}
              onChange={handleChange}
              placeholder="e.g. 300"
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={values.description}
              onChange={handleChange}
              placeholder="Please state any further details about the trip here"
            />
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
