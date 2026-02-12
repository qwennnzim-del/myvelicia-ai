
import { db, auth, uploadFileToStorage } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { ChatSession } from '../types';

// --- FIRESTORE HELPERS ---

const getCollectionRef = (userId: string) => {
    return collection(db, 'users', userId, 'chats');
};

export const saveChatToFirestore = async (userId: string, session: ChatSession) => {
    if (!userId || !db) return;

    // 1. Buat Deep Copy agar tidak mengubah state UI secara langsung
    const sessionToSave = JSON.parse(JSON.stringify(session));

    // 2. Iterasi setiap pesan untuk mencari Attachment berupa Base64
    for (const msg of sessionToSave.messages) {
        if (msg.attachments && msg.attachments.length > 0) {
            const processedAttachments = [];
            
            for (const att of msg.attachments) {
                // Jika konten masih berupa Base64 (data:image/...), upload ke Storage
                if (att.content && att.content.startsWith('data:')) {
                    try {
                        const fileName = att.name || `file_${Date.now()}`;
                        // Upload dan dapatkan URL publik
                        const downloadUrl = await uploadFileToStorage(userId, att.content, fileName);
                        
                        // Ganti konten Base64 dengan URL
                        processedAttachments.push({ ...att, content: downloadUrl });
                    } catch (e) {
                        console.error("Gagal upload file ke storage, menggunakan fallback base64", e);
                        processedAttachments.push(att);
                    }
                } else {
                    // Jika sudah berupa URL (misal dari load sebelumnya), biarkan
                    processedAttachments.push(att);
                }
            }
            msg.attachments = processedAttachments;
        }
    }

    try {
        const chatRef = doc(db, 'users', userId, 'chats', session.id);
        // Simpan sesi yang attachment-nya sudah diganti URL
        await setDoc(chatRef, sessionToSave, { merge: true });
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
