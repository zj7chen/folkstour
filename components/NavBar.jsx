import submit from "client/submit";
import Avatar from "components/Avatar";
import LocationSearch from "components/LocationSearch";
import searchStyles from "components/LocationSearchNav.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styles from "./NavBar.module.css";

function NavBar({ currentUser, landing }) {
  const router = useRouter();
  return (
    <Navbar
      bg={landing ? undefined : "light"}
      variant={landing ? "dark" : "light"}
      expand="md"
      sticky="top"
      style={{ minHeight: "3.5rem" }}
    >
      <Link href="/" passHref>
        <Navbar.Brand>TripMate</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {!landing && (
          <div className={styles.content}>
            <LocationSearch styles={searchStyles} />
            <Nav>
              <Link href="/create-trip" passHref>
                <Nav.Link>Create Trip</Nav.Link>
              </Link>
            </Nav>
          </div>
        )}
        <Nav className={styles.user}>
          {currentUser !== null ? (
            <>
              <NavDropdown title={currentUser.name} alignRight>
                <Link href={`profile?id=${currentUser.id}`} passHref>
                  <NavDropdown.Item>View profile</NavDropdown.Item>
                </Link>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={async () => {
                    await submit("/api/logout", {});
                    router.replace(router.asPath);
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
              <Link href={`profile?id=${currentUser.id}`}>
                <a>
                  <Avatar hash={currentUser.avatarHash} />
                </a>
              </Link>
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
