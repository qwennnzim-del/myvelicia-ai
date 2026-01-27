
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

const MockupChat: React.FC = () => {
  const [step, setStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
              <p className="text-xs md:text-sm font-bold text-gray-800">Hello! I am Velicia AI. How can I assist you today?</p>
            </div>
          </div>

          {step >= 1 && (
            <div className="flex gap-3 md:gap-4 mb-8 flex-row-reverse self-end max-w-md w-fit animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-10 h-10 rounded-full bg-black shrink-0 flex items-center justify-center text-white">
                <Brain size={18} />
              </div>
              <div className="bg-black text-white p-4 rounded-2xl rounded-tr-none shadow-xl">
                <p className="text-xs md:text-sm font-bold tracking-tight">Explain your core capabilities in one sentence.</p>
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
                  I provide advanced multimodal intelligence, rapid reasoning, and deep context understanding to boost your productivity independently.
                </p>
                {step >= 4 && (
                   <div className="mt-4 pt-4 border-t border-gray-50 animate-in fade-in duration-1000">
                      <div className="flex items-center gap-2 text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">
                         <Zap size={10} /> Powered by Velicia Engine
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const blogArticles = [
    {
      title: "Visi Velicia AI: Membangun Kedaulatan Digital Indonesia",
      desc: "Menjelajahi bagaimana Velicia AI dirancang sebagai solusi mandiri untuk kebutuhan teknologi nasional dengan pemrosesan bahasa alami terbaik.",
      date: "12 Okt 2025",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop",
      tag: "Visi"
    },
    {
      title: "Optimasi Alur Kerja dengan Fitur Ringkasan Velicia",
      desc: "Cara menghemat waktu berjam-jam setiap minggu menggunakan algoritma ekstraksi informasi cerdas kami yang memahami konteks lokal.",
      date: "08 Okt 2025",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop",
      tag: "Produktivitas"
    },
    {
      title: "Memahami Pemrosesan Bahasa Alami Lokal Nusantara",
      desc: "Bagaimana Velicia memahami dialek dan konteks budaya Indonesia lebih baik melalui pelatihan model mandiri kami yang intensif.",
      date: "05 Okt 2025",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
      tag: "Teknologi"
    }
  ];

  const professions = [
    { id: 'Entrepreneur', label: 'Entrepreneur', icon: <Briefcase size={16}/> },
    { id: 'Konsultan', label: 'Konsultan', icon: <Monitor size={16}/> },
    { id: 'Peneliti', label: 'Peneliti', icon: <Search size={16}/> },
    { id: 'Pengembang', label: 'Pengembang', icon: <Brain size={16}/> },
    { id: 'Pemasaran', label: 'Pemasaran', icon: <Sparkles size={16}/> },
  ];

  const professionContent: Record<string, {title: string, desc: string, icon: React.ElementType}[]> = {
    'Entrepreneur': [
      { title: 'Navigator intelijen pasar', desc: 'Melakukan analisis pesaing dan melacak tren pasar untuk menghasilkan laporan yang dapat ditindaklanjuti.', icon: Layout },
      { title: 'Pendamping pemikiran strategis', desc: 'Menganalisis tantangan bisnis dan mengidentifikasi informasi kunci untuk menghasilkan solusi strategis.', icon: Brain },
      { title: 'Penganalisis dokumen cerdas', desc: 'Menarik poin-poin penting dari kontrak dan laporan serta menyoroti detail penting.', icon: FileText },
      { title: 'Asisten email kontekstual', desc: 'Mengambil esensi email dan mengajukan saran tanggapan berdasarkan konteks.', icon: Mail },
    ],
    'Konsultan': [
        { title: 'Pembuat Presentasi Otomatis', desc: 'Membuat kerangka presentasi yang menarik dalam hitungan detik.', icon: Layout },
        { title: 'Analisis Data Cepat', desc: 'Mengubah data mentah menjadi wawasan yang mudah dipahami klien.', icon: Brain },
    ],
    'Peneliti': [
        { title: 'Peringkas Jurnal', desc: 'Membaca dan meringkas ribuan kata jurnal ilmiah dalam sekejap.', icon: FileText },
        { title: 'Pencari Referensi', desc: 'Menemukan sumber kredibel dan sitasi yang relevan.', icon: Search },
    ],
    'Pengembang': [
        { title: 'Pembuat Kode', desc: 'Menulis boilerplate code dan fungsi kompleks dalam berbagai bahasa.', icon: Monitor },
        { title: 'Debugger AI', desc: 'Menemukan bug dan memberikan solusi perbaikan instan.', icon: Zap },
    ],
    'Pemasaran': [
        { title: 'Copywriter Kreatif', desc: 'Menulis copy iklan yang menarik dan persuasif.', icon: PenTool },
        { title: 'Ide Kampanye', desc: 'Brainstorming ide kampanye viral berdasarkan tren terkini.', icon: Sparkles },
    ]
  };

  const team = [
    { 
      name: 'M Fariz Alfauzi', 
      role: 'CEO & Lead Engineer', 
      desc: 'Pelopor pengembangan Velicia AI dengan pengalaman luas di bidang rekayasa AI dan antarmuka pengguna.',
      color: 'from-purple-600 to-indigo-600'
    },
    { 
      name: 'Sarah Amalia', 
      role: 'AI Researcher', 
      desc: 'Bertanggung jawab atas riset model multimodal untuk memastikan Velicia memiliki pemahaman kontekstual mendalam.',
      color: 'from-pink-600 to-rose-600'
    },
    { 
      name: 'Andi Wijaya', 
      role: 'Head of Operations', 
      desc: 'Mengelola skalabilitas infrastruktur cloud untuk memberikan respon asisten yang secepat kilat bagi pengguna.',
      color: 'from-blue-600 to-cyan-600'
    },
    { 
      name: 'Riana Putri', 
      role: 'UX Designer', 
      desc: 'Menciptakan pengalaman interaksi AI yang paling intuitif, ramah, dan manusiawi untuk masyarakat Indonesia.',
      color: 'from-orange-600 to-amber-600'
    }
  ];

  const faqs = [
    {
      q: 'Apa itu Velicia?',
      a: 'Velicia adalah asisten AI mandiri yang dikembangkan dengan arsitektur kecerdasan buatan mutakhir untuk membantu produktivitas masyarakat Indonesia dengan pemahaman konteks lokal yang mendalam tanpa bergantung pada brand AI lain.'
    },
    {
      q: 'Bagaimana cara saya menggunakan Velicia?',
      a: 'Sangat mudah! Anda bisa langsung mulai mengobrol, mencari informasi, atau membuat konten melalui dashboard utama kami. Velicia juga tersedia sebagai ekstensi Chrome dan aplikasi Android untuk kemudahan akses di mana saja.'
    },
    {
      q: 'Apakah Velicia gratis?',
      a: 'Ya, Velicia menawarkan akses gratis selamanya dengan kuota harian yang cukup untuk kebutuhan personal. Kami juga menyediakan paket Pro bagi profesional yang membutuhkan akses tanpa batas dan fitur eksklusif lainnya.'
    },
    {
      q: 'Bagaimana Velicia bekerja?',
      a: 'Velicia menggunakan mesin AI mandiri yang dioptimalkan secara khusus. Sistem kami memproses input Anda dengan algoritma pemahaman bahasa alami yang canggih untuk memberikan jawaban yang paling akurat dan cepat secara mandiri.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-pink-100 selection:text-pink-900 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-2xl border-b border-gray-100 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
            <span className="text-2xl font-black tracking-tighter text-gray-900">Velicia</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
             <div className="flex items-center gap-1.5 px-5 py-2.5 bg-white/50 hover:bg-white rounded-full border border-gray-100 text-sm font-extrabold text-gray-700 cursor-pointer transition-all">
                <span>Bahasa Indonesia</span>
                <ChevronDown size={14} className="opacity-40" />
             </div>
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
                <div className="btn-shine">Velicia AI Masa Depan</div>
              </div>
          </div>

          <h1 className="text-[3.25rem] leading-[1.0] md:text-[6.5rem] lg:text-[7.5rem] font-black text-gray-900 tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000 mb-10">
             AI Asisten Cerdas<br/>
             <div className="relative inline-block mt-4">
                <span className="text-vivid-gradient drop-shadow-md">
                   Indonesia
                </span>
                <div className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 to-pink-500 blur-md opacity-40"></div>
             </div>
          </h1>

          <p className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto mb-14 leading-relaxed font-bold tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
             Velicia dikembangkan untuk Masa Depan Nusantara. Peningkatan Efisiensi, Pemahaman Mendalam, Multimodal, dan Respon yang Cepat.
          </p>

          <div className="flex flex-col items-center gap-10 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
             <div className="flex flex-wrap justify-center gap-6">
               {/* Perfectly Centered Start Button */}
               <button type="button" className="uiverse-button" onClick={onEnterApp}>
                <span className="fold"></span>
                <div className="flex items-center justify-center gap-3 w-full">
                  <img src="/logoApp/logo-app.png" className="w-7 h-7 object-contain" alt="Velicia logo" />
                  <span className="text-white font-black text-xl">Mulai dengan Velicia</span>
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
                <span className="font-black">View Universe</span>
               </a>
             </div>
             <p className="text-sm text-gray-400 font-black tracking-[0.3em]">Gratis selamanya • Tidak perlu kartu kredit</p>
          </div>

          {/* DYNAMIC DASHBOARD MOCKUP */}
          <div className="relative max-w-6xl mx-auto group perspective-1000 mb-12">
             <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-[3rem] opacity-25 blur-3xl group-hover:opacity-40 transition-all duration-700"></div>
             <div className="relative bg-white rounded-[2.5rem] p-3 md:p-5 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] border border-gray-100 transform transition-transform duration-1000 hover:rotate-x-2">
                <MockupChat />
             </div>
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section className="py-32 bg-[#FAFAFA] relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-24 text-center tracking-tighter">Blog & Berita Terkini</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {blogArticles.map((article, i) => (
                    <div key={i} className="bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                        <div className="h-72 w-full overflow-hidden relative">
                             <img 
                                src={article.image} 
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
                                {article.date}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-6 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-gray-500 text-lg font-bold leading-relaxed mb-10 line-clamp-3 opacity-80">
                                {article.desc}
                            </p>
                            <button className="flex items-center gap-3 text-purple-600 font-black text-base hover:gap-6 transition-all">
                                Selengkapnya <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-24 text-center">
                <button className="px-12 py-6 bg-white border-2 border-gray-100 rounded-[2rem] font-black text-gray-900 hover:bg-black hover:text-white hover:border-black transition-all shadow-xl hover:shadow-2xl active:scale-95">
                    Lihat Semua Artikel
                </button>
            </div>
         </div>
      </section>

      {/* --- PROFESSIONAL SECTION --- */}
      <section className="py-32 bg-white">
         <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 text-center mb-20 tracking-tighter">Dibuat untuk profesional.</h2>
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
                {(professionContent[activeProfession] || []).map((item, i) => (
                    <div key={i} className="flex gap-10 p-12 bg-gray-50 rounded-[4rem] border border-gray-100 hover:bg-white hover:shadow-[0_50px_100px_-25px_rgba(0,0,0,0.1)] transition-all group">
                        <div className="w-20 h-20 rounded-[1.75rem] bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:bg-purple-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                            <item.icon size={32} />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{item.title}</h4>
                            <p className="text-gray-500 leading-relaxed text-lg font-bold opacity-80">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* --- TEAM WORK SECTION --- */}
      <section className="py-32 bg-[#FAFAFA] border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-24">
                 <h2 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter">Team Work</h2>
                 <p className="text-gray-500 font-extrabold text-2xl max-w-3xl mx-auto opacity-70 leading-relaxed">
                    Bertemu dengan para ahli yang membangun masa depan kecerdasan buatan untuk Indonesia.
                 </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                 {team.map((member, i) => (
                    <div key={i} className="group relative bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm hover:shadow-[0_50px_110px_-25px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-4 flex flex-col items-center text-center">
                        <div className={`w-28 h-28 rounded-[2.5rem] bg-gradient-to-br ${member.color} mb-10 flex items-center justify-center text-white shadow-2xl transform transition-transform group-hover:rotate-12`}>
                             <Brain size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{member.name}</h3>
                        <p className={`text-[10px] font-black tracking-[0.4em] uppercase mb-8 text-transparent bg-clip-text bg-gradient-to-r ${member.color}`}>
                           {member.role}
                        </p>
                        <p className="text-gray-500 font-bold text-lg leading-relaxed mb-10 italic opacity-80">"{member.desc}"</p>
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
            <h2 className="text-4xl md:text-7xl font-black text-gray-900 text-center mb-24 tracking-tighter">FAQ</h2>
            <div className="space-y-8">
                {faqs.map((faq, i) => (
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
                Kecerdasan Buatan Mandiri untuk Indonesia.
              </p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
