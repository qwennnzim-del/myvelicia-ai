
import React, { useState } from 'react';
import Header from './Header';
import MessageList from './MessageList';
import InputArea from './InputArea';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import { Message, Role, ModelType, DEFAULT_MODELS, ModelOption, Attachment } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Status loading spesifik: 'idle' | 'thinking' | 'searching' | 'youtube_search'
  const [loadingState, setLoadingState] = useState<'idle' | 'thinking' | 'searching' | 'youtube_search'>('idle');
  
  // Default to Flash Lite (Updated to Gemini 3 Flash in types, variable name kept generic)
  const [model, setModel] = useState<string>(ModelType.GEMINI_3_FLASH);
  const [availableModels] = useState<ModelOption[]>(DEFAULT_MODELS);

  const handleSend = async (text: string, selectedModel: string, attachment?: Attachment) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      timestamp: Date.now(),
      attachment: attachment 
    };

    const newHistory = [...messages, newUserMessage];
    setMessages(newHistory);
    
    // Panggil fungsi proses AI dengan histori baru
    await processAIResponse(text, selectedModel, newHistory, attachment);
  };

  // Logic terpisah untuk memproses respons AI agar bisa dipakai ulang oleh Edit
  const processAIResponse = async (text: string, selectedModel: string, history: Message[], attachment?: Attachment) => {
    setIsLoading(true);
    setLoadingState('thinking'); // Selalu mulai dengan berpikir

    const lowerText = text.toLowerCase();

    // 1. Deteksi Niat YouTube/Video
    const youtubeKeywords = ['youtube', 'video', 'nonton', 'watch', 'clip', 'cuplikan', 'trailer', 'film'];
    const isYoutubeIntent = youtubeKeywords.some(keyword => lowerText.includes(keyword)) && !attachment && !selectedModel.includes('image');

    // 2. Deteksi Niat Pencarian Umum
    const searchKeywords = ['siapa', 'kapan', 'dimana', 'berapa', 'terbaru', 'berita', 'hari ini', 'sekarang', 'news', 'latest', 'price', 'who', 'when', 'where', 'search', 'cari', 'info', 'live', 'realtime', 'gaza', 'israel', 'gempa', 'cuaca', 'skor', 'hasil'];
    const isGeneralSearch = searchKeywords.some(keyword => lowerText.includes(keyword)) && !attachment && !selectedModel.includes('image');

    // Variabel untuk menyimpan ID interval agar bisa dibersihkan nanti
    let searchToggleInterval: ReturnType<typeof setInterval> | undefined;
    let initialSearchTimeout: ReturnType<typeof setTimeout> | undefined;

    if (isYoutubeIntent || isGeneralSearch) {
        // Logika "Fifty-Fifty":
        // 1. Mulai Thinking.
        // 2. Setelah 1.5 detik -> Searching (Google/YouTube).
        // 3. Setiap 2.5 detik berikutnya -> Toggle antara Thinking dan Searching.
        
        initialSearchTimeout = setTimeout(() => {
            // Tentukan tipe searching
            const searchType = isYoutubeIntent ? 'youtube_search' : 'searching';
            setLoadingState(searchType);
            
            // Mulai loop osilasi setelah masuk mode searching pertama kali
            searchToggleInterval = setInterval(() => {
                setLoadingState(currentState => 
                    (currentState === 'searching' || currentState === 'youtube_search') ? 'thinking' : searchType
                );
            }, 2500); // Ganti status setiap 2.5 detik

        }, 1500); // Delay awal sebelum searching pertama
    }

    try {
      const response = await sendMessageToGemini(text, selectedModel, history, attachment);
      
      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(), // Ensure unique ID different from user msg
        role: Role.MODEL,
        text: response.text,
        timestamp: Date.now(),
        groundingMetadata: response.groundingMetadata // Simpan sumber pencarian
      };

      setMessages((prev) => [...prev, newModelMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: error instanceof Error ? `⚠️ ${error.message}` : "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Bersihkan semua timer
      if (initialSearchTimeout) clearTimeout(initialSearchTimeout);
      if (searchToggleInterval) clearInterval(searchToggleInterval);
      
      setIsLoading(false);
      setLoadingState('idle');
    }
  };

  const handleEditMessage = async (messageId: string, newText: string) => {
    // 1. Temukan index pesan yang diedit
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // 2. Potong histori: Simpan pesan SEBELUM pesan yang diedit
    // Pesan yang diedit akan diperbarui, dan semua pesan SETELAHnya (jawaban AI lama) akan dibuang
    const pastMessages = messages.slice(0, messageIndex);
    
    // 3. Buat objek pesan baru dengan teks yang diedit
    const oldMessage = messages[messageIndex];
    const updatedUserMessage: Message = {
        ...oldMessage,
        text: newText,
        timestamp: Date.now()
    };

    // 4. Update state pesan segera
    const newHistory = [...pastMessages, updatedUserMessage];
    setMessages(newHistory);

    // 5. Trigger regenerasi jawaban AI
    // Kita gunakan model yang sedang aktif saat ini
    await processAIResponse(newText, model, newHistory, updatedUserMessage.attachment);
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsLoading(false);
    setLoadingState('idle');
  };

  const handleModelSelectFromDashboard = (type: 'text' | 'image') => {
    if (type === 'image') {
        setModel('flux');
    } else {
        setModel(ModelType.GEMINI_3_FLASH);
    }
  };

  const handleNavigateToLanding = (sectionId: string) => {
    // Gunakan React Router untuk pindah halaman
    navigate('/landingpage', { state: { scrollTo: sectionId } });
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] text-gray-900 font-sans overflow-hidden animate-in fade-in duration-500">
      
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNewChat={handleNewChat}
        onNavigate={handleNavigateToLanding}
      />

      <Header 
        onNewChat={handleNewChat} 
        onMenuClick={() => setIsSidebarOpen(true)}
        user={null}
      />
      
      {/* Main Content Area - Scrollable */}
      <main className="flex-1 w-full max-w-5xl mx-auto pt-20 pb-4 overflow-y-auto no-scrollbar px-4 relative flex flex-col">
        {/* If no messages, show Dashboard (Empty State). Otherwise show MessageList */}
        <div className="flex-1">
          {messages.length === 0 ? (
            <Dashboard onModelSelect={handleModelSelectFromDashboard} />
          ) : (
            <MessageList 
              messages={messages} 
              isLoading={isLoading} 
              loadingState={loadingState}
              currentModel={model}
              onEditMessage={handleEditMessage}
            />
          )}
        </div>
      </main>

      {/* Input Area - Fixed at bottom visually via flex structure */}
      <footer className="w-full bg-[#FAFAFA]">
        <InputArea 
          onSend={handleSend} 
          isLoading={isLoading} 
          selectedModel={model}
          onModelChange={setModel}
          availableModels={availableModels}
        />
      </footer>
    </div>
  );
};

export default ChatPage;
