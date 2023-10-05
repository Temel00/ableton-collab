import Nav from '../../components/nav';
import styles from '../../styles/Home.module.css';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../components/header';
import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import AudioControls from '../../components/audioControls';

type Song = {
  id: string;
  createdAt: Date;
  title: string;
  user: string;
  version: number;
  song_url: string;
}[];

const Page: NextPage = () => {
  const { isLoggedIn, user } = useAuth();
  const searchParams = useSearchParams();
  const songId = searchParams.get('s');
  const [song, setSong] = useState<Song>([]);

  useEffect(() => {
    refreshSong();
  }, [user]);

  const refreshSong = async () => {
    if (songId != null) {
      let ar: Song = [];
      const songRef = doc(db, 'songs', songId);
      try {
        const docSnap = await getDoc(songRef);
        if (docSnap != null) {
          ar.push({
            id: docSnap.data()?.id,
            createdAt: docSnap.data()?.createdAt,
            title: docSnap.data()?.title,
            user: docSnap.data()?.user,
            version: docSnap.data()?.version,
            song_url: docSnap.data()?.song_url,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSong(ar);
        console.log(song);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Song Details</title>
        <meta name="description" content="This is a user's space to track song details" />
        <link rel="icon" href="./FC_Logo.LG.ico" />
      </Head>
      <main className={styles.page}>
        <Header activePage={3} />
        {isLoggedIn ? (
          <section className={styles.pageContent}>
            <h2>{song[0]?.title}</h2>
            <h4>Version: {song[0]?.version}</h4>
            <h4>Created: {song[0]?.createdAt}</h4>
            <h4>Song URL: {song[0]?.song_url}</h4>
            <div>
              <h4>Audio Player</h4>
              <AudioControls />
            </div>
          </section>
        ) : (
          <div className={styles.loginContent}>
            <video width="300px" autoPlay muted loop>
              <source src="../../v1.1/SpaceLogin.webm" type="video/webm"></source>
            </video>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
