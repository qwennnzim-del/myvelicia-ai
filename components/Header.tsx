
import React from 'react';
import { MessageCirclePlus, Menu } from 'lucide-react';

interface HeaderProps {
  onNewChat: () => void;
  onMenuClick: () => void; // Restored sidebar trigger
  user: { name: string; initial: string } | null;
}

const Header: React.FC<HeaderProps> = ({ onNewChat, onMenuClick, user }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#FAFAFA]/90 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-50 transition-all duration-300 border-b border-transparent">
      
      {/* Left Side: Sidebar Toggle / User Info */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Sidebar Trigger (Hamburger) */}
        <button 
          onClick={onMenuClick}
          className="p-2.5 -ml-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
          title="Menu"
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>

        {/* User Info (If Logged In) */}
        {user && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
             <div className="w-[42px] h-[42px] rounded-[14px] bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-200 border-2 border-white">
                {user.initial}
             </div>
             <div className="hidden sm:block">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">Welcome</p>
                 <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
             </div>
          </div>
        )}
      </div>
      
      {/* Right Side: New Chat */}
      <button 
        onClick={onNewChat}
        className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center hover:bg-white bg-white/50 border border-gray-200/50 rounded-full transition-all text-gray-600 active:scale-95 shadow-sm hover:shadow-md hover:border-gray-200 hover:text-[#7C3AED]"
        title="New Chat"
      >
        <MessageCirclePlus size={22} strokeWidth={2.5} />
      </button>
    </header>
  );
};

export default Header;
