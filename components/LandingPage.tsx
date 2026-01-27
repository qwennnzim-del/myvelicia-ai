
import React, { useState } from 'react';
import { 
  MessageSquare, Search, PenTool, Image as ImageIcon, 
  FileText, Globe, Play, Menu, X, 
  ChevronDown, Star, Layout, Sparkles, Smartphone, Monitor, Chrome, Brain, Mail, Briefcase, Zap
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  initialScrollTo?: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProfession, setActiveProfession] = useState('Entrepreneur');

  const features = [
    { label: 'Obrolan', icon: MessageSquare, color: 'text-[#7C3AED]', bg: 'bg-purple-100' },
    { label: 'Ringkasan', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-100' },
    { label: 'Penulis', icon: PenTool, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Pencarian', icon: Search, color: 'text-pink-500', bg: 'bg-pink-100' },
    { label: 'Penerjemah', icon: Globe, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Seni', icon: ImageIcon, color: 'text-indigo-500', bg: 'bg-indigo-100' },
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

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-pink-100 selection:text-pink-900 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-8 h-8 bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] rounded-lg flex items-center justify-center text-white overflow-hidden shadow-md shadow-pink-200">
              <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Velicia</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                <span>Bahasa Indonesia</span>
                <ChevronDown size={14} className="opacity-50" />
             </div>
             <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
             </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button className="p-2 text-gray-600" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-right duration-300">
                  <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg">Menu</span>
                      <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                  </div>
                  <button onClick={onEnterApp} className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white rounded-xl font-bold">Masuk Aplikasi</button>
                  <div className="h-px bg-gray-100 my-2"></div>
                  <button className="text-left py-2 font-medium text-gray-600">Fitur</button>
                  <button className="text-left py-2 font-medium text-gray-600">Harga</button>
                  <button className="text-left py-2 font-medium text-gray-600">Blog</button>
              </div>
          </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50 via-white to-white">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Video Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full mb-8 cursor-pointer hover:border-pink-300 hover:shadow-sm transition-all shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
             <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200"><Play size={9} fill="currentColor" className="text-gray-600 ml-0.5"/></div>
             <span className="text-xs font-bold text-gray-600">Tonton video instruksi</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-[64px] font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
             Asisten AI serba ada.<br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]">Dipersonalisasi, cepat, dan gratis.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
             Velicia memanfaatkan model AI mutakhir, termasuk GPT-4o, Claude 3.5 Sonnet, Gemini 3 Pro, dan model nano-banana terbaru untuk meningkatkan pengalaman Anda dalam melakukan obrolan, pencarian, penulisan, dan pemrograman.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4 mb-16">
             <button 
                onClick={onEnterApp}
                className="h-14 px-8 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 active:translate-y-0 text-white rounded-2xl font-bold text-lg transition-all flex items-center gap-3"
             >
               <Smartphone size={20} />
               Dapatkan Aplikasi Android
             </button>
          </div>

          {/* DASHBOARD MOCKUP */}
          <div className="relative max-w-5xl mx-auto mb-20 group">
             {/* Glow Effect */}
             <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
             
             <div className="relative bg-white rounded-[1.8rem] p-3 shadow-2xl border border-gray-100">
                <div className="bg-gray-50 rounded-[1.2rem] overflow-hidden aspect-[16/10] border border-gray-100 relative">
                    {/* Mock Content */}
                    <div className="absolute inset-0 flex">
                        {/* Sidebar Mock */}
                        <div className="hidden md:block w-64 bg-white border-r border-gray-200 p-4 space-y-4">
                            <div className="flex gap-2 mb-6">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            {[1,2,3,4].map(i => (
                                <div key={i} className="flex items-center gap-3 opacity-60">
                                    <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Chat Area Mock */}
                        <div className="flex-1 p-8 flex flex-col">
                            {/* Bot Msg */}
                            <div className="flex gap-4 mb-6 max-w-2xl">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] shrink-0"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-64 bg-gray-200 rounded-full"></div>
                                    <div className="h-4 w-96 bg-gray-200 rounded-full"></div>
                                    <div className="h-4 w-80 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                            
                            {/* User Msg */}
                            <div className="flex gap-4 mb-6 flex-row-reverse self-end max-w-2xl">
                                <div className="w-10 h-10 rounded-xl bg-gray-300 shrink-0"></div>
                                <div className="bg-gray-100 p-4 rounded-2xl rounded-tr-none">
                                    <div className="h-4 w-48 bg-gray-300 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          {/* RATINGS */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
             {ratings.map((r, i) => (
               <div key={i} className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <img src={r.icon} className="w-10 h-10 object-contain" alt={r.platform}/>
                  <div className="text-left">
                     <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-lg font-black text-gray-900">{r.score}</span>
                        <div className="flex gap-0.5">
                           {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill="#FACC15" className="text-yellow-400 border-none"/>)}
                        </div>
                     </div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{r.platform}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-white relative">
         <div className="max-w-5xl mx-auto px-6 text-center">
             <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-16">Asisten AI serba bisa</h2>
             
             {/* Feature Buttons Grid */}
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-24">
                 {features.map((f, i) => (
                    <button key={i} className={`flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-3xl transition-all border border-transparent hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 bg-gray-50 group`}>
                        <div className={`p-3 rounded-2xl ${f.bg} ${f.color} group-hover:scale-110 transition-transform`}>
                            <f.icon size={24} strokeWidth={2.5}/>
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-gray-900 capitalize">{f.label}</span>
                    </button>
                 ))}
             </div>

             {/* Feature Showcase Card */}
             <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem] p-12 border border-white shadow-xl relative overflow-hidden text-left flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 relative z-10 space-y-6">
                    <div className="inline-block p-3 bg-white rounded-2xl shadow-sm">
                        <MessageSquare size={32} className="text-[#7C3AED]" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">Obrolan dengan semua model terbaik dalam satu tempat.</h3>
                    <p className="text-gray-600 font-medium text-lg">Velicia menggabungkan kemampuan GPT-4, Claude 3, dan Gemini Pro untuk memberikan jawaban yang paling akurat dan relevan.</p>
                </div>
                <div className="flex-1 w-full max-w-xs md:max-w-sm">
                    <div className="bg-white rounded-[2rem] p-4 shadow-2xl border border-gray-100 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="bg-gray-50 rounded-xl aspect-[9/16] relative overflow-hidden border border-gray-100">
                             {/* Phone UI Mock */}
                             <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3">
                                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#EC4899]"></div>
                                 <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
                             </div>
                             <div className="p-4 space-y-4 mt-14">
                                 <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm border border-gray-100 text-xs text-gray-500">
                                     Halo! Ada yang bisa saya bantu hari ini?
                                 </div>
                                 <div className="bg-[#7C3AED] text-white p-3 rounded-xl rounded-tr-none shadow-sm text-xs self-end ml-auto w-fit">
                                     Buatkan saya rencana liburan ke Bali.
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
             </div>
         </div>
      </section>

      {/* --- WORKPLACE SECTION --- */}
      <section className="py-24 bg-[#FAFAFA]">
         <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-16 text-center">Bekerja di mana Anda bekerja.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Sidebar Card */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="mb-8">
                        <h3 className="text-2xl font-black mb-3">Sidebar AI</h3>
                        <p className="text-gray-500 font-medium">Akses cepat di sebelah kanan browser Anda.</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl aspect-video border border-gray-100 p-6 relative overflow-hidden">
                        <div className="absolute top-4 left-4 right-16 bottom-4 bg-white shadow-sm rounded-lg border border-gray-200 p-4">
                            <div className="space-y-2 opacity-30">
                                <div className="h-2 w-full bg-black rounded-full"></div>
                                <div className="h-2 w-3/4 bg-black rounded-full"></div>
                                <div className="h-2 w-5/6 bg-black rounded-full"></div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 bottom-0 w-12 bg-white border-l border-gray-200 flex flex-col items-center py-4 gap-4 shadow-xl">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899]"></div>
                            <div className="w-6 h-6 rounded bg-gray-200"></div>
                            <div className="w-6 h-6 rounded bg-gray-200"></div>
                        </div>
                    </div>
                </div>

                {/* Platforms Card */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-2xl font-black mb-3">Tersedia di semua platform</h3>
                        <p className="text-gray-500 font-medium">Browser, Desktop, dan Ponsel.</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {['Chrome', 'Web App', 'mac OS', 'Windows', 'iOS', 'Android'].map((p, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl font-bold text-gray-600 text-sm border border-gray-100 hover:border-pink-200 hover:bg-pink-50 transition-colors">
                                <Chrome size={18} className="text-gray-400"/> {p}
                            </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Toolbar Card (Full Width) */}
                <div className="md:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                            <h3 className="text-2xl font-black mb-3">Toolbar pintar</h3>
                            <p className="text-gray-500 font-medium">Menjelaskan, menerjemahkan, atau meringkas teks yang Anda pilih dengan mulus di halaman web manapun.</p>
                        </div>
                        <div className="flex-1 w-full bg-purple-50 p-8 rounded-3xl border border-purple-100 relative">
                            <p className="text-purple-900 font-medium text-lg leading-relaxed relative z-10">
                                <span className="bg-purple-200 rounded px-1">Large language models</span> are advanced AI systems that understand and generate human-like text.
                            </p>
                            {/* Toolbar Mock */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-xl p-2 flex gap-2 animate-bounce">
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-xs font-bold flex flex-col items-center gap-1"><Sparkles size={14} className="text-pink-500"/>Jelaskan</button>
                                <div className="w-px bg-gray-200 h-8 self-center"></div>
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-xs font-bold flex flex-col items-center gap-1"><Globe size={14} className="text-blue-500"/>Terjemah</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
         </div>
      </section>

      {/* --- PROFESSIONAL SECTION --- */}
      <section className="py-24 bg-white">
         <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">Dibuat untuk profesional.</h2>
            
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
                {professions.map(p => (
                    <button 
                        key={p.id}
                        onClick={() => setActiveProfession(p.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all border ${activeProfession === p.id ? 'bg-[#18181b] text-white border-black shadow-lg transform scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}
                    >
                        {p.icon}
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500 key={activeProfession}">
                {(professionContent[activeProfession] || []).map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className="flex gap-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl hover:border-pink-100 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:bg-gradient-to-br group-hover:from-purple-100 group-hover:to-pink-100 transition-colors">
                                <Icon size={24} className="text-gray-700 group-hover:text-pink-600 transition-colors"/>
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-gray-900 mb-3">{item.title}</h4>
                                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
         </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-[#FAFAFA] border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Dipercaya oleh 10 juta pengguna di seluruh dunia.</h2>
                 <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                     <div className="text-center md:text-left">
                        <div className="text-4xl font-black text-[#7C3AED]">160,000+</div>
                        <div className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Ulasan Bintang 5</div>
                     </div>
                     <div className="hidden md:block w-px h-12 bg-gray-200"></div>
                     <div className="text-center md:text-left">
                        <div className="text-4xl font-black text-[#EC4899]">10,000,000+</div>
                        <div className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Pengguna Aktif</div>
                     </div>
                 </div>
              </div>

              <div className="columns-1 md:columns-2 gap-6 space-y-6">
                 {[
                    { name: 'Esneider S.', text: 'AI yang luar biasa, benar-benar membantu Anda dengan segala hal dan bagian terbaiknya adalah Anda dapat bertanya banyak setiap hari.', stars: 5 },
                    { name: 'Miyamoto Musashi', text: 'Terima kasih banyak kepada Velicia AI, saya sangat terbantu oleh berbagai fiturnya. Keren, ini adalah All in 1 🫡👍', stars: 5 },
                    { name: 'Hianto Mateus', text: 'Peningkatan produktivitas saya, saya tidak akan berkomentar lebih lanjut. Lima bintang sudah cukup <3. Terima kasih telah ada!', stars: 5 },
                    { name: 'Sarah J.', text: 'Sangat membantu untuk riset skripsi. Fitur ringkasannya sangat akurat dan hemat waktu.', stars: 5 },
                 ].map((t, i) => (
                    <div key={i} className="break-inside-avoid bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300"></div>
                            <div>
                                <h4 className="font-bold text-gray-900">{t.name}</h4>
                                <div className="flex gap-0.5 mt-0.5">
                                    {[...Array(t.stars)].map((_, idx) => <Star key={idx} size={12} fill="#FACC15" className="text-yellow-400 border-none"/>)}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">"{t.text}"</p>
                    </div>
                 ))}
              </div>
          </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-24 bg-white">
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-16">Pertanyaan yang sering diajukan</h2>
            <div className="space-y-4">
                {[
                    'Apa itu Velicia?',
                    'Bagaimana cara saya menggunakan Velicia?',
                    'Apakah Velicia gratis?',
                    'Bagaimana Velicia bekerja?',
                ].map((q, i) => (
                    <div key={i} className="border-b border-gray-100 last:border-0">
                        <button className="w-full flex items-center justify-between py-6 text-left font-bold text-lg text-gray-900 hover:text-pink-600 transition-colors group">
                            <span>{q}</span>
                            <ChevronDown size={20} className="text-gray-300 group-hover:text-pink-600 transition-colors" />
                        </button>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#7C3AED] to-[#EC4899] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-pink-200">
              {/* Decorative Circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">Bebaskan potensi sejati Anda,<br/> dapatkan Velicia sekarang!</h2>
                  <button 
                    onClick={onEnterApp}
                    className="h-16 px-10 bg-white text-[#7C3AED] hover:bg-gray-50 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center gap-3 mx-auto hover:scale-105 active:scale-95"
                  >
                      <Smartphone size={24} />
                      Dapatkan Aplikasi Android
                  </button>
              </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="w-8 h-8 bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] rounded-lg flex items-center justify-center text-white overflow-hidden shadow-sm">
                  <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-5 h-5 object-contain" />
                </div>
                <span className="text-xl font-bold text-gray-900">Velicia</span>
              </div>
              <p className="text-xs text-gray-400 font-medium tracking-wide">&copy; 2026 VELICIA AI TECHNOLOGIES. <br/> CHATGPT is a registered trademark of OPENAI OPCO, LLC.</p>
          </div>
      </footer>

    </div>
  );
};

export default LandingPage;
