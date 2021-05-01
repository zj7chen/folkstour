import Login from "components/Login";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavBar(props) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Navbar bg="light" expand="md" sticky="top" style={{ minHeight: "3.5rem" }}>
      <Navbar.Brand href="#home">TripMate</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {/* display is boolean by default is false */}
          {props.displayMenu && (
            <>
              <Nav.Link href="#home">Find Buddy</Nav.Link>
              <Nav.Link href="#link">Team</Nav.Link>
            </>
          )}
        </Nav>

        {showLogin && <Login onHide={() => setShowLogin(false)} />}

        <Button variant="primary" onClick={() => setShowLogin(true)}>
          Login
        </Button>

        {/* TODO: Logout Button */}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
