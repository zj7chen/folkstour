import NavBar from "components/NavBar";
import CreateTripForm from "components/CreateTripForm";
import Container from "react-bootstrap/Container";

function HomePage() {
  return (
    <div>
      <NavBar />
      <Container fluid="lg">
        <CreateTripForm />
      </Container>
    </div>
  );
}

export default HomePage;
