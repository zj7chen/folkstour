import Avatar from "components/Avatar";
import LocationSearch from "components/LocationSearch";
import searchStyles from "components/LocationSearchNav.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavDropdown } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "./NavBar.module.css";
import submit from "client/submit";

function NavBar({ currentUser }) {
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
        <Nav className={styles.user}>
          {currentUser !== null ? (
            <>
              <NavDropdown title={currentUser.name} alignRight>
                <Link href={`profile?id=${currentUser.id}`} passHref>
                  <NavDropdown.Item>View profile</NavDropdown.Item>
                </Link>
                <NavDropdown.Item
                  onClick={async () => {
                    await submit("/api/logout", {});
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
              <Avatar hash={currentUser.avatarHash} />
            </>
          ) : (
            <Link
              href={`/login?${new URLSearchParams({
                redirect: router.asPath,
              })}`}
              passHref
            >
              <Nav.Link>Sign in</Nav.Link>
            </Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
