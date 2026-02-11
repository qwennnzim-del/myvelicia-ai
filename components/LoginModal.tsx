
import React, { useState } from 'react';
import { X, Loader2, ShieldCheck, AlertCircle, CheckCircle2, AlertTriangle, Settings } from 'lucide-react';
import { signInWithGoogle } from '../services/firebase';

interface LoginModalProps { 
  isOpen: boolean; 
  onClose: () => void; 
  onLogin: () => void 
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isConfigError?: boolean } | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
        await signInWithGoogle();
        // Login berhasil
        onClose();
    } catch (err: any) {
        console.error("Login Error:", err);
        
        let msg = "Gagal terhubung ke Google.";
        let isConfig = false;

        // Handle Specific Firebase Errors
        if (err.code === 'auth/configuration-not-found') {
             msg = "Google Sign-In belum diaktifkan di Firebase Console.";
             isConfig = true;
        } else if (err.code === 'auth/operation-not-allowed') {
             msg = "Metode login Google belum diaktifkan.";
             isConfig = true;
        } else if (err.code === 'auth/unauthorized-domain') {
             msg = "Domain website ini belum diizinkan di Firebase.";
             isConfig = true;
        } else if (err.code === 'auth/invalid-api-key') {
             msg = "API Key Firebase tidak valid.";
             isConfig = true;
        } else if (err.code === 'auth/popup-closed-by-user') {
             msg = "Login dibatalkan.";
        } else if (err.code === 'auth/popup-blocked') {
             msg = "Popup login diblokir browser.";
        } else if (err.message) {
            msg = err.message;
        }

        setError({ message: msg, isConfigError: isConfig });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl w-full max-w-[420px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 transform border border-gray-100">
        
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#7928CA]/10 via-[#FF0080]/10 to-transparent pointer-events-none" />
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full text-gray-400 hover:text-gray-900 transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="relative p-8 pt-10 text-center">
            {/* Logo */}
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-gray-100 mx-auto flex items-center justify-center mb-6 relative z-10">
                <img src="/logoApp/logo-app.png" alt="Velicia" className="w-10 h-10 object-contain" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Selamat Datang</h2>
            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
               Masuk untuk menyimpan riwayat percakapan Anda dengan aman di Cloud Velicia.
            </p>

            {/* Error Message Area */}
            {error && (
                <div className={`p-4 rounded-xl text-xs font-bold mb-6 flex items-start text-left gap-3 border animate-in slide-in-from-top-2 ${error.isConfigError ? 'bg-amber-50 text-amber-800 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {error.isConfigError ? <Settings size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm">{error.message}</span>
                        {error.isConfigError && (
                            <span className="font-normal opacity-90 leading-relaxed mt-1">
                                {error.message.includes('Domain') 
                                  ? <span>Tips: Buka Firebase Console &gt; Authentication &gt; Settings &gt; <b>Authorized domains</b> lalu tambahkan domain ini.</span>
                                  : <span>Tips: Buka Firebase Console &gt; Authentication &gt; Sign-in method &gt; Aktifkan <b>Google</b>.</span>
                                }
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Google Button */}
            <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="animate-spin text-purple-600" size={20} />
                ) : (
                    <>
                       <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="G" />
                       <span>Lanjutkan dengan Google</span>
                    </>
                )}
            </button>

            {/* Features / Trust Badges */}
            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                   <ShieldCheck size={12} className="text-green-500" /> Aman & Terenkripsi
                </span>
                <span className="flex items-center gap-1.5">
                   <CheckCircle2 size={12} className="text-blue-500" /> Cloud Sync
                </span>
            </div>
        </div>

        {/* Footer Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#7928CA] via-[#FF0080] to-[#FFD700]"></div>
      </div>
    </div>
  );
};
