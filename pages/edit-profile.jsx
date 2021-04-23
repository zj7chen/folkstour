import NavBar from "components/NavBar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Field, Formik } from "formik";
import Button from "react-bootstrap/Button";
import submit from "client/submit";
import admin from "server/server";
import prisma from "server/prisma";
import Avatar from "components/Avatar";

function EditProfilePage({ user }) {
  return (
    <div>
      <NavBar />
      <Container fluid="xl">
        <Formik
          initialValues={{}}
          onSubmit={async ({ avatar, ...rest }) => {
            if (avatar) {
              const bytes = await new Promise((res) => {
                const reader = new FileReader();
                reader.readAsBinaryString(avatar);
                reader.onloadend = () => res(reader.result);
              });
              avatar = btoa(bytes);
            }
            await submit("/api/update-profile", { avatar, ...rest });
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Avatar content={user.avatar} />
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
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={values.selfIntro}
                  onChange={handleChange}
                />
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
      id: decodedClaims.uid,
    },
  });
  return {
    props: {
      user: {
        selfIntro,
        avatar: avatar?.toString("base64") ?? null,
      },
    },
  };
}
export default EditProfilePage;
