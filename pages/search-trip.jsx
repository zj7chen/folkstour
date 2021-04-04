import NavBar from "components/NavBar";
import CreateTripForm from "components/CreateTripForm";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function SearchTripPage() {
  return (
    <div>
      <NavBar />
      <Container fluid="lg">
        <Row>
          <Col md={4}>Search</Col>
          <Col md={8}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default SearchTripPage;
