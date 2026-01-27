
import React from 'react';
import { Sparkles, Layout } from 'lucide-react';

interface DashboardProps {
    onModelSelect: (type: 'text' | 'image') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onModelSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-8 shadow-sm overflow-hidden">
        <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-12 h-12 object-contain" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Selamat datang di Velicia.ai</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Mulai percakapan baru atau coba fitur generasi gambar.
      </p>

      <div className="flex gap-4">
           <button 
             onClick={() => onModelSelect('text')}
             className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition-all hover:-translate-y-1 w-32 shadow-sm"
           >
                <div className="p-2 bg-purple-50 text-purple-600 rounded-full"><Sparkles size={20}/></div>
                <span className="text-sm font-semibold text-gray-700">Chat AI</span>
           </button>
           
      </div>
    </div>
  );
};

export default Dashboard;
