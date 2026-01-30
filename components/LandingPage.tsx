
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Search, PenTool, Image as ImageIcon, 
  FileText, Globe, Play, Menu, X, 
  ChevronDown, Star, Layout, Sparkles, Smartphone, Monitor, Chrome, Brain, Mail, Briefcase, Zap,
  Linkedin, Github, Twitter, Calendar, ArrowRight, BarChart3, ShieldCheck
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onReadArticle: (id: number) => void;
  initialScrollTo?: string | null;
}

// --- TRANSLATIONS DATA ---
const TRANSLATIONS = {
  id: {
    nav: {
      langLabel: 'ID',
      features: 'Fitur',
      pricing: 'Harga',
      blog: 'Blog',
      about: 'Tentang'
    },
    hero: {
      badge: 'Velicia AI Masa Depan',
      title1: 'Asisten Cerdas',
      title2: 'Indonesia',
      desc: 'Velicia dikembangkan untuk Masa Depan Nusantara. Efisiensi tinggi, pemahaman mendalam, dan respon cepat.',
      startBtn: 'Mulai Sekarang',
      viewUniverse: 'Universe',
      disclaimer: 'Gratis selamanya • Tanpa kartu kredit',
      mockupText: 'Halo! Ada yang bisa saya bantu hari ini?',
      mockupPrompt: 'Jelaskan kemampuan utamamu.',
      mockupResponse: 'Saya Velicia, asisten cerdas yang dirancang dengan arsitektur lokal.',
      mockupPowered: 'Velicia Engine'
    },
    blog: {
      title: 'Artikel Terkini',
      readMore: 'Baca',
      viewAll: 'Lihat Semua',
      articles: [
        {
          id: 3,
          title: "Peluncuran Velicia AI 2026",
          desc: "Pengumuman resmi, hasil rapat, dan roadmap menuju 2028.",
          tag: "News"
        },
        {
          id: 0,
          title: "Visi Kedaulatan Digital",
          desc: "Velicia AI sebagai solusi mandiri untuk kebutuhan teknologi nasional.",
          tag: "Visi"
        },
        {
          id: 1,
          title: "Optimasi Alur Kerja",
          desc: "Hemat waktu dengan algoritma ekstraksi informasi cerdas kami.",
          tag: "Tips"
        }
      ]
    },
    profession: {
      title: 'Solusi Profesional',
      items: {
        'Entrepreneur': [
          { title: 'Intelijen Pasar', desc: 'Analisis pesaing & tren pasar.' },
          { title: 'Partner Strategis', desc: 'Solusi strategis tantangan bisnis.' },
          { title: 'Analisis Dokumen', desc: 'Ekstraksi poin kontrak & laporan.' },
          { title: 'Asisten Email', desc: 'Saran tanggapan kontekstual.' },
        ],
        'Konsultan': [
            { title: 'Presentasi Kilat', desc: 'Kerangka presentasi instan.' },
            { title: 'Analisis Data', desc: 'Wawasan dari data mentah.' },
        ],
        'Peneliti': [
            { title: 'Ringkasan Jurnal', desc: 'Pahami jurnal dalam sekejap.' },
            { title: 'Pencari Referensi', desc: 'Sumber kredibel & sitasi.' },
        ],
        'Pengembang': [
            { title: 'Generator Kode', desc: 'Boilerplate & fungsi kompleks.' },
            { title: 'AI Debugger', desc: 'Temukan & perbaiki bug.' },
        ],
        'Pemasaran': [
            { title: 'Copywriter', desc: 'Persuasive ad copy.' },
            { title: 'Campaign Ideas', desc: 'Brainstorming ide viral.' },
        ]
      }
    },
    team: {
      title: 'Tim Kami',
      subtitle: 'Para ahli dibalik kecerdasan buatan Indonesia.',
      members: [
        { role: 'CEO & Lead Engineer', desc: 'Pelopor pengembangan Velicia AI.' },
        { role: 'AI Researcher', desc: 'Riset model multimodal kontekstual.' },
        { role: 'Head of Operations', desc: 'Skalabilitas infrastruktur cloud.' },
        { role: 'UX Designer', desc: 'Pengalaman interaksi AI intuitif.' },
        { role: 'Sekretaris & Ops', desc: 'Koordinasi administrasi dan notulensi strategis.' }
      ]
    },
    faq: {
      title: 'FAQ',
      items: [
        { q: 'Apa itu Velicia?', a: 'Asisten AI mandiri dengan arsitektur mutakhir untuk produktivitas Indonesia.' },
        { q: 'Cara menggunakan?', a: 'Langsung mulai mengobrol di dashboard. Tersedia juga sebagai ekstensi Chrome.' },
        { q: 'Apakah gratis?', a: 'Ya, gratis selamanya untuk penggunaan personal. Tersedia paket Pro.' },
        { q: 'Cara kerja?', a: 'Menggunakan mesin AI mandiri yang dioptimalkan dengan pemahaman bahasa alami.' }
      ]
    },
    footer: {
      text: 'Kecerdasan Buatan Mandiri untuk Indonesia.'
    }
  },
  en: {
    nav: {
      langLabel: 'EN',
      features: 'Features',
      pricing: 'Pricing',
      blog: 'Blog',
      about: 'About'
    },
    hero: {
      badge: 'Velicia AI Future',
      title1: 'Smart Assistant',
      title2: 'Indonesia',
      desc: 'Velicia developed for Nusantara. High efficiency, deep understanding, and rapid response.',
      startBtn: 'Start Now',
      viewUniverse: 'Universe',
      disclaimer: 'Free forever • No credit card',
      mockupText: 'Hello! How can I assist you today?',
      mockupPrompt: 'Explain your core capabilities.',
      mockupResponse: 'I am Velicia, a smart assistant designed with local architecture.',
      mockupPowered: 'Velicia Engine'
    },
    blog: {
      title: 'Latest Articles',
      readMore: 'Read',
      viewAll: 'View All',
      articles: [
         {
          id: 3,
          title: "Velicia AI Launch 2026",
          desc: "Official announcement, meeting results, and roadmap to 2028.",
          tag: "News"
        },
        {
          id: 0,
          title: "Digital Sovereignty Vision",
          desc: "Velicia AI as an independent solution for national tech needs.",
          tag: "Vision"
        },
        {
          id: 1,
          title: "Workflow Optimization",
          desc: "Save time with our intelligent information extraction algorithms.",
          tag: "Tips"
        }
      ]
    },
    profession: {
      title: 'Professional Solutions',
      items: {
        'Entrepreneur': [
          { title: 'Market Intelligence', desc: 'Competitor & trend analysis.' },
          { title: 'Strategic Partner', desc: 'Strategic business solutions.' },
          { title: 'Document Analysis', desc: 'Contract & report extraction.' },
          { title: 'Email Assistant', desc: 'Contextual response suggestions.' },
        ],
        'Konsultan': [
            { title: 'Instant Presentation', desc: 'Presentation outlines in seconds.' },
            { title: 'Data Analysis', desc: 'Insights from raw data.' },
        ],
        'Peneliti': [
            { title: 'Journal Summary', desc: 'Understand journals instantly.' },
            { title: 'Reference Finder', desc: 'Credible sources & citations.' },
        ],
        'Pengembang': [
            { title: 'Code Generator', desc: 'Boilerplate & complex functions.' },
            { title: 'AI Debugger', desc: 'Find & fix bugs.' },
        ],
        'Pemasaran': [
            { title: 'Copywriter', desc: 'Persuasive ad copy.' },
            { title: 'Campaign Ideas', desc: 'Brainstorm viral ideas.' },
        ]
      }
    },
    team: {
      title: 'Our Team',
      subtitle: 'Experts building Indonesia\'s AI future.',
      members: [
        { role: 'CEO & Lead Engineer', desc: 'Pioneer of Velicia AI development.' },
        { role: 'AI Researcher', desc: 'Contextual multimodal model research.' },
        { role: 'Head of Operations', desc: 'Cloud infrastructure scalability.' },
        { role: 'UX Designer', desc: 'Intuitive AI interaction experience.' },
        { role: 'Secretary & Ops', desc: 'Administrative management and strategic minutes.' }
      ]
    },
    faq: {
      title: 'FAQ',
      items: [
        { q: 'What is Velicia?', a: 'Independent AI assistant with cutting-edge architecture for productivity.' },
        { q: 'How to use?', a: 'Start chatting on the dashboard immediately. Also available as Chrome extension.' },
        { q: 'Is it free?', a: 'Yes, free forever for personal use. Pro plans available.' },
        { q: 'How it works?', a: 'Uses a specially optimized independent AI engine with NLP.' }
      ]
    },
    footer: {
      text: 'Independent Artificial Intelligence for Indonesia.'
    }
  }
};

const MockupChat: React.FC<{ t: any }> = ({ t }) => {
  const [step, setStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(timer);
  }, [t]); 

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [step]);

  return (
    <div className="bg-gray-50 rounded-[1.5rem] overflow-hidden aspect-[16/10] border border-gray-100 relative shadow-inner">
      <div className="absolute inset-0 flex">
        <div className="hidden md:block w-40 lg:w-56 bg-white border-r border-gray-100 p-3 space-y-3">
          <div className="flex gap-1.5 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
          </div>
          <div className="space-y-3 opacity-60">
             <div className="h-1.5 w-full bg-gray-100 rounded-full"></div>
             <div className="h-1.5 w-3/4 bg-gray-100 rounded-full"></div>
             <div className="h-1.5 w-5/6 bg-gray-100 rounded-full"></div>
             <div className="h-1.5 w-2/3 bg-gray-100 rounded-full"></div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-50">
             <div className="w-8 h-8 rounded-full bg-purple-100 mb-2"></div>
             <div className="h-1.5 w-1/2 bg-gray-100 rounded-full"></div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 p-4 md:p-6 flex flex-col overflow-y-auto no-scrollbar scroll-smooth"
        >
          <div className="flex gap-3 mb-2 max-w-[90%] animate-in fade-in duration-500">
            <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="h-8 w-auto object-contain shrink-0" />
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
              <p className="text-xs md:text-sm font-medium text-gray-800">{t.hero.mockupText}</p>
            </div>
          </div>

          {/* Suggestion Chips - Visual Components */}
          {step === 0 && (
             <div className="flex gap-2 ml-11 mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
                <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 shadow-sm hover:bg-gray-50 cursor-pointer flex items-center gap-1">
                   <Sparkles size={10} className="text-yellow-500"/> Ide Kreatif
                </span>
                <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 shadow-sm hover:bg-gray-50 cursor-pointer flex items-center gap-1">
                   <BarChart3 size={10} className="text-blue-500"/> Analisis
                </span>
             </div>
          )}

          {step >= 1 && (
            <div className="flex gap-3 mb-6 flex-row-reverse self-end max-w-fit animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-8 h-8 rounded-full bg-black shrink-0 flex items-center justify-center text-white">
                <Brain size={14} />
              </div>
              <div className="bg-black text-white p-3 rounded-2xl rounded-tr-none shadow-md">
                <p className="text-xs md:text-sm font-medium">{t.hero.mockupPrompt}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex gap-3 mb-6 animate-in fade-in duration-300">
              <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="h-8 w-auto object-contain shrink-0 animate-pulse" />
              <div className="flex gap-1.5 mt-3">
                <div className="w-1.5 h-1.5 bg-[#7928CA] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-[#7928CA] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {step >= 3 && (
            <div className="flex gap-3 mb-6 max-w-[95%] animate-in slide-in-from-bottom-4 duration-700">
              <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="h-8 w-auto object-contain shrink-0" />
              <div className="flex flex-col gap-2">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                    <p className="text-xs md:text-sm font-medium text-gray-800 leading-relaxed">
                      {t.hero.mockupResponse}
                    </p>
                  </div>
                  
                  {/* Rich Component inside Response */}
                  <div className="p-3 bg-white rounded-xl border border-purple-100 shadow-sm w-full max-w-[220px] animate-in fade-in zoom-in-95 duration-500 delay-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 bg-purple-50 rounded-lg"><Zap size={12} className="text-purple-600" /></div>
                        <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">Velicia Capabilities</span>
                      </div>
                      
                      <div className="space-y-2">
                          <div>
                             <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-0.5">
                                <span>Context</span>
                                <span>98%</span>
                             </div>
                             <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[98%] rounded-full"></div>
                             </div>
                          </div>
                          <div>
                             <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-0.5">
                                <span>Speed</span>
                                <span>120ms</span>
                             </div>
                             <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full w-[92%] rounded-full"></div>
                             </div>
                          </div>
                      </div>
                  </div>

                  {step >= 4 && (
                    <div className="mt-1 flex items-center gap-1.5 text-[9px] font-bold text-[#7928CA] uppercase tracking-widest animate-in fade-in duration-500">
                        <ShieldCheck size={10} /> {t.hero.mockupPowered}
                    </div>
                  )}
              </div>
            </div>
          )}
          <div className="h-4 w-full shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onReadArticle }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProfession, setActiveProfession] = useState('Entrepreneur');
  const [scrolled, setScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);
  const [lang, setLang] = useState<'id' | 'en'>('id');

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLang(prev => prev === 'id' ? 'en' : 'id');
  };

  const blogImages = [
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop", // Meeting/Launch image
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop"
  ];

  const blogDates = ["28 Jan", "12 Okt", "08 Okt"];

  const professions = [
    { id: 'Entrepreneur', label: lang === 'id' ? 'Bisnis' : 'Business', icon: <Briefcase size={14}/> },
    { id: 'Konsultan', label: lang === 'id' ? 'Konsultan' : 'Consultant', icon: <Monitor size={14}/> },
    { id: 'Peneliti', label: lang === 'id' ? 'Riset' : 'Research', icon: <Search size={14}/> },
    { id: 'Pengembang', label: lang === 'id' ? 'Dev' : 'Dev', icon: <Brain size={14}/> },
    { id: 'Pemasaran', label: lang === 'id' ? 'Marketing' : 'Marketing', icon: <Sparkles size={14}/> },
  ];

  const professionIcons: Record<string, React.ElementType[]> = {
    'Entrepreneur': [Layout, Brain, FileText, Mail],
    'Konsultan': [Layout, Brain],
    'Peneliti': [FileText, Search],
    'Pengembang': [Monitor, Zap],
    'Pemasaran': [PenTool, Sparkles]
  };

  const teamMembers = [
    { name: 'M Fariz', color: 'from-[#7928CA] to-[#FF0080]' },
    { name: 'Sarah A', color: 'from-[#FF0080] to-[#FF4D4D]' },
    { name: 'Andi W', color: 'from-[#0070F3] to-[#00DFD8]' },
    { name: 'Riana P', color: 'from-[#F5A623] to-[#F76B1C]' },
    { name: 'Dwi Putri', color: 'from-[#06b6d4] to-[#3b82f6]' } // Ensure Dwi Putri is here
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-pink-100 selection:text-pink-900 overflow-x-hidden">
      
      {/* --- MOBILE MENU OVERLAY --- */}
      <div className={`fixed inset-0 bg-white z-[60] flex flex-col transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
             <div className="flex items-center gap-2">
                 <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="h-8 w-auto object-contain" />
             </div>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                 <X size={20} />
             </button>
          </div>
          <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
             <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-gray-900">{t.nav.features}</a>
             <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-gray-900">{t.nav.pricing}</a>
             <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-gray-900">{t.nav.blog}</a>
             
             <div className="mt-6 pt-6 border-t border-gray-100">
                 <button 
                    onClick={toggleLanguage}
                    className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-xl border border-gray-100"
                 >
                    <div className="flex items-center gap-3">
                        <Globe size={18} className="text-[#7928CA]" />
                        <span className="font-bold text-sm">{t.nav.langLabel === 'ID' ? 'Bahasa Indonesia' : 'English'}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-white rounded-md text-[10px] font-bold shadow-sm border border-gray-100">
                        SWITCH
                    </div>
                 </button>
             </div>
          </div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="h-10 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500" />
          </div>

          <div className="hidden md:flex items-center gap-4">
             {['Features', 'Pricing', 'About'].map((item) => (
                <button key={item} className="text-sm font-semibold text-gray-600 hover:text-[#FF0080] transition-colors">{item}</button>
             ))}
             <div className="w-px h-4 bg-gray-200 mx-2"></div>
             <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-white rounded-full border border-gray-200 text-xs font-bold text-gray-700 cursor-pointer transition-all active:scale-95"
             >
                <span>{t.nav.langLabel}</span>
             </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 px-6 bg-white overflow-hidden">
        
        {/* Updated: Reverted opacity-60 for softer glow */}
        <div className="hero-glow"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative inline-block rounded-full bg-black shadow-lg mx-auto overflow-hidden px-8 py-2">
                <div className="btn-shine text-xs md:text-sm">{t.hero.badge}</div>
              </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000 mb-6 leading-[1.1]">
             {t.hero.title1}
             <div className="relative inline-block ml-3">
                 {/* Reverted to Text Gradient */}
                <span className="text-vivid-gradient">
                   {t.hero.title2}
                </span>
             </div>
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
             {t.hero.desc}
          </p>

          <div className="flex flex-col items-center gap-8 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
             <div className="flex flex-wrap justify-center gap-4">
               {/* Resized Start Button */}
               <button type="button" className="uiverse-button !min-w-[200px] !py-3 !px-8" onClick={onEnterApp}>
                <span className="fold"></span>
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="text-white font-bold text-base">{t.hero.startBtn}</span>
                </div>
               </button>

               {/* Resized Universe Button */}
               <a 
                 href="https://hezell-universe.vercel.app/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="btn-github !min-w-[160px] !py-3 !px-6 !text-sm"
               >
                <Globe size={18} className="text-white" />
                <span className="font-bold">{t.hero.viewUniverse}</span>
               </a>
             </div>
             <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{t.hero.disclaimer}</p>
          </div>

          {/* DYNAMIC DASHBOARD MOCKUP */}
          <div className="relative max-w-4xl mx-auto group perspective-1000 mb-8">
             {/* INCREASED OPACITY AND SHARPER GRADIENT FOR MOCKUP GLOW */}
             <div className="absolute -inset-2 bg-gradient-to-r from-[#7928CA] to-[#FF0080] rounded-[2rem] opacity-30 blur-2xl group-hover:opacity-40 transition-all duration-700"></div>
             <div className="relative bg-white rounded-[1.5rem] p-2 md:p-3 shadow-xl border border-gray-100 transform transition-transform duration-1000 hover:rotate-x-1">
                <MockupChat t={t} />
             </div>
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section className="py-20 bg-[#FAFAFA] relative overflow-hidden">
         <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center tracking-tight">{t.blog.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.blog.articles.map((article, i) => (
                    <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                        <div className="h-48 w-full overflow-hidden relative">
                             <img 
                                src={blogImages[i]} 
                                alt={article.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                             />
                             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide text-[#7928CA] shadow-sm">
                                {article.tag}
                             </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold mb-3 uppercase tracking-wider">
                                <Calendar size={12} />
                                {blogDates[i]}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#FF0080] transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2 opacity-80">
                                {article.desc}
                            </p>
                            <button 
                                onClick={() => onReadArticle(article.id)}
                                className="flex items-center gap-2 text-[#7928CA] font-bold text-xs hover:gap-4 transition-all"
                            >
                                {t.blog.readMore} <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center">
                <button className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-900 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm">
                    {t.blog.viewAll}
                </button>
            </div>
         </div>
      </section>

      {/* --- PROFESSIONAL SECTION --- */}
      <section className="py-20 bg-white">
         <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12 tracking-tight">{t.profession.title}</h2>
            <div className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap justify-start md:justify-center gap-3 mb-12 no-scrollbar">
                {professions.map(p => (
                    <button 
                        key={p.id}
                        onClick={() => setActiveProfession(p.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all border whitespace-nowrap ${activeProfession === p.id ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                    >
                        {p.icon}
                        {p.label}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(t.profession.items[activeProfession as keyof typeof t.profession.items] || []).map((item, i) => {
                    const Icons = professionIcons[activeProfession] || [Layout];
                    const Icon = Icons[i % Icons.length];
                    return (
                      <div key={i} className="flex gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-md transition-all group items-start">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:bg-[#7928CA] group-hover:text-white transition-all">
                              <Icon size={20} />
                          </div>
                          <div className="flex flex-col">
                              <h4 className="text-base font-bold text-gray-900 mb-2">{item.title}</h4>
                              <p className="text-gray-500 leading-snug text-sm font-medium">{item.desc}</p>
                          </div>
                      </div>
                    );
                })}
            </div>
         </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="py-20 bg-[#FAFAFA] border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{t.team.title}</h2>
                 <p className="text-gray-500 font-semibold text-lg max-w-2xl mx-auto opacity-70">
                    {t.team.subtitle}
                 </p>
              </div>
              {/* Updated Grid for 5 members */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                 {teamMembers.map((member, i) => (
                    <div key={i} className="group relative bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} mb-6 flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:rotate-6`}>
                             <Brain size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                        {/* Increased font size for role visibility as requested */}
                        <p className={`text-[10px] font-bold tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r ${member.color}`}>
                           {t.team.members[i]?.role}
                        </p>
                        <p className="text-gray-400 font-medium text-xs leading-relaxed italic opacity-80 line-clamp-3">"{t.team.members[i]?.desc}"</p>
                    </div>
                 ))}
              </div>
          </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 bg-white">
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 text-center mb-12 tracking-tight">{t.faq.title}</h2>
            <div className="space-y-4">
                {t.faq.items.map((faq, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl p-2 bg-gray-50/50">
                        <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between p-4 text-left font-bold text-lg text-gray-900 hover:text-[#7928CA] transition-colors">
                            <span>{faq.q}</span>
                            <ChevronDown size={20} className={`text-gray-300 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180 text-[#7928CA]' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ${openFaqIndex === i ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <p className="px-4 pb-4 text-gray-500 text-sm leading-relaxed font-medium">{faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-100 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="h-12 w-auto object-contain opacity-80" />
              </div>
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
                &copy; 2026 VELICIA AI TECHNOLOGIES. <br/> 
                {t.footer.text}
              </p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
