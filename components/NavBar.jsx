import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavBar(props) {
  const router = useRouter();
  return (
    <Navbar bg="light" expand="md" sticky="top" style={{ minHeight: "3.5rem" }}>
      <Navbar.Brand href="#home">TripMate</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto"></Nav>

        <Nav>
          <Link
            href={`/login?${new URLSearchParams({
              redirect: router.asPath,
            })}`}
            passHref
          >
            <Nav.Link>Sign in</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
