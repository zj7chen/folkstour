import CreateTripForm from "components/CreateTripForm";
import StickyLayout from "components/StickyLayout";

function CreateTripPage() {
  return (
    <StickyLayout side={<p>Useful tips</p>} main={<CreateTripForm />} flipped />
  );
}

export default CreateTripPage;
