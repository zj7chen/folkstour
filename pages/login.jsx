import { GENDERS } from "client/choices";
import submit from "client/submit";
import { Formik } from "formik";
import { useRouter } from "next/router";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import styles from "./login.module.css";

function LoginPage() {
  // useEffect(() => {
  //   if (mismatch) {
  //     setError("Passwords do not match.");
  //   } else {
  //     setError("");
  //   }
  // }, [mismatch]);
  const router = useRouter();
  const { redirect } = router.query;
  return (
    <div className={styles.background}>
      <div className={styles.modal}>
        <Modal.Dialog
          className={styles.dialog}
          contentClassName={styles.dialogContent}
        >
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirmPass: "",
              name: "",
              gender: "",
              signingUp: false,
            }}
            onSubmit={async ({ signingUp, email, password, name, gender }) => {
              await submit(signingUp ? "/api/signup" : "/api/login", {
                email,
                password,
                name,
                gender,
              });
              router.replace(redirect ?? "/search-trip");
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              setFieldValue,
              values,
              touched,
              isValid,
              errors,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Modal.Header>
                  <Modal.Title as="h1">
                    {values.signingUp
                      ? "Create your account"
                      : "Sign in to TripMate"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      value={values.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="Enter email"
                    />
                  </Form.Group>

                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      value={values.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>

                  {values.signingUp && (
                    <Form.Group controlId="confirmPass">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        value={values.confirmPass}
                        onChange={handleChange}
                        type="password"
                        placeholder="Confirm Password"
                      />
                    </Form.Group>
                  )}

                  {values.signingUp && (
                    <Form.Group controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        value={values.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="What would you like to be called?"
                      />
                    </Form.Group>
                  )}

                  {values.signingUp && (
                    <Form.Group controlId="gender">
                      <Form.Label>Gender</Form.Label>
                      <div>
                        {Object.entries(GENDERS).map(
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
                      <Form.Text className="text-muted">
                        Gender will affect you when trips have gender
                        requirements
                      </Form.Text>
                    </Form.Group>
                  )}

                  {errors.mismatch && (
                    <Alert variant="danger">{errors.mismatch}</Alert>
                  )}

                  {!values.signingUp && (
                    <Form.Group controlId="remember">
                      <Form.Check type="checkbox" label="Remember me" />
                    </Form.Group>
                  )}

                  {values.signingUp && (
                    <Form.Group controlId="agree">
                      <Form.Check
                        type="checkbox"
                        label="Agree to terms and conditions"
                      />
                    </Form.Group>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="link"
                    onClick={() =>
                      setFieldValue("signingUp", !values.signingUp)
                    }
                  >
                    {values.signingUp
                      ? "Already have an account?"
                      : "Create an account"}
                  </Button>
                  <Button type="submit" variant="primary">
                    {values.signingUp ? "Sign up" : "Sign in"}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Dialog>
      </div>
    </div>
  );
}

export default LoginPage;
