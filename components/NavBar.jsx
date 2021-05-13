import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import LocationSearch from "components/LocationSearch";
import searchStyles from "components/LocationSearchNav.module.css";
import styles from "./NavBar.module.css";

function NavBar(props) {
  const router = useRouter();
  return (
    <Navbar bg="light" expand="md" sticky="top" style={{ minHeight: "3.5rem" }}>
      <Navbar.Brand href="#home">TripMate</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <div className={styles.content}>
          <LocationSearch styles={searchStyles} />
          <Nav>
            <Link href="/dashboard" passHref>
              <Nav.Link>Dashboard</Nav.Link>
            </Link>
            <Link href="/create-trip" passHref>
              <Nav.Link>Create Trip</Nav.Link>
            </Link>
          </Nav>
        </div>
        <Nav className="ml-auto">
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
