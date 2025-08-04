import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD8VGFuZ47ZeVPKhr6PShVWOwA0Dy9pk3g",
  authDomain: "fit-happens-app-a6f1a.firebaseapp.com",
  projectId: "fit-happens-app-a6f1a",
  storageBucket: "fit-happens-app-a6f1a.appspot.com",
  messagingSenderId: "740418035013",
  appId: "1:740418035013:web:515591dfc39a095695f22c"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);