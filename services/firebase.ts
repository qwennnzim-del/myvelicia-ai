
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from "firebase/auth";

// --- KONFIGURASI FIREBASE ---
// Menggunakan process.env yang sudah di-define di vite.config.ts
// Ini lebih aman daripada import.meta.env yang terkadang undefined di beberapa context
const apiKey = process.env.VITE_FIREBASE_API_KEY || "AIzaSyDOdIjp-tl2dtxBDUq4tPRPijFT0kS3LTo";
const authDomain = process.env.VITE_FIREBASE_AUTH_DOMAIN || "velicia-ai.firebaseapp.com";
const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "velicia-ai";
const storageBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET || "velicia-ai.firebasestorage.app";
const messagingSenderId = process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "379786845099";
const appId = process.env.VITE_FIREBASE_APP_ID || "1:379786845099:web:0adfa419dbb130218290ee";

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
const googleProvider = new GoogleAuthProvider();

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    auth = createMockAuth();
  }
} else {
  console.warn("Firebase configuration missing. Using Mock Auth.");
  auth = createMockAuth();
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
    } as unknown as Auth;
}

export { auth };

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
