import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDhib3tvwr_Cse2I1N1rMj_cqXAzMqnQ_U',
  authDomain: 'ableton-collab.firebaseapp.com',
  projectId: 'ableton-collab',
  storageBucket: 'ableton-collab.appspot.com',
  messagingSenderId: '67335929003',
  appId: '1:67335929003:web:c1d810d1e68fd38516cbee',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, db, storage };
