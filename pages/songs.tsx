import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { FaRecycle } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { collection, query, where, setDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

import Link from 'next/link';
import Header from '../components/header';
import 'react-datepicker/dist/react-datepicker.css';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import AudioControls from '../components/audioControls';

type Song = {
  createdAt: Date;
  id: string;
  title: string;
  user: string;
  version: string;
  song_url: string;
}[];

const Songs: NextPage = () => {
  const { isLoggedIn, user } = useAuth();
  const [songs, setSongs] = useState<Song>([]);
  const { load, playing } = useGlobalAudioPlayer();

  useEffect(() => {
    refreshSongs();
  }, [user]);

  const refreshSongs = async () => {
    if (user !== '' && user !== null) {
      let ar: Song = [];
      const q = query(collection(db, 'songs'), where('user', '==', (user as any).uid));
      try {
        const docSnap = await getDocs(q);
        docSnap.forEach(doc => {
          ar.push({
            createdAt: doc.data().createdAt,
            id: doc.id,
            title: doc.data().title,
            user: doc.data().user,
            version: doc.data().version,
            song_url: doc.data().song_url,
          });
        });
      } catch (err) {
        console.log(err);
      } finally {
        console.log(songs);
        // console.log('currentSong: ' + songs[0].title);

        // load(songs[songIndex].song_url, {
        //   autoplay: true,
        //   onend: () => setSongIndex(songIndex + 1),
        // });

        setSongs(ar);
      }
    }
  };

  const handlePlaySong = async (song: string) => {
    console.log('handle song play');
    console.log('Button id: ' + song);
    try {
      load(song, {
        autoplay: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sync Lab</title>
        <meta
          name="description"
          content="This is a collaboration application that allows users to share their ableton sessions and listen to them online."
        />
        <link rel="icon" href="./FC_Logo_LG.ico" />
      </Head>

      <main className={styles.song}>
        <Header activePage={2} />

        {isLoggedIn ? (
          <section className={styles.songContent}>
            <div className={styles.songTitle}>
              <Link href="/" passHref>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                  fill="currentColor"
                >
                  <path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z" />
                </svg>
              </Link>
              <h3>Your Songs</h3>
            </div>
            <div className={styles.songlistButtons}>
              <Link href="/add" passHref>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                  fill="currentColor"
                >
                  <path d="M440-440v120q0 17 11.5 28.5T480-280q17 0 28.5-11.5T520-320v-120h120q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H520v-120q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v120H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440h120Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
              </Link>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                  fill="currentColor"
                >
                  <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                  fill="currentColor"
                >
                  <path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h160q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h400q17 0 28.5 11.5T600-480q0 17-11.5 28.5T560-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" />
                </svg>
              </button>
            </div>
            {songs.map(song => {
              const { createdAt, id, title, user, version, song_url } = song;
              console.log('Song: ' + title + ' and ' + id);
              return (
                <div className={styles.songItem} key={id}>
                  {song_url ? (
                    <button
                      className={styles.songPlay}
                      onClick={() => handlePlaySong(song_url)}
                      id="play"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                        fill="currentColor"
                      >
                        <path d="M381-239q-20 13-40.5 1.5T320-273v-414q0-24 20.5-35.5T381-721l326 207q18 12 18 34t-18 34L381-239Zm19-241Zm0 134 210-134-210-134v268Z" />
                      </svg>
                    </button>
                  ) : (
                    <div className={styles.songTag}></div>
                  )}
                  <div className={styles.songName}>
                    <Link href={'/songDetails/' + title + '?s=' + id}>{title}</Link>
                    <button className={styles.songTrash}>
                      <FaRecycle style={{ fontSize: '1.5em' }} />
                    </button>
                  </div>
                </div>
              );
            })}
            <div>
              <h4>Audio Player</h4>
              <AudioControls />
            </div>
          </section>
        ) : (
          <div className={styles.loginContent}>
            <video width="300px" autoPlay muted loop>
              <source src="./v1.1/SpaceLogin.webm" type="video/webm"></source>
            </video>
          </div>
        )}
      </main>
    </div>
  );
};

export default Songs;
