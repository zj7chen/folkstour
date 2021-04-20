import NavBar from "components/NavBar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Field, Formik } from "formik";
import Button from "react-bootstrap/Button";
import submit from "client/submit";
import admin from "server/server";
import prisma from "server/prisma";

function ProfilePage({ user }) {
  return (
    <div>
      <NavBar />
      <Container fluid="xl">
        <Formik
          initialValues={{}}
          // Where did we get avatar from?
          onSubmit={async ({ avatar }) => {
            const bytes = await new Promise((res) => {
              const reader = new FileReader();
              reader.readAsBinaryString(avatar);
              reader.onloadend = () => res(reader.result);
            });
            await submit("/api/update-profile", { avatar: btoa(bytes) });
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <img
                  src={`data:image/png;base64,${user.avatar}`}
                  className="mw-100"
                />
                <Form.File
                  id="avatar"
                  name="avatar"
                  label="Select file"
                  onChange={(e) => {
                    const { name, files } = e.currentTarget;
                    setFieldValue(name, files[0]);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="selfIntro">
                <Form.Label>Self Intro</Form.Label>
                <Form.Control as="textarea" rows={6} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const sessionCookie = req.cookies.session || "";
  // firebase-admin
  const decodedClaims = await admin
    .auth()
    .verifySessionCookie(sessionCookie, true);
  const { selfIntro, avatar } = await prisma.user.findUnique({
    select: {
      selfIntro: true,
      avatar: true,
    },
    where: {
      // id: id
      id: decodedClaims.uid,
    },
  });
  return {
    props: {
      user: {
        selfIntro,
        avatar: avatar.toString("base64"),
      },
    },
  };
}
export default ProfilePage;
