import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

function Login(props) {
  const [signingUp, setSigningUp] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  const mismatch = signingUp && password !== confirmPass;

  useEffect(() => {
    if (mismatch) {
      setError("Passwords do not match.");
    } else {
      setError("");
    }
  }, [mismatch]);

  function signup(e) {
    e.preventDefault();
    setError("");
    fetch("/api/signup", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => {
      if (res.status === 200) {
        setShowConfirm(true);
        // if onHide is undefined, the expression will return undefined, else call function
        //props.onHide?.();
      } else {
        res.json().then((error) => {
          setError(error.message);
        });
      }
    });
  }

  function login(e) {
    e.preventDefault();
    setError("");
    fetch("/api/login", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => {
      if (res.status === 200) {
        // if onHide is undefined, the expression will return undefined, else call function
        props.onHide?.();
      } else {
        res.json().then((error) => {
          setError(error.message);
        });
      }
    });
  }

  return (
    <>
      {/* Confirm Email Popup */}
      <Modal show={showConfirm} centered onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm your email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please verify your account in {email} for confirmation.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Login / Signup Popup */}
      <Modal show={!showConfirm} centered onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{signingUp ? "Sign up" : "Login"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </Form.Group>

            {signingUp && (
              <Form.Group controlId="confirm">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  type="password"
                  placeholder="Confirm Password"
                />
              </Form.Group>
            )}

            {error !== "" && <Alert variant="danger">{error}</Alert>}

            {!signingUp && (
              <Form.Group controlId="remember">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            onClick={() => {
              setSigningUp(!signingUp);
              setError("");
            }}
          >
            {signingUp ? "Already have an account?" : "Create an account"}
          </Button>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={mismatch}
            onClick={signingUp ? signup : login}
          >
            {signingUp ? "Sign up" : "Login"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Login;
