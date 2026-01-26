
import React from 'react';
import { Sparkles, MessageSquare, Zap, Shield, ArrowRight, BrainCircuit } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  initialScrollTo?: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      
      {/* Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-[#7C3AED] to-pink-500 rounded-lg flex items-center justify-center text-white shadow-sm">
             <Sparkles size={18} fill="white" />
           </div>
           <span className="text-xl font-bold tracking-tight">Velicia.ai</span>
        </div>
        <button 
          onClick={onEnterApp}
          className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Masuk Aplikasi
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-bold uppercase tracking-wider mb-8 animate-in slide-in-from-bottom-4 duration-700">
           <Zap size={12} fill="currentColor" /> AI Assistant Tercepat
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl leading-tight animate-in slide-in-from-bottom-6 duration-700 delay-100">
          Lebih dari sekadar <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-pink-500">Chatbot Biasa.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-200">
          Velicia adalah asisten AI cerdas yang dirancang untuk membantu Anda menulis, belajar, dan berkreasi dengan kecepatan cahaya.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in slide-in-from-bottom-6 duration-700 delay-300">
          <button 
            onClick={onEnterApp}
            className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
          >
            Mulai Percakapan <ArrowRight size={20} />
          </button>
          <button onClick={onEnterApp} className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors">
            Pelajari Fitur
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 w-full px-4 animate-in fade-in duration-1000 delay-500">
           <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                 <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Penalaran Logis</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Kemampuan analisis mendalam untuk memecahkan masalah kompleks dan coding.</p>
           </div>
           <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                 <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Kreativitas Tanpa Batas</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Buat puisi, cerita, atau ide konten media sosial yang menarik dalam hitungan detik.</p>
           </div>
           <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-4">
                 <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Aman & Privat</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Percakapan Anda aman. Kami memprioritaskan privasi dan keamanan data pengguna.</p>
           </div>
        </div>

      </main>
      
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
        © 2024 Velicia.ai. Dibuat dengan ❤️ oleh Tim Pengembang.
      </footer>
    </div>
  );
};

export default LandingPage;
