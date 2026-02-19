import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, GraduationCap, MapPin, Linkedin, Instagram, Code, Terminal, Cpu } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  language: 'id' | 'en';
}

const TRANSLATIONS = {
  id: {
    title: "Tentang Kreator / About Me",
    name: "M. Fariz Alfauzi (Hezell)",
    role: "CEO & Lead Engineer Velicia AI",
    devLabel: "Velicia AI Developer",
    bio1: "M. Fariz Alfauzi, yang akrab dikenal sebagai Hezell, adalah pengembang utama di balik myvelicia ai. Sebagai CEO & Lead Engineer, ia berdedikasi membangun kedaulatan AI Indonesia melalui teknologi Gen2 yang mandiri dan inovatif.",
    bio2: "Dengan fokus pada efisiensi pemrosesan dan antarmuka yang intuitif, Hezell merancang Velicia untuk menjadi asisten cerdas yang tidak hanya canggih secara teknis, tetapi juga mudah diakses oleh seluruh lapisan masyarakat Nusantara.",
    school: "SMK NURUL ISLAM AFFANDIYAH",
    location: "Cianjur, Jawa Barat",
    techStack: "Keahlian Utama",
    connect: "Mari Terhubung",
    back: "Kembali"
  },
  en: {
    title: "About the Creator / About Me",
    name: "M. Fariz Alfauzi (Hezell)",
    role: "CEO & Lead Engineer of Velicia AI",
    devLabel: "Velicia AI Developer",
    bio1: "M. Fariz Alfauzi, also known as Hezell, is the lead visionary behind myvelicia ai. As CEO & Lead Engineer, he is dedicated to establishing Indonesia's AI sovereignty through independent and innovative Gen2 technology.",
    bio2: "With a strong focus on processing efficiency and intuitive interfaces, Hezell designed Velicia to be a smart assistant that is not only technically advanced but also accessible to all levels of Indonesian society.",
    school: "SMK NURUL ISLAM AFFANDIYAH",
    location: "Cianjur, West Java",
    techStack: "Core Expertise",
    connect: "Let's Connect",
    back: "Back"
  }
};

const AboutPage: React.FC<AboutPageProps> = ({ onBack, language }) => {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20 selection:bg-pink-100 selection:text-pink-900">
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4 md:px-6 justify-between transition-all">
         <button 
           onClick={onBack}
           className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2 pr-4 group"
         >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">{t.back}</span>
         </button>
         <div className="flex items-center gap-2">
            <img src="/logoApp/logo-app.png" alt="Logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-lg tracking-tight text-gray-900">Velicia</span>
         </div>
         <div className="w-10"></div> {/* Spacer for centering */}
      </nav>

      <main className="pt-24 md:pt-32 max-w-5xl mx-auto px-6">
        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* Background Accents for Modern Feel */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
                
                {/* Profile Avatar with Hover Effect */}
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] bg-gradient-to-tr from-[#7928CA] to-[#FF0080] p-1.5 shadow-[0_0_40px_rgba(121,40,202,0.4)] shrink-0 group hover:scale-105 transition-all duration-700 hover:rotate-3 mb-8">
                    <div className="w-full h-full bg-slate-900 rounded-[2.2rem] overflow-hidden flex items-center justify-center border-4 border-slate-800/50">
                        <span className="text-7xl md:text-8xl font-black text-white select-none">M</span>
                    </div>
                </div>
                
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-extrabold tracking-[0.2em] uppercase mb-6 text-purple-300 backdrop-blur-sm">
                    <Sparkles size={16} className="text-yellow-400"/> {t.title}
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tighter">
                    {t.name}
                </h1>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-10">
                    <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {t.role}
                    </p>
                    <div className="hidden md:block w-2 h-2 rounded-full bg-slate-600"></div>
                    <p className="text-slate-400 font-bold text-sm md:text-base tracking-widest uppercase">
                        {t.devLabel}
                    </p>
                </div>

                <div className="max-w-3xl space-y-6 text-slate-300 leading-relaxed text-lg font-medium mb-12">
                    <p>{t.bio1}</p>
                    <p>{t.bio2}</p>
                </div>
                
                {/* Info Tags */}
                <div className="flex flex-wrap justify-center gap-4 mb-16 text-sm font-bold text-slate-300">
                    <div className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/5 backdrop-blur-sm cursor-default">
                        <GraduationCap size={20} className="text-purple-400"/> {t.school}
                    </div>
                    <div className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/5 backdrop-blur-sm cursor-default">
                        <MapPin size={20} className="text-pink-400"/> {t.location}
                    </div>
                </div>

                <hr className="w-full border-white/10 mb-12" />

                {/* SOCIAL LINKS (SEO Target) */}
                <h3 className="text-xl font-bold text-white mb-8 tracking-wide uppercase">{t.connect}</h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-2xl">
                    <a 
                        href="https://www.linkedin.com/in/m-fariz-alfauzi-19b2833b1" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-[#0077b5] hover:bg-[#005a8a] text-white rounded-2xl font-black text-base transition-all shadow-lg hover:shadow-[#0077b5]/40 hover:-translate-y-1 active:scale-95 group"
                    >
                        <Linkedin size={24} className="group-hover:scale-110 transition-transform" />
                        LinkedIn Profile
                    </a>
                    <a 
                        href="https://www.instagram.com/account.hezell" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 text-white rounded-2xl font-black text-base transition-all shadow-lg hover:shadow-pink-500/40 hover:-translate-y-1 active:scale-95 group"
                    >
                        <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                        Follow @account.hezell
                    </a>
                </div>
                
            </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;