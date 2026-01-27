
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import { Message, Role, ModelType, DEFAULT_MODELS, ModelOption, Attachment } from './types';
import { sendMessageToGemini } from './services/geminiService';

const TopProgressBar: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className="top-loading-bar">
      <div className="top-loading-bar-inner"></div>
    </div>
  );
};

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [initialScrollTo, setInitialScrollTo] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'thinking' | 'searching' | 'youtube_search'>('idle');
  
  const [model, setModel] = useState<string>(ModelType.VELICIA_FLASH); 
  const [availableModels] = useState<ModelOption[]>(DEFAULT_MODELS);
  const [isPageLoading, setIsPageLoading] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const handlePageTransition = (callback: () => void) => {
    setIsPageLoading(true);
    setTimeout(() => {
      callback();
      setTimeout(() => setIsPageLoading(false), 500); 
    }, 1500);
  };

  const handleEnterApp = async () => {
    try {
        const win = window as any;
        if (win.aistudio) {
            const hasKey = await win.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await win.aistudio.openSelectKey();
            }
        }
    } catch (e) {
        console.error("API Key Selection Error:", e);
    }

    handlePageTransition(() => {
      setShowLanding(false);
      setInitialScrollTo(null);
    });
  };
  
  const handleNavigateFromSidebar = (sectionId: string) => {
    setIsSidebarOpen(false);
    setShowLanding(true);
    setInitialScrollTo(sectionId);
  };

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
    await processAIResponse(text, selectedModel, newHistory, attachment);
  };

  const processAIResponse = async (text: string, selectedModel: string, history: Message[], attachment?: Attachment) => {
    setIsAILoading(true);
    setLoadingState('thinking'); 

    const lowerText = text.toLowerCase();
    const youtubeKeywords = ['youtube', 'video', 'nonton', 'watch', 'clip', 'cuplikan', 'trailer', 'film'];
    const isYoutubeIntent = youtubeKeywords.some(keyword => lowerText.includes(keyword)) && !attachment;
    const searchKeywords = ['siapa', 'kapan', 'dimana', 'berapa', 'terbaru', 'berita', 'hari ini', 'sekarang', 'news', 'latest', 'price', 'who', 'when', 'where', 'search', 'cari', 'info', 'live', 'realtime', 'gaza', 'israel', 'gempa', 'cuaca', 'skor', 'hasil'];
    const isGeneralSearch = searchKeywords.some(keyword => lowerText.includes(keyword)) && !attachment;

    let searchToggleInterval: ReturnType<typeof setInterval> | undefined;
    let initialSearchTimeout: ReturnType<typeof setTimeout> | undefined;

    if (isYoutubeIntent || isGeneralSearch) {
        initialSearchTimeout = setTimeout(() => {
            const searchType = isYoutubeIntent ? 'youtube_search' : 'searching';
            setLoadingState(searchType);
            searchToggleInterval = setInterval(() => {
                setLoadingState(currentState => 
                    (currentState === 'searching' || currentState === 'youtube_search') ? 'thinking' : searchType
                );
            }, 2500); 
        }, 1500); 
    }

    try {
      const response = await sendMessageToGemini(text, selectedModel, history, attachment);
      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(), 
        role: Role.MODEL,
        text: response.text,
        timestamp: Date.now(),
        groundingMetadata: response.groundingMetadata
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
      if (initialSearchTimeout) clearTimeout(initialSearchTimeout);
      if (searchToggleInterval) clearInterval(searchToggleInterval);
      setIsAILoading(false);
      setLoadingState('idle');
    }
  };

  const handleEditMessage = async (messageId: string, newText: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    const pastMessages = messages.slice(0, messageIndex);
    const oldMessage = messages[messageIndex];
    const updatedUserMessage: Message = { ...oldMessage, text: newText, timestamp: Date.now() };
    const newHistory = [...pastMessages, updatedUserMessage];
    setMessages(newHistory);
    await processAIResponse(newText, model, newHistory, updatedUserMessage.attachment);
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsAILoading(false);
    setLoadingState('idle');
  };

  const handleModelSelectFromDashboard = (type: 'text' | 'image') => {
    setModel(ModelType.VELICIA_FLASH);
  };

  return (
    <>
        <TopProgressBar isLoading={isPageLoading} />
        
        {showLanding ? (
            <div className="min-h-screen bg-white">
                <LandingPage onEnterApp={handleEnterApp} initialScrollTo={initialScrollTo} />
            </div>
        ) : (
            /* APP LAYOUT - FIXED HEIGHT 100dvh (Dynamic Viewport Height) */
            <div className="fixed inset-0 w-full h-[100dvh] bg-[#FAFAFA] flex flex-col overflow-hidden text-gray-900 font-sans">
                
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                    onNewChat={handleNewChat}
                    onNavigate={handleNavigateFromSidebar}
                />
                
                <Header onNewChat={handleNewChat} onMenuClick={() => setIsSidebarOpen(true)} user={null} />
                
                {/* Main Chat Area - Flexible Height & Scrollable */}
                <main className="flex-1 w-full max-w-5xl mx-auto pt-20 overflow-y-auto no-scrollbar relative flex flex-col scroll-smooth">
                    <div className="flex-1 px-4 md:px-6 py-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <Dashboard onModelSelect={handleModelSelectFromDashboard} />
                            </div>
                        ) : (
                            <MessageList messages={messages} isLoading={isAILoading} loadingState={loadingState} currentModel={model} onEditMessage={handleEditMessage} />
                        )}
                    </div>
                </main>
                
                {/* Input Area - Fixed Bottom / Shrink 0 */}
                <div className="w-full shrink-0 z-20 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent pt-2 pb-safe">
                    <InputArea 
                        onSend={handleSend} 
                        isLoading={isAILoading} 
                        selectedModel={model} 
                        onModelChange={setModel} 
                        availableModels={availableModels} 
                    />
                </div>
            </div>
        )}
    </>
  );
};

export default App;
