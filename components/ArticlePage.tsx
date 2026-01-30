
import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, User, Share2, Clock, ChevronRight } from 'lucide-react';

export interface ArticleData {
  id: number;
  title: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  tag: string;
  content: string; // HTML string for rich text
}

// Data Artikel Lengkap (Hardcoded untuk demo)
export const BLOG_POSTS: ArticleData[] = [
  {
    id: 3, // New ID for the latest article
    title: "Peluncuran Velicia AI Asisten Cerdas Indonesia",
    date: "28 Januari 2026",
    author: "Dwi Putri (Sekretaris)",
    readTime: "7 menit baca",
    tag: "News",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop",
    content: `
      <p class="lead">Hari ini, 28 Januari 2026, menjadi titik awal perjalanan ambisius kami. Dalam rapat strategis tertutup yang dihadiri oleh seluruh jajaran pengembang dan pemangku kepentingan, Velicia AI secara resmi diperkenalkan sebagai proyek unggulan nasional.</p>
      
      <h3>Hasil Rapat & Voting Internal</h3>
      <p>Rapat yang dinotulensikan oleh tim sekretariat hari ini menghasilkan keputusan mutlak. Melalui proses voting yang demokratis namun ketat, nama <strong>"Velicia"</strong> dipilih karena merepresentasikan kecepatan (Velocity) dan kecerdasan (Intelligence) yang berakar pada identitas Indonesia.</p>

      <p>Kami menyepakati visi bersama: <em>Membangun kedaulatan AI tanpa bergantung pada infrastruktur asing.</em></p>

      <h3>Pengembangan & Roadmap</h3>
      <p>Saat ini, Velicia berada dalam fase <strong>Alpha-Protocol</strong>. Tim teknis sedang fokus pada pembangunan arsitektur <em>neural network</em> yang mampu memproses konteks budaya tinggi (high-context culture) yang lazim ditemukan dalam interaksi masyarakat Nusantara.</p>

      <h3>Mengapa Rilis Resmi Musim Semi 2028?</h3>
      <p>Banyak yang bertanya, mengapa kami menargetkan rilis publik penuh (Grand Launching) pada <strong>Musim Semi 2028</strong>? Mengapa waktu pengembangannya begitu lama?</p>
      
      <p>Alasan kami logis dan berdasar pada komitmen kualitas:</p>
      <ul>
        <li><strong>Infrastruktur Mandiri (Sovereign Infrastructure):</strong> Kami tidak menyewa server GPU dari penyedia cloud raksasa global. Kami sedang membangun pusat data mandiri di tanah air untuk menjamin 100% keamanan data pengguna sesuai regulasi masa depan. Pembangunan fisik ini memakan waktu.</li>
        <li><strong>Kurasi Dialek Nusantara:</strong> Velicia tidak hanya belajar Bahasa Indonesia baku. Kami sedang melatih model dengan dataset masif yang mencakup Bahasa Jawa, Sunda, Minang, dan bahasa daerah lainnya agar AI ini benar-benar inklusif. Proses pengumpulan dan validasi data ini membutuhkan waktu tahunan agar akurat.</li>
        <li><strong>Kepatuhan Etika & Safety:</strong> Kami menerapkan protokol <em>Red Teaming</em> yang sangat ketat untuk memastikan Velicia bebas dari bias berbahaya dan halusinasi informasi sebelum dilepas ke publik luas.</li>
      </ul>

      <blockquote>"Kami tidak berlomba untuk menjadi yang tercepat rilis, tetapi kami berlomba untuk menjadi yang paling mengerti Indonesia." — Notulensi Rapat Strategis, 28 Jan 2026.</blockquote>
      
      <p>Kami memohon dukungan dan kesabaran seluruh masyarakat Indonesia. Penantian hingga 2028 akan terbayar dengan hadirnya teknologi yang benar-benar milik kita.</p>
    `
  },
  {
    id: 0,
    title: "Visi Kedaulatan Digital: Mengapa AI Mandiri Penting?",
    date: "12 Oktober 2025",
    author: "M. Fariz (Lead Engineer)",
    readTime: "5 menit baca",
    tag: "Visi",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop",
    content: `
      <p class="lead">Di tengah gempuran teknologi global, pertanyaannya bukan lagi "apakah kita bisa?", melainkan "kapan kita mandiri?". Velicia AI hadir sebagai jawaban atas tantangan kedaulatan digital Indonesia.</p>
      
      <h3>Tantangan Era Digital</h3>
      <p>Ketergantungan pada penyedia layanan AI asing membawa risiko tersendiri, mulai dari privasi data hingga bias budaya. Model bahasa besar (LLM) yang dilatih dengan data barat seringkali gagal menangkap nuansa lokal, etika, dan konteks sosial masyarakat Indonesia.</p>
      
      <p>Velicia dibangun dengan filosofi <strong>"Dari Indonesia, Untuk Indonesia"</strong>. Kami tidak hanya sekadar membungkus API asing (wrapper), tetapi mengembangkan arsitektur yang dioptimalkan untuk kebutuhan spesifik infrastruktur dan budaya kita.</p>

      <h3>3 Pilar Kedaulatan Data Velicia</h3>
      <ul>
        <li><strong>Lokalisasi Data:</strong> Memastikan pemrosesan data sensitif tetap berada dalam yurisdiksi hukum Indonesia, mendukung kepatuhan terhadap UU PDP (Pelindungan Data Pribadi).</li>
        <li><strong>Efisiensi Komputasi:</strong> Algoritma yang dirancang untuk berjalan optimal bahkan pada infrastruktur dengan resource terbatas, mengurangi biaya operasional bagi UMKM.</li>
        <li><strong>Kemandirian Intelektual:</strong> Mengurangi bias barat dalam pengambilan keputusan otomatis dengan dataset yang dikurasi dari literatur dan sumber daya lokal.</li>
      </ul>

      <h3>Masa Depan AI Nusantara</h3>
      <p>Visi kami adalah menciptakan ekosistem di mana teknologi bekerja untuk manusia, bukan sebaliknya. Dengan Velicia, kami berharap dapat memberdayakan talenta digital lokal untuk berinovasi tanpa batasan akses atau biaya yang mencekik.</p>
      
      <blockquote>"Teknologi terbaik adalah yang tidak terasa asing, namun terasa seperti perpanjangan dari diri kita sendiri."</blockquote>
      
      <p>Mari bergabung dalam perjalanan menuju kedaulatan digital yang sesungguhnya.</p>
    `
  },
  {
    id: 1,
    title: "Optimasi Alur Kerja: Hemat Waktu dengan Ekstraksi Cerdas",
    date: "08 Oktober 2025",
    author: "Sarah A. (Product)",
    readTime: "4 menit baca",
    tag: "Tips",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop",
    content: `
      <p class="lead">Berapa jam yang Anda habiskan setiap hari hanya untuk membaca dokumen panjang dan mencari poin penting? Velicia mengubah cara Anda bekerja dengan fitur Ekstraksi Dokumen Cerdas.</p>

      <h3>Masalah: Informasi Berlebih</h3>
      <p>Profesional modern dibanjiri dengan informasi. Laporan tahunan, kontrak hukum, hingga jurnal ilmiah menumpuk di meja kerja digital kita. Membaca semuanya secara manual tidak lagi efisien.</p>

      <h3>Solusi: Analisis Kontekstual</h3>
      <p>Berbeda dengan pencarian kata kunci biasa (Ctrl+F), Velicia memahami <em>konteks</em>. Ketika Anda mengunggah PDF dan bertanya "Apa risiko terbesar proyek ini?", Velicia tidak hanya mencari kata "risiko", tetapi menganalisis implikasi dari setiap paragraf.</p>

      <h3>Kasus Penggunaan Nyata</h3>
      <ul>
        <li><strong>HRD:</strong> Menyaring ratusan CV untuk menemukan kandidat dengan kualifikasi spesifik dalam hitungan detik.</li>
        <li><strong>Legal:</strong> Menemukan klausul yang berpotensi merugikan dalam draf kontrak setebal 50 halaman.</li>
        <li><strong>Mahasiswa:</strong> Merangkum jurnal internasional kompleks menjadi poin-poin yang mudah dipahami bahasa Indonesia.</li>
      </ul>

      <p>Dengan mengotomatisasi proses pembacaan dan ekstraksi, Anda bisa mengalihkan energi mental Anda untuk hal yang lebih penting: <strong>Pengambilan Keputusan Strategis</strong>.</p>
    `
  },
  {
    id: 2,
    title: "Pemrosesan Bahasa Lokal: Memahami Nuansa Indonesia",
    date: "05 Oktober 2025",
    author: "Andi W. (AI Researcher)",
    readTime: "6 menit baca",
    tag: "Tech",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
    content: `
      <p class="lead">Bahasa Indonesia itu unik. Ada bahasa baku, bahasa gaul, hingga percampuran dengan bahasa daerah. Tantangan inilah yang coba dipecahkan oleh tim riset Velicia.</p>

      <h3>Tokenisasi yang Efisien</h3>
      <p>Model AI global seringkali tidak efisien dalam memproses Bahasa Indonesia karena cara mereka memecah kata (tokenisasi) didasarkan pada Bahasa Inggris. Ini membuat penggunaan API asing menjadi lebih mahal dan lambat bagi pengguna Indonesia.</p>
      
      <p>Velicia menggunakan <em>custom tokenizer</em> yang dilatih khusus dengan korpus Bahasa Indonesia. Hasilnya? Pemrosesan yang 30% lebih cepat dan penggunaan memori yang lebih hemat.</p>

      <h3>Menangani Konteks Informal</h3>
      <p>Coba bayangkan kalimat ini: <em>"Gk bisa gitu dong, kemaren kan udh deal."</em></p>
      <p>Model standar mungkin bingung dengan singkatan dan struktur kalimat tersebut. Velicia dilatih untuk memahami konteks percakapan sehari-hari, membuatnya menjadi asisten yang lebih luwes dan tidak kaku seperti robot.</p>

      <h3>Multibahasa Daerah</h3>
      <p>Kami sedang dalam tahap eksperimental untuk memasukkan pemahaman terhadap bahasa daerah utama (Jawa, Sunda) agar Velicia bisa benar-benar menjadi asisten bagi seluruh nusantara. Ini adalah langkah kecil untuk melestarikan kekayaan budaya kita di era digital.</p>
    `
  }
];

const AuthorCard: React.FC<{ author: string, role: string }> = ({ author, role }) => (
  <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl flex items-center gap-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
    <div className="absolute -top-6 -right-6 p-2 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
       <img src="/logoApp/logo-app.png" className="h-32 w-auto" alt="Watermark" />
    </div>
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-2xl z-10 shadow-lg shadow-blue-200">
       {author.charAt(0)}
    </div>
    <div className="z-10">
       <div className="flex items-center gap-2 mb-1">
         <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
         <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Penulis Resmi</span>
       </div>
       <h3 className="text-xl font-black text-gray-900 leading-none mb-1.5">{author}</h3>
       <p className="text-sm font-bold text-gray-500">{role}</p>
    </div>
  </div>
);

interface ArticlePageProps {
  articleId: number;
  onBack: () => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ articleId, onBack }) => {
  const article = BLOG_POSTS.find(p => p.id === articleId) || BLOG_POSTS[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4 md:px-6 justify-between transition-all">
         <button 
           onClick={onBack}
           className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2 pr-4"
         >
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">Kembali</span>
         </button>
         <div className="flex items-center gap-2">
            <img src="/logoApp/logo-app.png" alt="Logo" className="h-8 w-auto object-contain" />
         </div>
         <button className="p-2 text-gray-400 hover:text-[#7928CA] transition-colors">
            <Share2 size={20} />
         </button>
      </nav>

      <main className="pt-24 max-w-3xl mx-auto px-6">
        {/* Header Artikel */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
              <span className="text-[#7928CA] bg-purple-50 px-2 py-1 rounded-md border border-purple-100">{article.tag}</span>
              <span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span>
              <span className="flex items-center gap-1"><Clock size={12}/> {article.readTime}</span>
           </div>
           
           <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
             {article.title}
           </h1>

           <div className="flex items-center gap-3 pb-8 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600">
                 <User size={20} />
              </div>
              <div>
                 <div className="text-sm font-bold text-gray-900">{article.author}</div>
                 <div className="text-xs text-gray-500 font-medium">Velicia AI Team</div>
              </div>
           </div>
        </div>

        {/* Gambar Utama */}
        <div className="rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 mb-10 aspect-video relative animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
           <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Konten Artikel */}
        <article className="prose prose-lg prose-slate max-w-none 
           prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900
           prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-medium
           prose-strong:text-gray-900 prose-strong:font-bold
           prose-blockquote:border-l-4 prose-blockquote:border-[#FF0080] prose-blockquote:text-xl prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-gray-800 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:pr-4
           prose-li:text-gray-600 prose-li:font-medium
           prose-img:rounded-2xl
           animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200
        ">
           <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Author Card Component - Only for the specific launch article or all */}
        {article.id === 3 && (
            <AuthorCard author="Dwi Putri" role="Sekretaris & Operasional" />
        )}

        {/* Footer Artikel */}
        <div className="mt-16 pt-10 border-t border-gray-100">
           <h3 className="text-xl font-bold mb-6">Artikel Lainnya</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BLOG_POSTS.filter(p => p.id !== article.id).slice(0, 2).map((post) => (
                 <button 
                    key={post.id} 
                    onClick={() => {
                        window.scrollTo(0,0);
                        // Trigger reload via generic prop update by parent re-render for simplicity
                        // In a real router, navigate(id)
                    }}
                    className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
                 >
                    <img src={post.image} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                    <div>
                       <div className="text-[10px] font-bold text-[#7928CA] uppercase mb-1">{post.tag}</div>
                       <h4 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#FF0080] transition-colors line-clamp-2">{post.title}</h4>
                       <div className="text-xs text-gray-400 font-medium">{post.readTime}</div>
                    </div>
                 </button>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
};

export default ArticlePage;
