
import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Globe, User, LogIn, Mail, Lock, HelpCircle, CheckCircle, AlertTriangle, Key } from 'lucide-react';
import { UserProfile } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- SETTINGS MODAL ---
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, language, setLanguage, onClearHistory }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Load saved key on open
  useEffect(() => {
    if (isOpen) {
        setIsConfirmingDelete(false);
        const savedKey = localStorage.getItem('velicia_user_api_key');
        setApiKey(savedKey || '');
        if (savedKey) setShowKeyInput(true);
    }
  }, [isOpen]);

  const handleSaveKey = () => {
      if (apiKey.trim()) {
          localStorage.setItem('velicia_user_api_key', apiKey.trim());
          alert("Secret Key tersimpan! Anda sekarang terhubung ke Pollinations Premium.");
      } else {
          localStorage.removeItem('velicia_user_api_key');
          alert("Secret Key dihapus. Kembali menggunakan mode publik (terbatas).");
      }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Pengaturan">
      <div className="space-y-6">
        <div>
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">Bahasa</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setLanguage('id')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${language === 'id' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >
              🇮🇩 Indonesia
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${language === 'en' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* --- CUSTOM API KEY SECTION --- */}
        <div className="pt-6 border-t border-gray-100">
           <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">Akses Premium</label>
           
           {!showKeyInput && !apiKey ? (
               <button 
                 onClick={() => setShowKeyInput(true)}
                 className="w-full p-3 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors"
               >
                   <Key size={16} /> Masukkan Pollinations Secret
               </button>
           ) : (
               <div className="space-y-2 animate-in fade-in duration-300">
                   <p className="text-xs text-gray-500 mb-2">
                       Masukkan <strong>Secret Key</strong> dari <a href="https://enter.pollinations.ai/" target="_blank" className="text-blue-600 underline">enter.pollinations.ai</a> untuk akses model GPT-4o, Claude 3.5, dll.
                   </p>
                   <div className="relative">
                       <input 
                          type="password" 
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Paste Secret Key..."
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none text-sm font-mono"
                       />
                       <Key size={16} className="absolute left-3 top-3.5 text-gray-400" />
                   </div>
                   <button 
                      onClick={handleSaveKey}
                      className="w-full py-2 bg-black text-white rounded-lg font-bold text-xs"
                   >
                       Simpan Secret
                   </button>
                   <button 
                      onClick={() => { setShowKeyInput(false); setApiKey(''); localStorage.removeItem('velicia_user_api_key'); }}
                      className="w-full py-2 text-red-500 font-bold text-xs hover:bg-red-50 rounded-lg"
                   >
                       Hapus
                   </button>
               </div>
           )}
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">Data & Privasi</label>
          
          {!isConfirmingDelete ? (
            <button 
                onClick={() => setIsConfirmingDelete(true)}
                className="w-full p-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
                <Trash2 size={18} /> Hapus Semua Riwayat
            </button>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-3 text-red-700 font-bold text-sm">
                    <AlertTriangle size={18} />
                    Konfirmasi Penghapusan
                </div>
                <p className="text-xs text-red-600/80 mb-4 font-medium">Tindakan ini tidak dapat dibatalkan. Semua percakapan Anda akan hilang permanen.</p>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsConfirmingDelete(false)}
                        className="flex-1 py-2 bg-white text-gray-600 font-bold text-xs rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={() => {
                            onClearHistory();
                            onClose();
                        }}
                        className="flex-1 py-2 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700 shadow-sm"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

// --- PROFILE MODAL ---
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setBio(profile.bio);
    }
  }, [isOpen, profile]);

  const handleSave = () => {
    onSave({ ...profile, name, bio });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Profil">
      <div className="space-y-5">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-black shadow-lg">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium"
            placeholder="Nama Anda"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Bio Singkat</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium min-h-[100px] resize-none"
            placeholder="Ceritakan sedikit tentang diri Anda..."
          />
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 mt-4"
        >
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>
    </BaseModal>
  );
};

// --- LOGIN MODAL ---
export const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: () => void }> = ({ isOpen, onClose, onLogin }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Masuk / Daftar">
      <div className="space-y-5">
         <p className="text-center text-gray-500 text-sm mb-4">Masuk untuk menyimpan riwayat chat dan mengakses fitur Pro.</p>
         
         <div>
            <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input type="email" placeholder="Email" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none" />
            </div>
         </div>
         
         <div>
            <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input type="password" placeholder="Password" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none" />
            </div>
         </div>

         <button 
            onClick={() => { onLogin(); onClose(); }}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
         >
            Masuk Sekarang
         </button>
         
         <div className="relative py-2">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
             <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Atau lanjutkan dengan</span></div>
         </div>

         <button className="w-full py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
             <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
             Google
         </button>
      </div>
    </BaseModal>
  );
};
