import Nav from '../../components/nav';
import styles from '../../styles/Home.module.css';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../components/header';
import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { getDoc, setDoc, doc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../firebase';
import AudioControls from '../../components/audioControls';
import { useGlobalAudioPlayer } from 'react-use-audio-player';

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
  const { load } = useGlobalAudioPlayer();

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

  const handlePlaySong = async (song: string) => {
    try {
      load(song, {
        autoplay: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const audioChange = (e: any) => {
    const file: File = e.target.files[0];
    const userRef = ref(storage, (user as any)?.uid);
    const songRef = ref(userRef, file.name);

    const uploadTask = uploadBytesResumable(songRef, file);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      error => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          console.log('file available at ', downloadURL);
          try {
            const data = {
              createdAt: song[0].createdAt,
              title: song[0].title,
              user: song[0].user,
              version: song[0].version,
              song_url: downloadURL,
            };
            if (songId) {
              await setDoc(doc(db, 'songs', songId), data);
            }

            refreshSong();
          } catch (error) {
            console.log(error);
          }
        });
      }
    );
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
          <>
            <section className={styles.pageContent}>
              <div className={styles.detailsTitle}>
                <Link href="/songs" passHref>
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
                <h2>{song[0]?.title}</h2>
              </div>

              <div className={styles.detailsBox}>
                <h3>Version:</h3>
                <h4>{song[0]?.version}</h4>
              </div>
              <div className={styles.detailsBox}>
                <h3>Created:</h3>
                <h4>{new Date(song[0]?.createdAt).toLocaleDateString('en-US')}</h4>
              </div>

              <label htmlFor="addAudio" className={styles.addAudioLabel}>
                Upload .mp3
              </label>
              <input
                type="file"
                id="addAudio"
                name="addAudio"
                accept=".mp3"
                onChange={audioChange}
              ></input>
              <div className={styles.detailsPlayBox}>
                <button
                  className={styles.songPlay}
                  onClick={() => handlePlaySong(song[0].song_url)}
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
                <h4>Current url:</h4>
                <p>{song[0]?.song_url}</p>
              </div>
            </section>
            <AudioControls />
          </>
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
