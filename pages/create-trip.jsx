import NavBar from "components/NavBar";
import CreateTripForm from "components/CreateTripForm";
import Container from "react-bootstrap/Container";

function CreateTripPage() {
  return (
    <div>
      <NavBar />
      <Container fluid="lg">
        <CreateTripForm />
      </Container>
    </div>
  );
}

export default CreateTripPage;
