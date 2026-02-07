
import React from 'react';
import { Sparkles } from 'lucide-react';

interface DashboardProps {
    onModelSelect: (type: 'text' | 'image') => void;
    translations: any;
}

const Dashboard: React.FC<DashboardProps> = ({ onModelSelect, translations }) => {
  const t = translations.dashboard;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-in fade-in duration-700">
      
      {/* Optimized Logo: Larger, cleaner display */}
      <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
        <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="h-20 w-auto object-contain drop-shadow-sm" />
      </div>
      
      <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{t.welcome}</h2>
      <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed font-medium">
        {t.subtitle}
      </p>

      <div className="flex gap-4">
           <button 
             onClick={() => onModelSelect('text')}
             className="flex flex-col items-center gap-2 p-2 transition-all hover:-translate-y-1 group"
           >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-purple-600 group-hover:bg-purple-50 group-hover:scale-110 transition-all border border-gray-100">
                  <Sparkles size={20} />
                </div>
                <span className="text-xs font-bold text-gray-700">{t.chatBtn}</span>
           </button>
      </div>
    </div>
  );
};

export default Dashboard;
