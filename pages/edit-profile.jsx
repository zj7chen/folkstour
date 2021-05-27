import { GENDERS } from "client/choices";
import submit from "client/submit";
import Avatar from "components/Avatar";
import NavBar from "components/NavBar";
import { Formik } from "formik";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Cropper from "react-cropper";
import prisma from "server/prisma";
import { withSessionProps } from "server/session";
import styles from "./edit-profile.module.css";

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

function EditProfilePage({ currentUser, user }) {
  const router = useRouter();
  const cropperRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  return (
    <div>
      <NavBar currentUser={currentUser} />
      <Container fluid="xl" className="pt-3">
        <h1>Edit Profile</h1>
        <Formik
          initialValues={{
            gender: user.gender,
            selfIntro: user.selfIntro,
          }}
          onSubmit={async (values) => {
            const cropper = cropperRef.current?.cropper;
            const avatar = avatarUrl
              ? cropper?.getCroppedCanvas()?.toDataURL()?.split(";base64,")?.[1]
              : undefined;
            await submit("/api/update-profile", {
              ...values,
              avatar,
            });
            router.replace({ pathname: "/profile", query: { id: user.id } });
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.File
                  id="avatar"
                  name="avatar"
                  label="Avatar"
                  onChange={async (e) => {
                    const { files } = e.currentTarget;
                    if (files.length === 0) return;
                    const reader = new FileReader();
                    reader.readAsDataURL(files[0]);
                    await new Promise((res) => (reader.onloadend = res));
                    setAvatarUrl(reader.result);
                  }}
                />
                {avatarUrl ? (
                  <>
                    <Cropper
                      ref={cropperRef}
                      className={styles.cropper}
                      src={avatarUrl}
                      // Cropper.js options
                      viewMode={1}
                      dragMode="move"
                      aspectRatio={1 / 1}
                      restore={false}
                      guides={false}
                      autoCropArea={1}
                      cropBoxMovable={false}
                      cropBoxResizable={false}
                      toggleDragModeOnDblclick={false}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setAvatarUrl(null);
                      }}
                    >
                      Revert to original
                    </Button>
                  </>
                ) : (
                  <div className={styles.avatar}>
                    <Avatar hash={user.avatarHash} />
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <div>
                  {Object.entries(GENDERS).map(([key, { displayText }]) => (
                    <Form.Check
                      key={key}
                      id={`gender-${key}`}
                      inline
                      type="radio"
                      label={displayText}
                      name="gender"
                      value={key}
                      onChange={handleChange}
                      checked={values.gender === key}
                    />
                  ))}
                </div>
                <Form.Text className="text-muted">
                  Gender will affect you when trips have gender requirements
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="selfIntro">
                <Form.Label>Self Intro</Form.Label>
                <MarkdownEditor
                  initialValue={user.selfIntro}
                  onChange={(value) => {
                    setFieldValue("selfIntro", value);
                  }}
                  placeholder="Tell us about yourself"
                />
                <Form.Text className="text-muted">
                  Maximum of 4000 characters
                </Form.Text>
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

export const getServerSideProps = withSessionProps(
  async ({ session: { userId } }) => {
    const user = await prisma.user.findUnique({
      select: {
        gender: true,
        selfIntro: true,
        avatarHash: true,
      },
      where: {
        id: userId,
      },
    });
    return {
      props: {
        user: {
          ...user,
          id: userId,
        },
      },
    };
  }
);

export default EditProfilePage;
