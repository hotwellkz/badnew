import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAICwewb9nIfENQH-gOJgkpQXZKBity9ck",
  authDomain: "accounting-c3c06.firebaseapp.com",
  projectId: "accounting-c3c06",
  storageBucket: "accounting-c3c06.firebasestorage.app",
  messagingSenderId: "670119019137",
  appId: "1:670119019137:web:f5c57a1a6f5ef05c720380"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Enable offline persistence with unlimited cache size
enableIndexedDbPersistence(db, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
}).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support offline persistence.');
  }
});

// Required composite indexes for Firebase:
// 1. Collection: clients
//    Fields: 
//    - status (Ascending)
//    - year (Ascending)
//    - createdAt (Descending)
//    Query scope: Collection
//
// 2. Collection: clients
//    Fields:
//    - year (Ascending)
//    - createdAt (Descending)
//    Query scope: Collection
//
// 3. Collection: categories
//    Fields:
//    - row (Ascending)
//    - title (Ascending)
//    Query scope: Collection
//
// 4. Collection: transactions
//    Fields:
//    - categoryId (Ascending)
//    - date (Descending)
//    Query scope: Collection