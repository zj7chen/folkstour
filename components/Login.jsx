import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import submit from "client/submit";
import { GENDERS } from "client/choices";
import { Formik } from "formik";

function Login({ onHide }) {
  // useEffect(() => {
  //   if (mismatch) {
  //     setError("Passwords do not match.");
  //   } else {
  //     setError("");
  //   }
  // }, [mismatch]);

  return (
    <>
      {/* Login / Signup Popup */}
      {/* *************** TODO: Add gender of user when registering *************** */}
      <Modal show centered onHide={onHide}>
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
            // if onHide is undefined, the expression will return undefined, else call function
            onHide?.();
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
              <Modal.Header closeButton>
                <Modal.Title>
                  {values.signingUp ? "Sign up" : "Login"}
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
                      {Object.entries(GENDERS).map(([key, { displayText }]) => (
                        <Form.Check
                          key={key}
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
                    <Form.Text className="text-muted">
                      Gender will affect you when trips have gender requirements
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
                  onClick={() => setFieldValue("signingUp", !values.signingUp)}
                >
                  {values.signingUp
                    ? "Already have an account?"
                    : "Create an account"}
                </Button>
                <Button variant="secondary" onClick={onHide}>
                  Close
                </Button>
                <Button type="submit" variant="primary">
                  {values.signingUp ? "Sign up" : "Login"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Login;
