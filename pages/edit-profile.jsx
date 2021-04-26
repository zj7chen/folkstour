import submit from "client/submit";
import Avatar from "components/Avatar";
import NavBar from "components/NavBar";
import { Formik } from "formik";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import prisma from "server/prisma";
import { getSession } from "server/session";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

function EditProfilePage({ user }) {
  return (
    <div>
      <NavBar />
      <Container fluid="xl">
        <Formik
          initialValues={user}
          onSubmit={async (value) => {
            await submit("/api/update-profile", value);
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Avatar content={values.avatar} />
                <Form.File
                  id="avatar"
                  name="avatar"
                  label="Select file"
                  onChange={async (e) => {
                    const { name, files } = e.currentTarget;
                    const reader = new FileReader();
                    reader.readAsBinaryString(files[0]);
                    await new Promise((res) => (reader.onloadend = res));
                    setFieldValue(name, btoa(reader.result));
                  }}
                />
              </Form.Group>
              <Form.Group controlId="selfIntro">
                <Form.Label>Self Intro</Form.Label>
                <MarkdownEditor
                  initialValue={user.selfIntro}
                  onChange={(value) => {
                    setFieldValue("selfIntro", value);
                  }}
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
  const { userId } = await getSession(req);
  const { selfIntro, avatar } = await prisma.user.findUnique({
    select: {
      selfIntro: true,
      avatar: true,
    },
    where: {
      id: userId,
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
