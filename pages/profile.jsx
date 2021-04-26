import Avatar from "components/Avatar";
import NavBar from "components/NavBar";
import Container from "react-bootstrap/Container";
import prisma from "server/prisma";

function ProfilePage({ user }) {
  return (
    <div>
      <NavBar />
      <Container fluid="xl">
        <section>
          <Avatar content={user.avatar} />
          <span>{user.name}</span>
        </section>
        <section>
          <h2>Trips Parcitipating</h2>
          {user.reservations.map(({ trip: { id, title, reservations } }) => (
            <section key={id}>
              <h3>{title}</h3>
              {reservations.map(({ user: { id, avatar } }) => (
                <Avatar key={id} content={avatar} />
              ))}
            </section>
          ))}
        </section>
        <h2>Self Introduction</h2>
      </Container>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  let { id } = query;
  id = parseInt(id);
  const { avatar, trips, reservations, ...rest } = await prisma.user.findUnique(
    {
      select: {
        name: true,
        avatar: true,
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
                        avatar: true,
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
    }
  );
  return {
    props: {
      user: {
        ...rest,
        id,
        avatar: avatar?.toString("base64") ?? null,
        reservations: reservations.map(
          ({ trip: { reservations, ...rest } }) => ({
            trip: {
              ...rest,
              reservations: reservations.map(
                ({ user: { avatar, ...rest } }) => ({
                  user: { ...rest, avatar: avatar?.toString("base64") ?? null },
                })
              ),
            },
          })
        ),
      },
    },
  };
}

export default ProfilePage;
