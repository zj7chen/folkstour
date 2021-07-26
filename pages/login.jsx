import { GENDERS } from "client/choices";
import submit from "client/submit";
import { loginSignupSchema } from "client/validate";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Feedback from "react-bootstrap/Feedback";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import styles from "./login.module.css";

function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { redirect } = router.query;
  return (
    <div className={styles.background}>
      <div className={styles.modal}>
        <Modal.Dialog
          className={styles.dialog}
          contentClassName={styles.dialogContent}
        >
          <Formik
            validationSchema={loginSignupSchema}
            initialValues={{
              email: "",
              password: "",
              confirmPass: "",
              name: "",
              gender: "",
              signingUp: false,
              remember: false,
            }}
            onSubmit={async ({
              signingUp,
              email,
              password,
              name,
              gender,
              remember,
            }) => {
              setError("");
              try {
                if (signingUp) {
                  await submit("/api/signup", {
                    email,
                    password,
                    name,
                    gender,
                    remember,
                  });
                } else {
                  await submit("/api/login", { email, password, remember });
                }
              } catch (e) {
                setError("Incorrect email or password, please try again");
                return;
              }
              router.replace(redirect ?? "/");
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Modal.Header>
                  <Modal.Title as="h1">
                    {values.signingUp
                      ? "Create your account"
                      : "Sign in to FolksTour"}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="email"
                      placeholder="Enter email"
                      isInvalid={touched.email && !!errors.email}
                      autoFocus
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="password"
                      placeholder="Password"
                      isInvalid={touched.password && !!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {values.signingUp && (
                    <>
                      <Form.Group controlId="confirmPass">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          value={values.confirmPass}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="password"
                          placeholder="Confirm Password"
                          isValid={touched.confirmPass && !errors.confirmPass}
                          isInvalid={
                            touched.confirmPass && !!errors.confirmPass
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPass}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="text"
                          placeholder="What would you like to be called?"
                          isValid={touched.name && !errors.name}
                          isInvalid={touched.name && !!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>

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
                                onBlur={handleBlur}
                                checked={values.gender === key}
                              />
                            )
                          )}
                        </div>
                        <Form.Text className="text-muted">
                          Gender will affect you when trips have gender
                          requirements
                        </Form.Text>
                        <Feedback type="invalid" style={{ display: "block" }}>
                          {touched.gender && errors.gender}
                        </Feedback>
                      </Form.Group>
                    </>
                  )}
                  <Form.Group controlId="remember">
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                      checked={values.remember}
                      onChange={handleChange}
                    />
                  </Form.Group>
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
