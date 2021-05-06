import NavBar from "components/NavBar";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styles from "./StickyLayout.module.css";

function StickyLayout({ side, main, flipped }) {
  return (
    <>
      <NavBar />
      <Container className={styles.container} fluid="xl">
        <Row>
          {!flipped && (
            <Col className={styles.sidebar} md={4}>
              {side}
            </Col>
          )}
          <Col className={styles.content} md={8}>
            {main}
          </Col>
          {flipped && (
            <Col className={styles.sidebar} md={4}>
              {side}
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

export default StickyLayout;
