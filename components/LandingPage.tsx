
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Search, PenTool, Image as ImageIcon, 
  FileText, Globe, Play, Menu, X, 
  ChevronDown, Star, Layout, Sparkles, Smartphone, Monitor, Chrome, Brain, Mail, Briefcase, Zap,
  Linkedin, Github, Twitter, Calendar, ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  initialScrollTo?: string | null;
}

// --- TRANSLATIONS DATA ---
const TRANSLATIONS = {
  id: {
    nav: {
      langLabel: 'Bahasa Indonesia',
      features: 'Fitur',
      pricing: 'Harga',
      blog: 'Blog',
      about: 'Tentang'
    },
    hero: {
      badge: 'Velicia AI Masa Depan',
      title1: 'AI Asisten Cerdas',
      title2: 'Indonesia',
      desc: 'Velicia dikembangkan untuk Masa Depan Nusantara. Peningkatan Efisiensi, Pemahaman Mendalam, Multimodal, dan Respon yang Cepat.',
      startBtn: 'Mulai dengan Velicia',
      viewUniverse: 'Lihat Universe',
      disclaimer: 'Gratis selamanya • Tidak perlu kartu kredit',
      mockupText: 'Halo! Saya Velicia AI. Ada yang bisa saya bantu?',
      mockupPrompt: 'Jelaskan kemampuan utamamu dalam satu kalimat.',
      mockupResponse: 'Saya menyediakan kecerdasan multimodal tingkat lanjut, penalaran cepat, dan pemahaman konteks mendalam untuk meningkatkan produktivitas Anda secara mandiri.',
      mockupPowered: 'Ditenagai oleh Velicia Engine'
    },
    blog: {
      title: 'Blog & Berita Terkini',
      readMore: 'Selengkapnya',
      viewAll: 'Lihat Semua Artikel',
      articles: [
        {
          title: "Visi Velicia AI: Membangun Kedaulatan Digital Indonesia",
          desc: "Menjelajahi bagaimana Velicia AI dirancang sebagai solusi mandiri untuk kebutuhan teknologi nasional dengan pemrosesan bahasa alami terbaik.",
          tag: "Visi"
        },
        {
          title: "Optimasi Alur Kerja dengan Fitur Ringkasan Velicia",
          desc: "Cara menghemat waktu berjam-jam setiap minggu menggunakan algoritma ekstraksi informasi cerdas kami yang memahami konteks lokal.",
          tag: "Produktivitas"
        },
        {
          title: "Memahami Pemrosesan Bahasa Alami Lokal Nusantara",
          desc: "Bagaimana Velicia memahami dialek dan konteks budaya Indonesia lebih baik melalui pelatihan model mandiri kami yang intensif.",
          tag: "Teknologi"
        }
      ]
    },
    profession: {
      title: 'Dibuat untuk profesional.',
      items: {
        'Entrepreneur': [
          { title: 'Navigator intelijen pasar', desc: 'Melakukan analisis pesaing dan melacak tren pasar untuk menghasilkan laporan yang dapat ditindaklanjuti.' },
          { title: 'Pendamping pemikiran strategis', desc: 'Menganalisis tantangan bisnis dan mengidentifikasi informasi kunci untuk menghasilkan solusi strategis.' },
          { title: 'Penganalisis dokumen cerdas', desc: 'Menarik poin-poin penting dari kontrak dan laporan serta menyoroti detail penting.' },
          { title: 'Asisten email kontekstual', desc: 'Mengambil esensi email dan mengajukan saran tanggapan berdasarkan konteks.' },
        ],
        'Konsultan': [
            { title: 'Pembuat Presentasi Otomatis', desc: 'Membuat kerangka presentasi yang menarik dalam hitungan detik.' },
            { title: 'Analisis Data Cepat', desc: 'Mengubah data mentah menjadi wawasan yang mudah dipahami klien.' },
        ],
        'Peneliti': [
            { title: 'Peringkas Jurnal', desc: 'Membaca dan meringkas ribuan kata jurnal ilmiah dalam sekejap.' },
            { title: 'Pencari Referensi', desc: 'Menemukan sumber kredibel dan sitasi yang relevan.' },
        ],
        'Pengembang': [
            { title: 'Pembuat Kode', desc: 'Menulis boilerplate code dan fungsi kompleks dalam berbagai bahasa.' },
            { title: 'Debugger AI', desc: 'Menemukan bug dan memberikan solusi perbaikan instan.' },
        ],
        'Pemasaran': [
            { title: 'Copywriter Kreatif', desc: 'Menulis copy iklan yang menarik dan persuasif.' },
            { title: 'Ide Kampanye', desc: 'Brainstorming ide kampanye viral berdasarkan tren terkini.' },
        ]
      }
    },
    team: {
      title: 'Tim Kami',
      subtitle: 'Bertemu dengan para ahli yang membangun masa depan kecerdasan buatan untuk Indonesia.',
      members: [
        { role: 'CEO & Lead Engineer', desc: 'Pelopor pengembangan Velicia AI dengan pengalaman luas di bidang rekayasa AI dan antarmuka pengguna.' },
        { role: 'AI Researcher', desc: 'Bertanggung jawab atas riset model multimodal untuk memastikan Velicia memiliki pemahaman kontekstual mendalam.' },
        { role: 'Head of Operations', desc: 'Mengelola skalabilitas infrastruktur cloud untuk memberikan respon asisten yang secepat kilat bagi pengguna.' },
        { role: 'UX Designer', desc: 'Menciptakan pengalaman interaksi AI yang paling intuitif, ramah, dan manusiawi untuk masyarakat Indonesia.' }
      ]
    },
    faq: {
      title: 'FAQ',
      items: [
        { q: 'Apa itu Velicia?', a: 'Velicia adalah asisten AI mandiri yang dikembangkan dengan arsitektur kecerdasan buatan mutakhir untuk membantu produktivitas masyarakat Indonesia dengan pemahaman konteks lokal yang mendalam.' },
        { q: 'Bagaimana cara saya menggunakan Velicia?', a: 'Sangat mudah! Anda bisa langsung mulai mengobrol, mencari informasi, atau membuat konten melalui dashboard utama kami. Velicia juga tersedia sebagai ekstensi Chrome.' },
        { q: 'Apakah Velicia gratis?', a: 'Ya, Velicia menawarkan akses gratis selamanya dengan kuota harian yang cukup untuk kebutuhan personal. Kami juga menyediakan paket Pro bagi profesional.' },
        { q: 'Bagaimana Velicia bekerja?', a: 'Velicia menggunakan mesin AI mandiri yang dioptimalkan secara khusus. Sistem kami memproses input Anda dengan algoritma pemahaman bahasa alami yang canggih.' }
      ]
    },
    footer: {
      text: 'Kecerdasan Buatan Mandiri untuk Indonesia.'
    }
  },
  en: {
    nav: {
      langLabel: 'English (US)',
      features: 'Features',
      pricing: 'Pricing',
      blog: 'Blog',
      about: 'About'
    },
    hero: {
      badge: 'Velicia AI Future',
      title1: 'Intelligent AI Assistant',
      title2: 'Indonesia',
      desc: 'Velicia is developed for the Future of Nusantara. Enhanced Efficiency, Deep Understanding, Multimodal, and Rapid Response.',
      startBtn: 'Start with Velicia',
      viewUniverse: 'View Universe',
      disclaimer: 'Free forever • No credit card required',
      mockupText: 'Hello! I am Velicia AI. How can I assist you today?',
      mockupPrompt: 'Explain your core capabilities in one sentence.',
      mockupResponse: 'I provide advanced multimodal intelligence, rapid reasoning, and deep context understanding to boost your productivity independently.',
      mockupPowered: 'Powered by Velicia Engine'
    },
    blog: {
      title: 'Blog & Latest News',
      readMore: 'Read More',
      viewAll: 'View All Articles',
      articles: [
        {
          title: "Velicia AI Vision: Building Indonesia's Digital Sovereignty",
          desc: "Exploring how Velicia AI is designed as an independent solution for national technology needs with the best natural language processing.",
          tag: "Vision"
        },
        {
          title: "Optimizing Workflow with Velicia Summary Features",
          desc: "How to save hours every week using our intelligent information extraction algorithms that understand local context.",
          tag: "Productivity"
        },
        {
          title: "Understanding Archipelago Local Natural Language Processing",
          desc: "How Velicia understands Indonesian dialects and cultural contexts better through our intensive independent model training.",
          tag: "Technology"
        }
      ]
    },
    profession: {
      title: 'Built for professionals.',
      items: {
        'Entrepreneur': [
          { title: 'Market Intelligence Navigator', desc: 'Conduct competitor analysis and track market trends to generate actionable reports.' },
          { title: 'Strategic Thought Partner', desc: 'Analyze business challenges and identify key information to generate strategic solutions.' },
          { title: 'Intelligent Document Analyzer', desc: 'Extract key points from contracts and reports and highlight important details.' },
          { title: 'Contextual Email Assistant', desc: 'Capture the essence of emails and suggest responses based on context.' },
        ],
        'Konsultan': [ // Keep key as ID for mapping icons
            { title: 'Automated Presentation Creator', desc: 'Create compelling presentation outlines in seconds.' },
            { title: 'Rapid Data Analysis', desc: 'Turn raw data into insights that are easy for clients to understand.' },
        ],
        'Peneliti': [
            { title: 'Journal Summarizer', desc: 'Read and summarize thousands of scientific journal words in an instant.' },
            { title: 'Reference Finder', desc: 'Find credible sources and relevant citations.' },
        ],
        'Pengembang': [
            { title: 'Code Generator', desc: 'Write boilerplate code and complex functions in various languages.' },
            { title: 'AI Debugger', desc: 'Find bugs and provide instant fix solutions.' },
        ],
        'Pemasaran': [
            { title: 'Creative Copywriter', desc: 'Write compelling and persuasive ad copy.' },
            { title: 'Campaign Ideation', desc: 'Brainstorm viral campaign ideas based on current trends.' },
        ]
      }
    },
    team: {
      title: 'Our Team',
      subtitle: 'Meet the experts building the future of artificial intelligence for Indonesia.',
      members: [
        { role: 'CEO & Lead Engineer', desc: 'Pioneer of Velicia AI development with extensive experience in AI engineering and user interfaces.' },
        { role: 'AI Researcher', desc: 'Responsible for multimodal model research to ensure Velicia has deep contextual understanding.' },
        { role: 'Head of Operations', desc: 'Managing cloud infrastructure scalability to provide lightning-fast assistant responses for users.' },
        { role: 'UX Designer', desc: 'Creating the most intuitive, friendly, and humane AI interaction experience for Indonesian society.' }
      ]
    },
    faq: {
      title: 'FAQ',
      items: [
        { q: 'What is Velicia?', a: 'Velicia is an independent AI assistant developed with cutting-edge artificial intelligence architecture to help productivity with deep local context understanding.' },
        { q: 'How do I use Velicia?', a: 'It\'s very easy! You can start chatting, searching for information, or creating content directly through our main dashboard. Velicia is also available as a Chrome extension.' },
        { q: 'Is Velicia free?', a: 'Yes, Velicia offers free access forever with a daily quota sufficient for personal needs. We also provide Pro packages for professionals.' },
        { q: 'How does Velicia work?', a: 'Velicia uses a specially optimized independent AI engine. Our system processes your input with advanced natural language understanding algorithms.' }
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
    }, 4000);
    return () => clearInterval(timer);
  }, [t]); // Reset when translation changes

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
        <div className="hidden md:block w-48 lg:w-64 bg-white border-r border-gray-100 p-4 space-y-4">
          <div className="flex gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="space-y-4">
             <div className="h-2 w-full bg-gray-100 rounded-full"></div>
             <div className="h-2 w-3/4 bg-gray-100 rounded-full"></div>
             <div className="h-2 w-5/6 bg-gray-100 rounded-full"></div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 p-4 md:p-8 flex flex-col overflow-y-auto no-scrollbar scroll-smooth"
        >
          <div className="flex gap-3 md:gap-4 mb-8 max-w-2xl animate-in fade-in duration-500">
            <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-10 h-10 object-contain shrink-0" />
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
              <p className="text-xs md:text-sm font-bold text-gray-800">{t.hero.mockupText}</p>
            </div>
          </div>

          {step >= 1 && (
            <div className="flex gap-3 md:gap-4 mb-8 flex-row-reverse self-end max-w-md w-fit animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-10 h-10 rounded-full bg-black shrink-0 flex items-center justify-center text-white">
                <Brain size={18} />
              </div>
              <div className="bg-black text-white p-4 rounded-2xl rounded-tr-none shadow-xl">
                <p className="text-xs md:text-sm font-bold tracking-tight">{t.hero.mockupPrompt}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex gap-3 md:gap-4 mb-8 animate-in fade-in duration-300">
              <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-10 h-10 object-contain shrink-0 animate-pulse" />
              <div className="flex gap-2 mt-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {step >= 3 && (
            <div className="flex gap-3 md:gap-4 mb-8 max-w-2xl animate-in slide-in-from-bottom-4 duration-700">
              <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-10 h-10 object-contain shrink-0" />
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                <p className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed">
                  {t.hero.mockupResponse}
                </p>
                {step >= 4 && (
                   <div className="mt-4 pt-4 border-t border-gray-50 animate-in fade-in duration-1000">
                      <div className="flex items-center gap-2 text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">
                         <Zap size={10} /> {t.hero.mockupPowered}
                      </div>
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

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
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
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
  ];

  const blogDates = ["12 Okt 2025", "08 Okt 2025", "05 Okt 2025"];

  const professions = [
    { id: 'Entrepreneur', label: lang === 'id' ? 'Entrepreneur' : 'Entrepreneur', icon: <Briefcase size={16}/> },
    { id: 'Konsultan', label: lang === 'id' ? 'Konsultan' : 'Consultant', icon: <Monitor size={16}/> },
    { id: 'Peneliti', label: lang === 'id' ? 'Peneliti' : 'Researcher', icon: <Search size={16}/> },
    { id: 'Pengembang', label: lang === 'id' ? 'Pengembang' : 'Developer', icon: <Brain size={16}/> },
    { id: 'Pemasaran', label: lang === 'id' ? 'Pemasaran' : 'Marketing', icon: <Sparkles size={16}/> },
  ];

  const professionIcons: Record<string, React.ElementType[]> = {
    'Entrepreneur': [Layout, Brain, FileText, Mail],
    'Konsultan': [Layout, Brain],
    'Peneliti': [FileText, Search],
    'Pengembang': [Monitor, Zap],
    'Pemasaran': [PenTool, Sparkles]
  };

  const teamMembers = [
    { name: 'M Fariz Alfauzi', color: 'from-purple-600 to-indigo-600' },
    { name: 'Sarah Amalia', color: 'from-pink-600 to-rose-600' },
    { name: 'Andi Wijaya', color: 'from-blue-600 to-cyan-600' },
    { name: 'Riana Putri', color: 'from-orange-600 to-amber-600' }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-pink-100 selection:text-pink-900 overflow-x-hidden">
      
      {/* --- MOBILE MENU OVERLAY --- */}
      <div className={`fixed inset-0 bg-white z-[60] flex flex-col transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
             <div className="flex items-center gap-3">
                 <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-8 h-8 object-contain" />
                 <span className="text-xl font-black tracking-tighter text-gray-900">Velicia</span>
             </div>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                 <X size={24} />
             </button>
          </div>
          <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
             <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-gray-900">{t.nav.features}</a>
             <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-gray-900">{t.nav.pricing}</a>
             <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-gray-900">{t.nav.blog}</a>
             
             <div className="mt-8 pt-8 border-t border-gray-100">
                 <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 block">Language</span>
                 <button 
                    onClick={toggleLanguage}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-2xl border border-gray-100"
                 >
                    <div className="flex items-center gap-3">
                        <Globe size={20} className="text-purple-600" />
                        <span className="font-bold text-lg">{t.nav.langLabel}</span>
                    </div>
                    <div className="px-3 py-1 bg-white rounded-lg text-xs font-black shadow-sm border border-gray-100">
                        SWITCH
                    </div>
                 </button>
             </div>
          </div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-2xl border-b border-gray-100 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
            <span className="text-2xl font-black tracking-tighter text-gray-900">Velicia</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
             <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-white/50 hover:bg-white rounded-full border border-gray-100 text-sm font-extrabold text-gray-700 cursor-pointer transition-all active:scale-95"
             >
                <Globe size={14} className="text-purple-600" />
                <span>{t.nav.langLabel}</span>
             </button>
             <button className="p-3 text-gray-600 hover:text-black hover:bg-gray-100 rounded-2xl transition-all" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} strokeWidth={2.5} />
             </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={26} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-24 px-6 bg-white overflow-hidden">
        
        {/* ENHANCED VIVID BACKGROUND GLOW */}
        <div className="hero-glow"></div>
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[110%] h-[500px] bg-gradient-to-r from-purple-600/30 via-velicia-vivid/20 to-pink-500/30 blur-[130px] rounded-full animate-vivid-pulse pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative inline-block rounded-full bg-black shadow-2xl mx-auto overflow-hidden px-12 py-4">
                <div className="btn-shine">{t.hero.badge}</div>
              </div>
          </div>

          <h1 className="text-[3.25rem] leading-[1.0] md:text-[6.5rem] lg:text-[7.5rem] font-black text-gray-900 tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000 mb-10">
             {t.hero.title1}<br/>
             <div className="relative inline-block mt-4">
                <span className="text-vivid-gradient drop-shadow-md">
                   {t.hero.title2}
                </span>
                <div className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 to-pink-500 blur-md opacity-40"></div>
             </div>
          </h1>

          <p className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto mb-14 leading-relaxed font-bold tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
             {t.hero.desc}
          </p>

          <div className="flex flex-col items-center gap-10 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
             <div className="flex flex-wrap justify-center gap-6">
               {/* Perfectly Centered Start Button */}
               <button type="button" className="uiverse-button" onClick={onEnterApp}>
                <span className="fold"></span>
                <div className="flex items-center justify-center gap-3 w-full">
                  <img src="/logoApp/logo-app.png" className="w-7 h-7 object-contain" alt="Velicia logo" />
                  <span className="text-white font-black text-xl">{t.hero.startBtn}</span>
                </div>
               </button>

               {/* Perfectly Centered Universe Button */}
               <a 
                 href="https://hezell-universe.vercel.app/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="btn-github"
               >
                <Globe size={22} className="text-white" />
                <span className="font-black">{t.hero.viewUniverse}</span>
               </a>
             </div>
             <p className="text-sm text-gray-400 font-black tracking-[0.3em]">{t.hero.disclaimer}</p>
          </div>

          {/* DYNAMIC DASHBOARD MOCKUP */}
          <div className="relative max-w-6xl mx-auto group perspective-1000 mb-12">
             <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-[3rem] opacity-25 blur-3xl group-hover:opacity-40 transition-all duration-700"></div>
             <div className="relative bg-white rounded-[2.5rem] p-3 md:p-5 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] border border-gray-100 transform transition-transform duration-1000 hover:rotate-x-2">
                <MockupChat t={t} />
             </div>
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section className="py-32 bg-[#FAFAFA] relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-24 text-center tracking-tighter">{t.blog.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {t.blog.articles.map((article, i) => (
                    <div key={i} className="bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                        <div className="h-72 w-full overflow-hidden relative">
                             <img 
                                src={blogImages[i]} 
                                alt={article.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                             />
                             <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-[0.1em] text-purple-600 shadow-xl">
                                {article.tag}
                             </div>
                        </div>
                        
                        <div className="p-12">
                            <div className="flex items-center gap-3 text-gray-400 text-[12px] font-black mb-6 uppercase tracking-[0.2em]">
                                <Calendar size={14} />
                                {blogDates[i]}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-6 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-gray-500 text-lg font-bold leading-relaxed mb-10 line-clamp-3 opacity-80">
                                {article.desc}
                            </p>
                            <button className="flex items-center gap-3 text-purple-600 font-black text-base hover:gap-6 transition-all">
                                {t.blog.readMore} <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-24 text-center">
                <button className="px-12 py-6 bg-white border-2 border-gray-100 rounded-[2rem] font-black text-gray-900 hover:bg-black hover:text-white hover:border-black transition-all shadow-xl hover:shadow-2xl active:scale-95">
                    {t.blog.viewAll}
                </button>
            </div>
         </div>
      </section>

      {/* --- PROFESSIONAL SECTION --- */}
      <section className="py-32 bg-white">
         <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 text-center mb-20 tracking-tighter">{t.profession.title}</h2>
            <div className="flex overflow-x-auto pb-8 md:pb-0 md:flex-wrap justify-start md:justify-center gap-5 mb-24 no-scrollbar">
                {professions.map(p => (
                    <button 
                        key={p.id}
                        onClick={() => setActiveProfession(p.id)}
                        className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black transition-all border-2 whitespace-nowrap ${activeProfession === p.id ? 'bg-black text-white border-black shadow-2xl scale-110' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
                    >
                        {p.icon}
                        {p.label}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {(t.profession.items[activeProfession as keyof typeof t.profession.items] || []).map((item, i) => {
                    const Icons = professionIcons[activeProfession] || [Layout];
                    const Icon = Icons[i % Icons.length];
                    return (
                      <div key={i} className="flex gap-10 p-12 bg-gray-50 rounded-[4rem] border border-gray-100 hover:bg-white hover:shadow-[0_50px_100px_-25px_rgba(0,0,0,0.1)] transition-all group">
                          <div className="w-20 h-20 rounded-[1.75rem] bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:bg-purple-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                              <Icon size={32} />
                          </div>
                          <div className="flex flex-col justify-center">
                              <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{item.title}</h4>
                              <p className="text-gray-500 leading-relaxed text-lg font-bold opacity-80">{item.desc}</p>
                          </div>
                      </div>
                    );
                })}
            </div>
         </div>
      </section>

      {/* --- TEAM WORK SECTION --- */}
      <section className="py-32 bg-[#FAFAFA] border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-24">
                 <h2 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter">{t.team.title}</h2>
                 <p className="text-gray-500 font-extrabold text-2xl max-w-3xl mx-auto opacity-70 leading-relaxed">
                    {t.team.subtitle}
                 </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                 {teamMembers.map((member, i) => (
                    <div key={i} className="group relative bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm hover:shadow-[0_50px_110px_-25px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-4 flex flex-col items-center text-center">
                        <div className={`w-28 h-28 rounded-[2.5rem] bg-gradient-to-br ${member.color} mb-10 flex items-center justify-center text-white shadow-2xl transform transition-transform group-hover:rotate-12`}>
                             <Brain size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{member.name}</h3>
                        <p className={`text-[10px] font-black tracking-[0.4em] uppercase mb-8 text-transparent bg-clip-text bg-gradient-to-r ${member.color}`}>
                           {t.team.members[i].role}
                        </p>
                        <p className="text-gray-500 font-bold text-lg leading-relaxed mb-10 italic opacity-80">"{t.team.members[i].desc}"</p>
                        <div className="flex items-center gap-5 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                             <button className="p-4 bg-gray-50 hover:bg-purple-600 text-gray-400 hover:text-white rounded-full transition-all"><Linkedin size={22}/></button>
                             <button className="p-4 bg-gray-50 hover:bg-black text-gray-400 hover:text-white rounded-full transition-all"><Github size={22}/></button>
                        </div>
                    </div>
                 ))}
              </div>
          </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-32 bg-white">
         <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-7xl font-black text-gray-900 text-center mb-24 tracking-tighter">{t.faq.title}</h2>
            <div className="space-y-8">
                {t.faq.items.map((faq, i) => (
                    <div key={i} className="border-b-4 border-gray-50 last:border-0">
                        <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between py-10 text-left font-black text-2xl text-gray-900 hover:text-purple-600 transition-all group">
                            <span>{faq.q}</span>
                            <ChevronDown size={28} className={`text-gray-200 transition-transform duration-500 ${openFaqIndex === i ? 'rotate-180 text-purple-600 scale-125' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ${openFaqIndex === i ? 'max-h-[500px] pb-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <p className="text-gray-500 leading-relaxed text-xl font-bold opacity-80">{faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-24 border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="flex items-center justify-center gap-5 mb-12">
                <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-14 h-14 object-contain" />
                <span className="text-4xl font-black text-gray-900 tracking-tighter">Velicia</span>
              </div>
              <p className="text-sm text-gray-400 font-black tracking-[0.5em] uppercase leading-loose">
                &copy; 2026 VELICIA AI TECHNOLOGIES. <br/> 
                {t.footer.text}
              </p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
