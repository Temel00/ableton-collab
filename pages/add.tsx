import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { Input } from '@nextui-org/react';
import Header from '../components/header';
import Head from 'next/head';
import Link from 'next/link';
import useAuth from '../hooks/useAuth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';
import {
  collection,
  query,
  where,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  DocumentData,
  getDocs,
} from 'firebase/firestore';

const Add: NextPage = () => {
  const { isLoggedIn, user } = useAuth();

  const onAddSong = async () => {
    const songFiles = (document.getElementById('addFolder') as HTMLInputElement).files;
    const userRef = ref(storage, (user as any)?.uid);

    if (songFiles) {
      const files: File[] = Array.from(songFiles);

      files.forEach(function (value) {
        const projectRef = ref(userRef, value.webkitRelativePath);
        const uploadTask = uploadBytesResumable(projectRef, value);
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
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
              console.log('file available at ', downloadURL);
            });
          }
        );
      });

      const projectName = files[0].webkitRelativePath.split('/');
      const versionNum = (document.getElementById('addVersion') as HTMLInputElement).value;
      try {
        const newSongRef = doc(collection(db, 'songs'));

        const data = {
          createdAt: Date.now(),
          title: projectName[0],
          user: (user as any).uid,
          version: versionNum,
          song_url: '',
        };

        await setDoc(newSongRef, data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Head>
        <title>Sync Lab</title>
        <meta
          name="description"
          content="This is a collaboration application that allows users to share their ableton sessions and listen to them online."
        />
        <link rel="icon" href="./FC_Logo_LG.ico" />
      </Head>

      {isLoggedIn ? (
        <div>
          <Header activePage={3} />
          <div className={styles.addForm}>
            <div className={styles.addTitle}>
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
              <h3>Add a Song</h3>
            </div>
            <label htmlFor="addFolder" className={styles.addLabel}>
              Upload Folder
            </label>
            {/* @ts-expect-error */}
            <input webkitdirectory="" type="file" id="addFolder" name="addFolder" required></input>
            <Input
              type="number"
              label="Version"
              placeholder="0.0"
              step="0.1"
              width="125px"
              id="addVersion"
              contentRight={
                <div className="pointer-events-none flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="var(--main-green)"
                  >
                    <path d="M160-160q-33 0-56.5-23.5T80-240v-135q0-11 7-19t18-10q24-8 39.5-29t15.5-47q0-26-15.5-47T105-556q-11-2-18-10t-7-19v-135q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v135q0 11-7 19t-18 10q-24 8-39.5 29T800-480q0 26 15.5 47t39.5 29q11 2 18 10t7 19v135q0 33-23.5 56.5T800-160H160Zm0-80h640v-102q-37-22-58.5-58.5T720-480q0-43 21.5-79.5T800-618v-102H160v102q37 22 58.5 58.5T240-480q0 43-21.5 79.5T160-342v102Zm320-40q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480q0 17 11.5 28.5T480-440Zm0-160q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 120Z" />
                  </svg>
                </div>
              }
            ></Input>
            <button onClick={onAddSong}>Submit</button>
          </div>
        </div>
      ) : (
        <div className={styles.loginContent}>
          <video width="300px" autoPlay muted loop>
            <source src="./v1.1/SpaceLogin.webm" type="video/webm"></source>
          </video>
        </div>
      )}
    </div>
  );
};

export default Add;
