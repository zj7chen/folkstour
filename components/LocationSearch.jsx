import FormikAdaptor from "components/FormikAdaptor";
import Search from "components/icons/Search";
import LocationInput from "components/LocationInput";
import { Field, Formik } from "formik";
import { useRouter } from "next/router";
import Form from "react-bootstrap/Form";

const FormikLocation = FormikAdaptor(LocationInput);

function LocationSearch({ styles }) {
  const router = useRouter();
  return (
    <Formik
      initialValues={{ location: null }}
      onSubmit={({ location }) => {
        const query = location
          ? { location: JSON.stringify(location) }
          : undefined;
        router.push({ pathname: "search-trip", query });
      }}
    >
      {({ handleSubmit }) => (
        <Form className={styles.form} onSubmit={handleSubmit}>
          <Field
            id="location"
            name="location"
            className={styles.field}
            component={FormikLocation}
            placeholder="Where do you want to go?"
          />
          <button type="submit" className={styles.button}>
            <Search />
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default LocationSearch;
