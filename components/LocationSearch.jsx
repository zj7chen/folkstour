import { Field, Formik } from "formik";
import FormikAdaptor from "components/FormikAdaptor";
import LocationInput from "components/LocationInput";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Search from "components/icons/Search";
import styles from "./LocationSearch.module.css";
import { useRouter } from "next/router";

const FormikLocation = FormikAdaptor(LocationInput);

function LocationSearch() {
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
            component={FormikLocation}
            placeholder="Where do you want to go?"
          />
          <button type="submit" className={styles.search}>
            <Search />
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default LocationSearch;
