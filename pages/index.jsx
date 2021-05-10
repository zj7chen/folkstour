import LocationSearch from "components/LocationSearch";
import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "./index.module.css";

function HomePage() {
  const router = useRouter();
  return (
    <div>
      <video autoPlay muted loop className={styles.video}>
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <Navbar className={styles.nav} expand="md" variant="dark">
        <Navbar.Brand href="#home">TripMate</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto"></Nav>
          <Nav>
            <Link href="/login" passHref>
              <Nav.Link>Sign in</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <main className={styles.main}>
        <div className={styles.center}>
          <div className={styles.entry}>
            <h1>
              结伴而行
              <br />
              <small>让旅途不再孤单</small>
            </h1>
            <div className="text-body">
              <LocationSearch />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
