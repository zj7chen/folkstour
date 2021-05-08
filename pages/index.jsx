import Container from "react-bootstrap/Container";
import styles from "./index.module.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import LocationSearch from "components/LocationSearch";

function HomePage() {
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
          <Button variant="outline-light" onClick={() => setShowLogin(true)}>
            Login
          </Button>
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
