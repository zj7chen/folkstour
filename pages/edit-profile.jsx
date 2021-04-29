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
import { useRef } from "react";
import Cropper from "react-cropper";

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

function EditProfilePage({ user }) {
  const cropperRef = useRef(null);
  return (
    <div>
      <NavBar />
      <Container fluid="xl">
        <Formik
          initialValues={user}
          onSubmit={async ({ selfIntro }) => {
            const cropper = cropperRef.current.cropper;
            const avatar = cropper
              .getCroppedCanvas()
              .toDataURL()
              .split(";base64,")[1];
            await submit("/api/update-profile", { avatar, selfIntro });
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Cropper
                  // Cropper.js options
                  initialAspectRatio={1 / 1}
                  guides={false}
                  ref={cropperRef}
                />
                <Form.File
                  id="avatar"
                  name="avatar"
                  label="Select file"
                  onChange={async (e) => {
                    const { name, files } = e.currentTarget;
                    if (files.length === 0) return;
                    const reader = new FileReader();
                    reader.readAsDataURL(files[0]);
                    await new Promise((res) => (reader.onloadend = res));
                    const cropper = cropperRef.current.cropper;
                    cropper.replace(reader.result);
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
  const user = await prisma.user.findUnique({
    select: {
      selfIntro: true,
    },
    where: {
      id: userId,
    },
  });
  return {
    props: {
      user,
    },
  };
}
export default EditProfilePage;
