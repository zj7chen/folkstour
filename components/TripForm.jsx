import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

function TripForm(props) {
  return (
    <Form>
      <Form.Group controlId="depar">
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
  );
}

export default TripForm;
