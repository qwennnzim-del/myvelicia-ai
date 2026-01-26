
import React, { useState } from 'react';
import { X, User, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Semua kolom harus diisi');
      return;
    }

    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }

    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(username);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/50">
        
        {/* Decorative Header */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#7C3AED] to-pink-500 opacity-10"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative px-8 pt-8 pb-8">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <X size={20} />
            </button>

            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-[#7C3AED] to-pink-500 rounded-2xl shadow-lg shadow-purple-200 mb-4">
                    <Sparkles size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Buat Akun</h2>
                <p className="text-gray-500 text-sm mt-1">Bergabunglah dengan Velicia AI hari ini.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 ml-1">Username</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" size={18} />
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 transition-all text-gray-800 font-medium placeholder:text-gray-400"
                            placeholder="Pilih nama pengguna"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" size={18} />
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 transition-all text-gray-800 font-medium placeholder:text-gray-400"
                            placeholder="Buat kata sandi"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 ml-1">Confirm Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" size={18} />
                        <input 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 transition-all text-gray-800 font-medium placeholder:text-gray-400"
                            placeholder="Ulangi kata sandi"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                        {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#18181b] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-gray-200 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            Daftar Sekarang <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-500">
                Sudah punya akun? <button className="text-[#7C3AED] font-bold hover:underline">Masuk disini</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
