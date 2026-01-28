
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import ArticlePage from './components/ArticlePage';
import { SettingsModal, ProfileModal, HelpModal, LoginModal } from './components/Modals';
import { Message, Role, ModelType, DEFAULT_MODELS, ModelOption, Attachment, ChatSession, UserProfile } from './types';
import { sendMessageToGemini } from './services/geminiService';

const TopProgressBar: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className="top-loading-bar">
      <div className="top-loading-bar-inner"></div>
    </div>
  );
};

// Define View States
type AppView = 'landing' | 'app' | 'article';

const App: React.FC = () => {
  // --- VIEW STATE ---
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [initialScrollTo, setInitialScrollTo] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // --- CHAT STATE ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'thinking' | 'searching' | 'youtube_search'>('idle');
  const [model, setModel] = useState<string>(ModelType.VELICIA_FLASH); 
  const [availableModels] = useState<ModelOption[]>(DEFAULT_MODELS);

  // --- USER & SETTINGS STATE ---
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('velicia_profile');
    return saved ? JSON.parse(saved) : { name: 'Guest', bio: '', isLoggedIn: false };
  });
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  
  // --- UI FLAGS ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modals, setModals] = useState({
      settings: false,
      profile: false,
      help: false,
      login: false
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('velicia_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('velicia_chat_history');
    if (savedHistory) {
        try {
            setHistory(JSON.parse(savedHistory));
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('velicia_chat_history', JSON.stringify(history));
  }, [history]);

  // --- NAVIGATION HANDLERS ---
  const handlePageTransition = (callback: () => void) => {
    setIsPageLoading(true);
    setTimeout(() => {
      callback();
      setTimeout(() => setIsPageLoading(false), 500); 
    }, 800);
  };

  const handleEnterApp = async () => {
    // API Key Check
    try {
        const win = window as any;
        if (win.aistudio) {
            const hasKey = await win.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await win.aistudio.openSelectKey();
            }
        }
    } catch (e) { console.error("API Key Selection Error:", e); }

    handlePageTransition(() => {
      setCurrentView('app');
      setInitialScrollTo(null);
    });
  };
  
  const handleReadArticle = (id: number) => {
    handlePageTransition(() => {
        setSelectedArticleId(id);
        setCurrentView('article');
    });
  };

  const handleBackToLanding = () => {
     handlePageTransition(() => {
        setCurrentView('landing');
        setSelectedArticleId(null);
     });
  };
  
  const handleNavigateFromSidebar = (sectionId: string) => {
    setIsSidebarOpen(false);
    if (currentView !== 'landing') {
        handlePageTransition(() => {
            setCurrentView('landing');
            setInitialScrollTo(sectionId);
        });
    } else {
        setInitialScrollTo(sectionId);
    }
  };

  // --- CHAT LOGIC ---

  const createNewSession = (firstMessage: Message) => {
      const newSession: ChatSession = {
          id: Date.now().toString(),
          title: firstMessage.text.slice(0, 30) + (firstMessage.text.length > 30 ? '...' : ''),
          messages: [firstMessage],
          timestamp: Date.now()
      };
      setHistory(prev => [...prev, newSession]);
      setActiveChatId(newSession.id);
      return newSession;
  };

  const updateActiveSession = (newMessages: Message[]) => {
      if (activeChatId) {
          setHistory(prev => prev.map(session => 
              session.id === activeChatId ? { ...session, messages: newMessages } : session
          ));
      }
  };

  const handleSelectChat = (id: string) => {
      const session = history.find(s => s.id === id);
      if (session) {
          setActiveChatId(id);
          setMessages(session.messages);
      }
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setHistory(prev => prev.filter(s => s.id !== id));
      if (activeChatId === id) {
          setActiveChatId(null);
          setMessages([]);
      }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setIsAILoading(false);
    setLoadingState('idle');
  };

  const handleSend = async (text: string, selectedModel: string, attachments?: Attachment[]) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      timestamp: Date.now(),
      attachments: attachments 
    };

    let currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);

    // If no active chat, create one now
    if (!activeChatId) {
        createNewSession(newUserMessage);
    } else {
        updateActiveSession(currentMessages);
    }

    await processAIResponse(text, selectedModel, currentMessages, attachments);
  };

  const processAIResponse = async (text: string, selectedModel: string, historyMessages: Message[], attachments?: Attachment[]) => {
    setIsAILoading(true);
    setLoadingState('thinking'); 

    const lowerText = text.toLowerCase();
    const hasAttachments = attachments && attachments.length > 0;
    
    // Check intents
    const youtubeKeywords = ['youtube', 'video', 'nonton', 'watch', 'clip', 'cuplikan', 'trailer', 'film'];
    const isYoutubeIntent = youtubeKeywords.some(keyword => lowerText.includes(keyword)) && !hasAttachments;
    
    const searchKeywords = ['siapa', 'kapan', 'dimana', 'berapa', 'terbaru', 'berita', 'hari ini', 'sekarang', 'news', 'latest', 'price', 'who', 'when', 'where', 'search', 'cari', 'info', 'live', 'realtime', 'gaza', 'israel', 'gempa', 'cuaca', 'skor', 'hasil'];
    const isGeneralSearch = searchKeywords.some(keyword => lowerText.includes(keyword)) && !hasAttachments;

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
      const response = await sendMessageToGemini(text, selectedModel, historyMessages, attachments);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(), 
        role: Role.MODEL,
        text: response.text,
        timestamp: Date.now(),
        groundingMetadata: response.groundingMetadata
      };
      
      const updatedMessages = [...historyMessages, newModelMessage];
      setMessages(updatedMessages);
      
      // Update session explicitly here to ensure AI response is saved
      if (activeChatId) {
          setHistory(prev => prev.map(session => 
              session.id === activeChatId ? { ...session, messages: updatedMessages } : session
          ));
      } else {
         // Fallback if ID wasn't set (shouldn't happen due to createNewSession above)
         const lastSession = history[history.length - 1];
         if (lastSession) {
             setHistory(prev => prev.map(s => s.id === lastSession.id ? { ...s, messages: updatedMessages } : s));
         }
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: error instanceof Error ? `⚠️ ${error.message}` : "Maaf, terjadi kesalahan.",
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
    updateActiveSession(newHistory);
    await processAIResponse(newText, model, newHistory, updatedUserMessage.attachments);
  };

  const handleModelSelectFromDashboard = (type: 'text' | 'image') => {
    setModel(ModelType.VELICIA_FLASH);
  };

  // --- MODAL HANDLERS ---
  const toggleModal = (key: keyof typeof modals) => {
      setModals(prev => ({ ...prev, [key]: !prev[key] }));
      setIsSidebarOpen(false); // Close sidebar when opening modal
  };

  const handleLogin = () => {
      if (userProfile.isLoggedIn) {
          if (window.confirm("Apakah Anda yakin ingin keluar?")) {
              setUserProfile({ ...userProfile, isLoggedIn: false, name: 'Guest', bio: '' });
          }
      } else {
          toggleModal('login');
      }
  };

  const handlePerformLogin = () => {
      setUserProfile({ ...userProfile, name: 'User Velicia', isLoggedIn: true });
  };

  return (
    <>
        <TopProgressBar isLoading={isPageLoading} />
        
        {/* MODALS */}
        <SettingsModal 
            isOpen={modals.settings} 
            onClose={() => toggleModal('settings')} 
            language={language}
            setLanguage={setLanguage}
            onClearHistory={() => { setHistory([]); setMessages([]); setActiveChatId(null); }}
        />
        <ProfileModal 
            isOpen={modals.profile} 
            onClose={() => toggleModal('profile')}
            profile={userProfile}
            onSave={setUserProfile}
        />
        <HelpModal 
            isOpen={modals.help}
            onClose={() => toggleModal('help')}
        />
        <LoginModal 
            isOpen={modals.login}
            onClose={() => toggleModal('login')}
            onLogin={handlePerformLogin}
        />

        {currentView === 'landing' && (
            <div className="min-h-screen bg-white">
                <LandingPage 
                    onEnterApp={handleEnterApp} 
                    onReadArticle={handleReadArticle}
                    initialScrollTo={initialScrollTo} 
                />
            </div>
        )}

        {currentView === 'article' && selectedArticleId !== null && (
            <div className="min-h-screen bg-white">
                <ArticlePage 
                    articleId={selectedArticleId} 
                    onBack={handleBackToLanding} 
                />
            </div>
        )}

        {currentView === 'app' && (
            <div className="fixed inset-0 w-full h-[100dvh] bg-[#FAFAFA] flex flex-col overflow-hidden text-gray-900 font-sans">
                
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                    onNewChat={handleNewChat}
                    onNavigate={handleNavigateFromSidebar}
                    
                    history={history}
                    activeChatId={activeChatId}
                    onSelectChat={handleSelectChat}
                    onDeleteChat={handleDeleteChat}
                    
                    userProfile={userProfile}
                    
                    onOpenSettings={() => toggleModal('settings')}
                    onOpenProfile={() => toggleModal('profile')}
                    onOpenHelp={() => toggleModal('help')}
                    onLogin={handleLogin}
                />
                
                <Header 
                    onNewChat={handleNewChat} 
                    onMenuClick={() => setIsSidebarOpen(true)} 
                    user={userProfile.isLoggedIn ? { name: userProfile.name, initial: userProfile.name.charAt(0) } : null} 
                />
                
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
