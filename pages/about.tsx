import type { NextPage } from 'next';
import Head from 'next/head';
import Nav from '../components/nav';
import styles from '../styles/Home.module.css';
import Header from '../components/header';
import AudioControls from '../components/audioControls';

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About</title>
        <meta name="description" content="This is the about page for FloraCare." />
        <link rel="icon" href="./FC_Logo_LG.ico" />
      </Head>

      <main className={styles.about}>
        <Header activePage={3} />
        <div className={styles.aboutContent}>
          <h1>This is the About page.</h1>
        </div>
        <AudioControls />
      </main>
    </>
  );
};

export default About;
