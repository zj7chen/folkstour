import LocationSearch from "components/LocationSearch";
import searchStyles from "components/LocationSearchHome.module.css";
import NavBar from "components/NavBar";
import styles from "./Home.module.css";

function Home({ currentUser }) {
  return (
    <div>
      <video autoPlay muted loop className={styles.video}>
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <NavBar currentUser={currentUser} landing />
      <main className={styles.main}>
        <div className={styles.center}>
          <div className={styles.entry}>
            <h1>
              结伴而行
              <br />
              <small>让旅途不再孤单</small>
            </h1>
            <div className="text-body">
              <LocationSearch styles={searchStyles} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
