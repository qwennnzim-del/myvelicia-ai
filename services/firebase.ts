
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, updateProfile, Auth, User } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// --- KONFIGURASI FIREBASE ---
// Menggunakan process.env yang sudah di-define di vite.config.ts
const apiKey = process.env.VITE_FIREBASE_API_KEY;
const authDomain = process.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};

// Validasi sederhana
const isFirebaseConfigured = !!apiKey && apiKey !== "your_firebase_api_key";

let auth: Auth;
let db: Firestore;
const googleProvider = new GoogleAuthProvider();

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    // @ts-ignore
    auth = createMockAuth();
    // @ts-ignore
    db = {}; 
  }
} else {
  console.warn("Firebase configuration missing. Using Mock Auth.");
  // @ts-ignore
  auth = createMockAuth();
  // @ts-ignore
  db = {};
}

function createMockAuth(): Auth {
    return {
        currentUser: null,
        onAuthStateChanged: (nextOrObserver: any) => {
            if (typeof nextOrObserver === 'function') nextOrObserver(null);
            else if (nextOrObserver && nextOrObserver.next) nextOrObserver.next(null);
            return () => {};
        },
        signOut: async () => {},
        updateProfile: async () => {},
    } as unknown as Auth;
}

export { auth, db };

export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    throw new Error("Konfigurasi Firebase belum terdeteksi. Silakan cek file .env atau hardcoded config.");
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Login Error Full:", error);
    throw error;
  }
};

export const logout = async () => {
  if (!isFirebaseConfigured) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};

export const updateUserProfile = async (user: User, displayName: string) => {
    if (!user) throw new Error("No user to update");
    try {
        await updateProfile(user, { displayName });
    } catch (error) {
        console.error("Update Profile Error:", error);
        throw error;
    }
};
