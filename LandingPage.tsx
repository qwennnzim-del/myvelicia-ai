
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, PenTool, Image as ImageIcon, 
  FileText, Globe, Play, Menu, X, 
  ChevronDown, Star, Layout, Sparkles, Smartphone, Monitor, Chrome, Brain, Mail, Briefcase, Zap,
  Linkedin, Github, Twitter
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  initialScrollTo?: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProfession, setActiveProfession] = useState('Entrepreneur');
  const [scrolled, setScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0); // Default open first as in screenshot

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { label: 'Obrolan', icon: MessageSquare, color: 'text-[#7C3AED]', bg: 'bg-purple-50 border-purple-100' },
    { label: 'Ringkasan', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' },
    { label: 'Penulis', icon: PenTool, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
    { label: 'Pencarian', icon: Search, color: 'text-pink-500', bg: 'bg-pink-100 border-pink-100' },
    { label: 'Penerjemah', icon: Globe, color: 'text-green-500', bg: 'bg-green-50 border-green-100' },
    { label: 'Seni', icon: ImageIcon, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100' },
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

  const ratings = [
    { platform: 'Di Chrome Store', score: '4.9 / 5.0', stars: 5, icon: 'https://img.icons8.com/color/48/chrome.png' },
    { platform: 'Di Product Hunt', score: '4.6 / 5.0', stars: 5, icon: 'https://img.icons8.com/color/48/product-hunt.png' },
  ];

  const team = [
    { 
      name: 'M Fariz Alfauzi', 
      role: 'CEO & Lead Engineer', 
      desc: 'Pelopor pengembangan Velicia AI dengan pengalaman luas di bidang rekayasa LLM dan antarmuka pengguna.',
      color: 'from-purple-500 to-indigo-600'
    },
    { 
      name: 'Sarah Amalia', 
      role: 'AI Researcher', 
      desc: 'Bertanggung jawab atas riset model multimodal untuk memastikan Velicia memiliki pemahaman kontekstual yang mendalam.',
      color: 'from-pink-500 to-rose-600'
    },
    { 
      name: 'Andi Wijaya', 
      role: 'Head of Operations', 
      desc: 'Mengelola skalabilitas infrastruktur cloud untuk memberikan respon asisten yang secepat kilat bagi pengguna.',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      name: 'Riana Putri', 
      role: 'UX Designer', 
      desc: 'Menciptakan pengalaman interaksi AI yang paling intuitif, ramah, dan manusiawi untuk masyarakat Indonesia.',
      color: 'from-orange-500 to-amber-600'
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
            <span className="text-xl md:text-2xl font-black tracking-tight text-gray-900">Velicia</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
             <div className="flex items-center gap-1.5 px-4 py-2 bg-white/50 hover:bg-white rounded-full border border-transparent hover:border-gray-200 text-sm font-bold text-gray-600 cursor-pointer transition-all duration-200">
                <span>Bahasa Indonesia</span>
                <ChevronDown size={14} className="opacity-50" />
             </div>
             <button className="p-2.5 text-gray-500 hover:text-gray-900 transition-colors hover:bg-gray-100/50 rounded-xl" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} strokeWidth={2.5} />
             </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={26} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src="/logoApp/logo-app.png" className="w-6 h-6 object-contain"/>
                        <span className="font-bold text-xl">Velicia</span>
                      </div>
                      <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-2">
                      <button onClick={onEnterApp} className="w-full py-4 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white rounded-xl font-bold shadow-lg shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2">
                          <Smartphone size={20} /> Masuk Aplikasi
                      </button>
                      <div className="h-px bg-gray-100 my-4"></div>
                      <button className="text-left py-3 px-4 rounded-xl font-bold text-gray-700 hover:bg-gray-50">Fitur</button>
                      <button className="text-left py-3 px-4 rounded-xl font-bold text-gray-700 hover:bg-gray-50">Harga</button>
                      <button className="text-left py-3 px-4 rounded-xl font-bold text-gray-700 hover:bg-gray-50">Blog</button>
                  </div>
              </div>
          </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 px-4 md:px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50 via-white to-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative inline-block rounded-full bg-black shadow-lg mx-auto overflow-hidden">
                <a href="#" className="btn-shine">Velicia AI Masa Depan</a>
              </div>
          </div>

          <h1 className="text-[2.5rem] leading-[1.1] md:text-[4.5rem] lg:text-[5rem] font-black text-gray-900 md:leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
             AI Asisten Cerdas Indonesia<br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-purple-600 to-[#EC4899]">Dipersonalisasi & Efisien</span>
          </h1>

          <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
             Velicia di Kembangkan Untuk Masa Depan Nusantara, Peningkatan Efisiensi, Pemahaman Mendalam, Multimodal, dan Respon Yang Cepat.
          </p>

          <div className="flex flex-col items-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
             <button type="button" className="uiverse-button" onClick={onEnterApp}>
              <span className="fold"></span>
              <div className="points_wrapper">
                {[...Array(10)].map((_, i) => <i key={i} className="point"></i>)}
              </div>
              <span className="inner">
                <Smartphone className="icon mr-2" />
                Dapatkan Aplikasi Android
              </span>
             </button>
             <p className="text-xs text-gray-400 font-semibold">Gratis selamanya • Tidak perlu kartu kredit</p>
          </div>

          {/* DASHBOARD MOCKUP */}
          <div className="relative max-w-5xl mx-auto mb-20 group perspective-1000">
             <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
             <div className="relative bg-white rounded-[1.8rem] p-2 md:p-3 shadow-2xl border border-gray-100 transform transition-transform duration-500 group-hover:rotate-x-2">
                <div className="bg-gray-50 rounded-[1.2rem] overflow-hidden aspect-[16/10] border border-gray-100 relative">
                    <div className="absolute inset-0 flex">
                        <div className="hidden md:block w-64 bg-white border-r border-gray-200 p-4 space-y-4">
                            <div className="flex gap-2 mb-6">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                        </div>
                        <div className="flex-1 p-4 md:p-8 flex flex-col">
                            <div className="flex gap-3 md:gap-4 mb-6 max-w-2xl">
                                <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain shrink-0" />
                                <div className="space-y-2 w-full">
                                    <div className="h-3 md:h-4 w-3/4 bg-gray-200 rounded-full"></div>
                                    <div className="h-3 md:h-4 w-full bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 bg-white">
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-16">Pertanyaan yang sering diajukan</h2>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <div key={i} className="border-b border-gray-100 last:border-0">
                        <button 
                            onClick={() => toggleFaq(i)}
                            className="w-full flex items-center justify-between py-6 text-left font-bold text-lg text-gray-900 hover:text-pink-600 transition-all group"
                        >
                            <span>{faq.q}</span>
                            <ChevronDown 
                                size={20} 
                                className={`text-gray-300 group-hover:text-pink-600 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180 text-pink-600' : ''}`} 
                            />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                {faq.a}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-8">
                <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-7 h-7 object-contain" />
                <span className="text-2xl font-bold text-gray-900">Velicia</span>
              </div>
              <p className="text-xs text-gray-400 font-medium tracking-wide leading-relaxed">
                &copy; 2026 VELICIA AI TECHNOLOGIES. <br/> 
                Kecerdasan Buatan Mandiri untuk Indonesia.
              </p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
