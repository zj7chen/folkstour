import Avatar from "components/Avatar";
import NavBar from "components/NavBar";
import Container from "react-bootstrap/Container";
import prisma from "server/prisma";
import ReactMarkdown from "react-markdown";

function ProfilePage({ user }) {
  return (
    <div>
      <NavBar />
      <Container fluid="xl">
        <section>
          <Avatar id={user.id} />
          <span>{user.name}</span>
        </section>
        <section>
          <h2>Trips Parcitipating</h2>
          {user.reservations.map(({ trip: { id, title, reservations } }) => (
            <section key={id}>
              <h3>{title}</h3>
              {reservations.map(({ user: { id } }) => (
                <Avatar key={id} id={id} />
              ))}
            </section>
          ))}
        </section>
        <h2>Self Introduction</h2>
        <ReactMarkdown
          allowedElements={[
            "strong",
            "em",
            "ul",
            "ol",
            "code",
            "blockquote",
            "li",
            "p",
          ]}
          skipHtml
        >
          {user.selfIntro}
        </ReactMarkdown>
      </Container>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  let { id } = query;
  id = parseInt(id);
  const user = await prisma.user.findUnique({
    select: {
      name: true,
      selfIntro: true,
      reservations: {
        orderBy: {
          trip: {
            title: "asc",
          },
        },
        select: {
          trip: {
            select: {
              id: true,
              title: true,
              reservations: {
                select: {
                  user: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      id: true,
    },
    where: {
      id,
    },
  });
  return {
    props: {
      user: {
        ...user,
        id,
      },
    },
  };
}

export default ProfilePage;
