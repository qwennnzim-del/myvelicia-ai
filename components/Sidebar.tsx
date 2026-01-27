
import React from 'react';
import { X, MessageSquarePlus, Settings, CircleHelp, History, LogOut, LayoutGrid, Layers, CreditCard, BookOpen, Info } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onNavigate: (sectionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNewChat, onNavigate }) => {
  
  const handleNavigation = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop - Klik di luar untuk menutup */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Container */}
      <div className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col border-r border-gray-100`}>
        
        {/* Header Sidebar */}
        <div className="p-5 flex items-center justify-between">
           <div className="flex items-center gap-2">
                {/* Optimized: Transparent logo, no container */}
                <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-7 h-7 object-contain" />
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Velicia<span className="text-pink-500">.ai</span></h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
             <X size={20} />
           </button>
        </div>

        {/* Action Button */}
        <div className="px-4 mb-2">
            <button 
                onClick={() => {
                    onNewChat();
                    onClose();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-95 group"
            >
                <MessageSquarePlus size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                <span className="font-semibold">New Chat</span>
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 no-scrollbar">
            
            <div className="px-3 mb-2 mt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Menu</span>
            </div>

            {/* Halaman Utama Link - Navigates to Home section */}
            <button 
                onClick={() => handleNavigation('home')} 
                className="flex items-center gap-3 w-full p-3 text-gray-700 bg-gray-50 rounded-xl font-medium text-sm border border-gray-100 hover:bg-pink-50 hover:text-pink-700 transition-colors group"
            >
                <LayoutGrid size={18} className="text-pink-600 group-hover:text-pink-500" /> Halaman Utama
            </button>

            {/* Navigation Links */}
            <button 
                onClick={() => handleNavigation('features')} 
                className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-pink-50 hover:text-pink-700 rounded-xl font-medium text-sm transition-colors group"
            >
                <Layers size={18} className="group-hover:text-pink-500 transition-colors" /> Fitur
            </button>
            <button 
                onClick={() => handleNavigation('pricing')} 
                className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-pink-50 hover:text-pink-700 rounded-xl font-medium text-sm transition-colors group"
            >
                <CreditCard size={18} className="group-hover:text-pink-500 transition-colors" /> Harga
            </button>
            <button 
                onClick={() => handleNavigation('blog')} 
                className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-pink-50 hover:text-pink-700 rounded-xl font-medium text-sm transition-colors group"
            >
                <BookOpen size={18} className="group-hover:text-pink-500 transition-colors" /> Blog
            </button>
            <button 
                onClick={() => handleNavigation('about')} 
                className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-pink-50 hover:text-pink-700 rounded-xl font-medium text-sm transition-colors group"
            >
                <Info size={18} className="group-hover:text-pink-500 transition-colors" /> Tentang Kami
            </button>

            <div className="px-3 mb-2 mt-6 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Riwayat</span>
            </div>

            <button className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium text-sm transition-colors">
                <History size={18} /> Belum ada riwayat
            </button>
            
            <button className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium text-sm transition-colors">
                <CircleHelp size={18} /> Bantuan
            </button>

        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium text-sm transition-colors mb-1">
                <Settings size={18} /> Pengaturan
            </button>
            <button className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-colors">
                <LogOut size={18} /> Keluar
            </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;
