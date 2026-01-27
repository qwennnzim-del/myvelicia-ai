
import React from 'react';
import { Sparkles } from 'lucide-react';

interface DashboardProps {
    onModelSelect: (type: 'text' | 'image') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onModelSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-700">
      
      {/* Optimized Logo: Removed container and gradient background */}
      <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
        <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-20 h-20 object-contain drop-shadow-sm" />
      </div>
      
      <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Selamat datang di Velicia.ai</h2>
      <p className="text-gray-500 max-w-md mb-10 text-lg leading-relaxed">
        Asisten cerdas Anda untuk obrolan, kreativitas, dan produktivitas tanpa batas.
      </p>

      <div className="flex gap-4">
           {/* Optimized: Removed the "box" card container, made it a clean direct interaction */}
           <button 
             onClick={() => onModelSelect('text')}
             className="flex flex-col items-center gap-3 p-2 transition-all hover:-translate-y-1 group"
           >
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-50 text-purple-600 group-hover:bg-purple-50 group-hover:scale-110 transition-all">
                  <Sparkles size={28} />
                </div>
                <span className="text-sm font-bold text-gray-800">Chat AI</span>
           </button>
      </div>
    </div>
  );
};

export default Dashboard;
