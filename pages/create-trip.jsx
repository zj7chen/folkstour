import CreateTripForm from "components/CreateTripForm";
import StickyLayout from "components/StickyLayout";
import { withSessionProps } from "server/session";

function CreateTripPage({ currentUser }) {
  return (
    <StickyLayout
      currentUser={currentUser}
      side={<p>Useful tips</p>}
      main={
        <>
          <h1>Create a New Trip</h1>
          <CreateTripForm />
        </>
      }
      flipped
    />
  );
}

export const getServerSideProps = withSessionProps(() => {
  return { props: {} };
});

export default CreateTripPage;
