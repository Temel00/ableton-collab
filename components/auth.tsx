import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';
import { auth } from '../firebase';
import useAuth from '../hooks/useAuth';
import styles from '../styles/Home.module.css';
const Auth = () => {
  const { isLoggedIn, user } = useAuth();

  const handleAuth = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result?.user;

        // ...
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className={styles.authBox}>
      {isLoggedIn && (
        <>
          <p>Hi, {(user as any).displayName}</p>
          <button className={styles.authSignout} onClick={() => auth.signOut()}>
            Logout
          </button>
        </>
      )}
      {!isLoggedIn && (
        <button className={styles.authSignin} onClick={() => handleAuth()}>
          <FaGoogle />
          SignIn
        </button>
      )}
    </div>
  );
};

export default Auth;
