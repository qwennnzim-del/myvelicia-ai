import React from 'react';
import { Sparkles, Lightbulb, Code, Terminal, TrendingUp } from 'lucide-react';

interface DashboardProps {
    onModelSelect: (type: 'text' | 'image') => void;
    onPromptSelect?: (text: string) => void;
    translations: any;
}

const Dashboard: React.FC<DashboardProps> = ({ onModelSelect, onPromptSelect, translations }) => {
  const t = translations.dashboard;

  const quickPrompts = [
    {
      icon: <Lightbulb size={18} className="text-yellow-500" />,
      label: "Ide Konten Kreatif",
      text: "Buatkan strategi konten TikTok untuk minggu depan dengan tema teknologi AI."
    },
    {
      icon: <Terminal size={18} className="text-blue-500" />,
      label: "Jelaskan Konsep",
      text: "Jelaskan cara kerja Black Hole kepada anak usia 5 tahun dengan analogi sederhana."
    },
    {
      icon: <Code size={18} className="text-green-500" />,
      label: "Bantu Coding",
      text: "Buatkan fungsi Javascript untuk memformat mata uang Rupiah (IDR)."
    },
    {
      icon: <TrendingUp size={18} className="text-purple-500" />,
      label: "Analisis Tren",
      text: "Apa tren teknologi terbesar yang diprediksi akan booming di Indonesia tahun 2025?"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-700 w-full max-w-4xl mx-auto">
      
      {/* Optimized Logo */}
      <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
        <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="h-24 w-auto object-contain drop-shadow-sm" />
      </div>
      
      <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{t.welcome}</h2>
      <p className="text-gray-500 max-w-md mb-10 text-base leading-relaxed font-medium">
        {t.subtitle}
      </p>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mb-8">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onPromptSelect?.(prompt.text)}
            className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-purple-200 hover:shadow-md hover:bg-purple-50/30 transition-all text-left group"
          >
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white transition-colors border border-gray-100">
              {prompt.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{prompt.label}</div>
              <div className="text-sm font-semibold text-gray-800 line-clamp-2">{prompt.text}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;