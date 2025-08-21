import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB8r3AaZKsaa-KJB3ETZ5-Yrg1Twc63iMU",
  authDomain: "court-case-10ab2.firebaseapp.com",
  projectId: "court-case-10ab2",
  storageBucket: "court-case-10ab2.firebasestorage.app",
  messagingSenderId: "485445891735",
  appId: "1:485445891735:web:d05699d72981a4092c5bd2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);