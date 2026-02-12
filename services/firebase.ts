
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, updateProfile, Auth, User } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { getAnalytics, logEvent as firebaseLogEvent, Analytics } from "firebase/analytics";

// --- KONFIGURASI FIREBASE ---
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

const isFirebaseConfigured = !!apiKey && apiKey !== "your_firebase_api_key";

let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

const googleProvider = new GoogleAuthProvider();

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Analytics hanya berjalan di lingkungan browser
    if (typeof window !== 'undefined') {
        try {
            analytics = getAnalytics(app);
        } catch (e) {
            console.warn("Analytics not supported in this environment");
        }
    }
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    // @ts-ignore
    auth = createMockAuth();
    // @ts-ignore
    db = {}; 
    // @ts-ignore
    storage = {};
  }
} else {
  console.warn("Firebase configuration missing. Using Mock Services.");
  // @ts-ignore
  auth = createMockAuth();
  // @ts-ignore
  db = {};
  // @ts-ignore
  storage = {};
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

export { auth, db, storage, analytics };

// --- AUTH SERVICES ---

export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    throw new Error("Konfigurasi Firebase belum terdeteksi. Silakan cek file .env atau hardcoded config.");
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Log login event
    logAnalyticsEvent('login', { method: 'google' });
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

// --- STORAGE SERVICES (NEW) ---

/**
 * Mengupload file Base64 ke Firebase Storage untuk menghemat Firestore
 * @param userId ID user pemilik file
 * @param fileBase64 String base64 file (data:image/png;base64,...)
 * @param fileName Nama file
 * @returns Promise string URL download
 */
export const uploadFileToStorage = async (userId: string, fileBase64: string, fileName: string): Promise<string> => {
    if (!storage || !userId) return fileBase64; // Fallback jika storage tidak aktif

    try {
        const timestamp = Date.now();
        // Path: uploads/{userId}/{timestamp}_{filename}
        const storageRef = ref(storage, `uploads/${userId}/${timestamp}_${fileName}`);
        
        // Upload string (Base64)
        await uploadString(storageRef, fileBase64, 'data_url');
        
        // Dapatkan URL publik
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error("Upload Storage Error:", error);
        return fileBase64; // Fallback ke base64 jika gagal upload
    }
};

// --- ANALYTICS SERVICES (NEW) ---

export const logAnalyticsEvent = (eventName: string, params?: any) => {
    if (analytics) {
        try {
            firebaseLogEvent(analytics, eventName, params);
        } catch (e) {
            console.log("Analytics Log Skipped (Dev Mode)");
        }
    }
};
