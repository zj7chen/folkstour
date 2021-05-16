import Home from "components/Home";
import { withSessionProps } from "server/session";

function HomePage(props) {
  return <Home {...props} />;
}

export const getServerSideProps = withSessionProps(
  () => {
    return { props: {} };
  },
  { optional: true }
);

export default HomePage;
