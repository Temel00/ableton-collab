import type { NextPage } from 'next';
import Head from 'next/head';
import Nav from '../components/nav';
import styles from '../styles/Home.module.css';
import { FaRecycle } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

import Link from 'next/link';

import Header from '../components/header';
import { useEffect, useState } from 'react';
import { Input } from '@nextui-org/react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  addDoc,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  DocumentData,
  getDocs,
} from 'firebase/firestore';

const Home: NextPage = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className={styles.container}>
      <Head>
        <title>FloraCare</title>
        <meta
          name="description"
          content="This is a house plant care web application that allows you to track watering and location of your house plants."
        />
        <link rel="icon" href="./FC_Logo_LG.ico" />
      </Head>

      <main className={styles.main}>
        <Header activePage={1} />

        {isLoggedIn && user != null && user != '' ? (
          <section className={styles.homeContent}>
            <h2>Welcome, {(user as any).displayName}</h2>
          </section>
        ) : (
          <div className={styles.loginContent}>
            <h4>
              <span>Sorry!</span>
              <br />
              You cannot view your spaces without loggin in
            </h4>
            <video width="300px" autoPlay muted loop>
              <source src="./v1.1/SpaceLogin.webm" type="video/webm"></source>
            </video>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
