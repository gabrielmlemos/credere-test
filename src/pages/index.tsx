import type { NextPage } from "next";

import styles from "../styles/Home.module.css";
import Header from "../components/Header";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Header title="Credere Teste" />
    </div>
  );
};

export default Home;
