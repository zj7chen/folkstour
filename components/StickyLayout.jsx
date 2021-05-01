import NavBar from "components/NavBar";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styles from "./StickyLayout.module.css";

function StickyLayout({ left, right }) {
  return (
    <>
      <NavBar />
      <Container className={styles.container} fluid="xl">
        <Row>
          <Col className={styles.sidebar} md={4}>
            {left}
          </Col>
          <Col className={styles.content} md={8}>
            {right}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default StickyLayout;
