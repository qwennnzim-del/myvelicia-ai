
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from "firebase/auth";

// Konfigurasi Firebase
// Menggunakan process.env (dari Vercel/env), jika kosong maka menggunakan nilai hardcoded yang Anda berikan
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDOdIjp-tl2dtxBDUq4tPRPijFT0kS3LTo",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "velicia-ai.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "velicia-ai",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "velicia-ai.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "379786845099",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:379786845099:web:0adfa419dbb130218290ee"
};

// State to track if firebase is valid
// Kita anggap valid jika apiKey ada (baik dari env maupun hardcoded)
const isFirebaseConfigured = !!firebaseConfig.apiKey;

let auth: Auth;
const googleProvider = new GoogleAuthProvider();

if (isFirebaseConfigured) {
  try {
    // Initialize Firebase only if config is present
    // Check if apps already initialized to prevent duplicates in dev HMR
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    // Fallback if initialization fails
    auth = createMockAuth();
  }
} else {
  console.warn("Firebase configuration missing. Auth features will be disabled.");
  auth = createMockAuth();
}

// Helper to create a mock Auth object
function createMockAuth(): Auth {
    return {
        currentUser: null,
        onAuthStateChanged: (nextOrObserver: any) => {
            if (typeof nextOrObserver === 'function') {
                nextOrObserver(null);
            } else if (nextOrObserver && nextOrObserver.next) {
                nextOrObserver.next(null);
            }
            return () => {};
        },
        signOut: async () => {},
    } as unknown as Auth;
}

export { auth };

// Fungsi Login dengan Google
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    alert("Konfigurasi Firebase tidak valid.");
    return null;
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Fungsi Logout
export const logout = async () => {
  if (!isFirebaseConfigured) return;
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
