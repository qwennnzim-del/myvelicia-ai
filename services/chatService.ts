
import { db, auth } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { ChatSession } from '../types';

// --- FIRESTORE HELPERS ---

const getCollectionRef = (userId: string) => {
    return collection(db, 'users', userId, 'chats');
};

export const saveChatToFirestore = async (userId: string, session: ChatSession) => {
    if (!userId || !db) return;
    try {
        const chatRef = doc(db, 'users', userId, 'chats', session.id);
        // We ensure plain objects are saved
        await setDoc(chatRef, JSON.parse(JSON.stringify(session)), { merge: true });
    } catch (error) {
        console.error("Error saving chat to Firestore:", error);
    }
};

export const loadChatsFromFirestore = async (userId: string): Promise<ChatSession[]> => {
    if (!userId || !db) return [];
    try {
        const q = query(getCollectionRef(userId), orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(q);
        const chats: ChatSession[] = [];
        querySnapshot.forEach((doc) => {
            chats.push(doc.data() as ChatSession);
        });
        return chats;
    } catch (error) {
        console.error("Error loading chats from Firestore:", error);
        return [];
    }
};

export const deleteChatFromFirestore = async (userId: string, chatId: string) => {
    if (!userId || !db) return;
    try {
        await deleteDoc(doc(db, 'users', userId, 'chats', chatId));
    } catch (error) {
        console.error("Error deleting chat from Firestore:", error);
    }
};

// --- LOCAL STORAGE HELPERS (Fallback) ---

export const saveChatToLocal = (history: ChatSession[]) => {
    localStorage.setItem('velicia_chat_history', JSON.stringify(history));
};

export const loadChatsFromLocal = (): ChatSession[] => {
    const saved = localStorage.getItem('velicia_chat_history');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse local history", e);
        }
    }
    return [];
};
