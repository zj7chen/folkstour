import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import submit from "client/submit";
import { GENDER } from "client/choices";
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
      <Modal show={!showConfirm} centered onHide={onHide}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPass: "",
            signingUp: false,
          }}
          onSubmit={async ({ signingUp, email, password }) => {
            await submit(signingUp ? "/api/signup" : "/api/login", {
              email,
              password,
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
                  <Form.Group controlId="confirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      value={values.confirmPass}
                      onChange={handleChange}
                      type="password"
                      placeholder="Confirm Password"
                    />
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
