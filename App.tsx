
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import ArticlePage from './components/ArticlePage';
import HelpPage from './components/HelpPage'; 
import Onboarding, { OnboardingStep } from './components/Onboarding'; 
import { SettingsModal, ProfileModal, LoginModal } from './components/Modals'; 
import { Message, Role, ModelType, DEFAULT_MODELS, ModelOption, Attachment, ChatSession, UserProfile } from './types';
import { streamMessageToGemini } from './services/geminiService';

const TopProgressBar: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isLoading) {
      setVisible(true);
      setProgress(0);
      timeout = setTimeout(() => {
        setProgress(90); 
      }, 50);
    } else {
      setProgress(100); 
      timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] transition-opacity duration-300 pointer-events-none ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="h-[4px] w-full bg-gray-100/10 overflow-visible">
        <div 
          className="h-full relative shadow-[0_0_20px_rgba(255,0,128,0.6)]"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7928CA 0%, #FF0080 50%, #FFD700 100%)',
            transition: isLoading ? 'width 1200ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'width 200ms ease-out',
          }}
        >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[120px] h-[30px] bg-gradient-to-l from-white/90 via-white/40 to-transparent blur-[8px]" />
            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-white shadow-[0_0_25px_5px_rgba(255,255,255,0.9)] rounded-full" />
        </div>
      </div>
    </div>
  );
};

// --- TRANSLATIONS FOR APP ---
const APP_TRANSLATIONS = {
  id: {
    sidebar: {
      nav: 'Navigasi',
      home: 'Utama',
      features: 'Fitur',
      blog: 'Blog',
      history: 'Riwayat Chat',
      emptyHistory: 'Belum ada riwayat percakapan.',
      newChat: 'Chat Baru',
      settings: 'Atur',
      info: 'Panduan', 
      login: 'Masuk / Daftar',
      logout: 'Keluar',
      welcome: 'Pengguna Velicia'
    },
    dashboard: {
      welcome: 'Selamat datang di Velicia.ai',
      subtitle: 'Asisten cerdas Anda untuk obrolan, kreativitas, dan produktivitas tanpa batas.',
      chatBtn: 'Chat AI'
    },
    input: {
      placeholder: 'Ketik pesan ke Velicia...',
      placeholderFile: 'Ketik pesan...',
      maxFiles: 'Maksimal 5 file sekaligus.'
    },
    messageList: {
      thinking: ["Berfikir...", "Analisis prompt...", "Mengidentifikasi...", "Menyusun jawaban...", "Mencari jawaban akurat...", "Menyampaikan hasil..."],
      searching: ["Menghubungkan ke Google...", "Mencari informasi...", "Menelusuri situs...", "Informasi ditemukan!"],
      youtube: ["Menghubungkan ke YouTube...", "Mencari video relevan...", "Mengambil cuplikan...", "Video ditemukan!"],
      generatingVision: 'Generating Vision...',
      source: 'Sumber Penelusuran',
      listen: 'Dengar',
      stop: 'Stop',
      copy: 'Salin',
      copied: 'Disalin',
      like: 'Suka',
      share: 'Bagikan',
      edit: 'Edit pesan',
      save: 'Simpan',
      cancel: 'Batal',
      thinkingProcess: 'Proses Berpikir',
      analysisLog: 'Log Analisis'
    },
    header: {
        welcome: 'Selamat Datang',
        newChat: 'Chat Baru'
    },
    onboarding: [
        {
            title: "Selamat Datang di Velicia",
            description: "Mari kita jelajahi fitur-fitur utama untuk memaksimalkan pengalaman AI Anda. Hanya butuh 30 detik!",
            targetId: undefined 
        },
        {
            title: "Pilih Kecerdasan",
            description: "Ganti model AI di sini. Pilih Gen2 Deep untuk penalaran mendalam atau Gen2 Flash untuk kecepatan.",
            targetId: "tour-model-selector",
            position: "top"
        },
        {
            title: "Upload File & Gambar",
            description: "Velicia bisa melihat! Unggah gambar atau dokumen untuk dianalisis langsung.",
            targetId: "tour-attachments",
            position: "top"
        },
        {
            title: "Mulai Percakapan",
            description: "Ketik pertanyaan Anda di sini. Velicia siap membantu tugas coding, menulis, hingga analisis data.",
            targetId: "tour-input",
            position: "top"
        }
    ]
  },
  en: {
    sidebar: {
      nav: 'Navigation',
      home: 'Home',
      features: 'Features',
      blog: 'Blog',
      history: 'Chat History',
      emptyHistory: 'No conversation history.',
      newChat: 'New Chat',
      settings: 'Settings',
      info: 'Guide',
      login: 'Login / Sign Up',
      logout: 'Logout',
      welcome: 'Velicia User'
    },
    dashboard: {
      welcome: 'Welcome to Velicia.ai',
      subtitle: 'Your intelligent assistant for chat, creativity, and boundless productivity.',
      chatBtn: 'AI Chat'
    },
    input: {
      placeholder: 'Type a message to Velicia...',
      placeholderFile: 'Type a message...',
      maxFiles: 'Maximum 5 files at once.'
    },
    messageList: {
      thinking: ["Thinking...", "Analyzing prompt...", "Identifying...", "Composing answer...", "Seeking accurate answer...", "Delivering result..."],
      searching: ["Connecting to Google...", "Searching information...", "Browsing sites...", "Information found!"],
      youtube: ["Connecting to YouTube...", "Searching relevant videos...", "Fetching clips...", "Video found!"],
      generatingVision: 'Generating Vision...',
      source: 'Search Sources',
      listen: 'Listen',
      stop: 'Stop',
      copy: 'Copy',
      copied: 'Copied',
      like: 'Like',
      share: 'Share',
      edit: 'Edit message',
      save: 'Save',
      cancel: 'Cancel',
      thinkingProcess: 'Thinking Process',
      analysisLog: 'Analysis Log'
    },
    header: {
        welcome: 'Welcome',
        newChat: 'New Chat'
    },
    onboarding: [
        {
            title: "Welcome to Velicia",
            description: "Let's explore the key features to maximize your AI experience. It only takes 30 seconds!",
            targetId: undefined
        },
        {
            title: "Choose Intelligence",
            description: "Switch AI models here. Choose Gen2 Deep for deep reasoning or Gen2 Flash for speed.",
            targetId: "tour-model-selector",
            position: "top"
        },
        {
            title: "Upload Files & Images",
            description: "Velicia can see! Upload images or documents for instant analysis.",
            targetId: "tour-attachments",
            position: "top"
        },
        {
            title: "Start Chatting",
            description: "Type your query here. Velicia is ready to help with coding, writing, and data analysis.",
            targetId: "tour-input",
            position: "top"
        }
    ]
  }
};


type AppView = 'landing' | 'app' | 'article' | 'help'; 

const App: React.FC = () => {
  // --- VIEW STATE (Persisted) ---
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('velicia_current_view');
        if (saved === 'app' || saved === 'landing' || saved === 'article' || saved === 'help') {
            return saved as AppView;
        }
    }
    return 'landing';
  });

  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('velicia_article_id');
        return saved ? parseInt(saved) : null;
    }
    return null;
  });

  const [initialScrollTo, setInitialScrollTo] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // --- CHAT STATE ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<ChatSession[]>([]);
  
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
      if (typeof window !== 'undefined') {
          return localStorage.getItem('velicia_active_chat_id');
      }
      return null;
  });

  const [isAILoading, setIsAILoading] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'thinking' | 'searching' | 'youtube_search'>('idle');
  const [model, setModel] = useState<string>(ModelType.GEN2_V2_5); 
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
      login: false
  });
  
  // --- ONBOARDING STATE ---
  const [showOnboarding, setShowOnboarding] = useState(false);

  // --- PERSISTENCE LOGIC ---
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

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem('velicia_chat_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('velicia_current_view', currentView);
  }, [currentView]);

  useEffect(() => {
    if (selectedArticleId !== null) {
        localStorage.setItem('velicia_article_id', selectedArticleId.toString());
    } else {
        localStorage.removeItem('velicia_article_id');
    }
  }, [selectedArticleId]);

  useEffect(() => {
    if (activeChatId) {
        localStorage.setItem('velicia_active_chat_id', activeChatId);
    } else {
        localStorage.removeItem('velicia_active_chat_id');
    }
  }, [activeChatId]);

  useEffect(() => {
      if (activeChatId && history.length > 0 && messages.length === 0) {
          const session = history.find(s => s.id === activeChatId);
          if (session) {
              setMessages(session.messages);
          } else {
              setActiveChatId(null);
          }
      }
  }, [history, activeChatId, messages.length]);


  // --- NAVIGATION HANDLERS ---
  const handlePageTransition = (callback: () => void) => {
    setIsPageLoading(true);
    setTimeout(() => {
      callback();
      setTimeout(() => setIsPageLoading(false), 200); 
    }, 1200);
  };

  const checkOnboarding = () => {
      const hasOnboarded = localStorage.getItem('velicia_has_onboarded');
      if (!hasOnboarded) {
          setTimeout(() => setShowOnboarding(true), 1000);
      }
  };

  const handleEnterApp = async () => {
    handlePageTransition(() => {
      setCurrentView('app');
      setInitialScrollTo(null);
      checkOnboarding();
    });
  };
  
  useEffect(() => {
      if (currentView === 'app') {
          checkOnboarding();
      }
  }, [currentView]);

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

  const handleBackFromHelp = () => {
      handlePageTransition(() => {
          setCurrentView('app'); 
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

  const handleOpenHelpPage = () => {
      setIsSidebarOpen(false);
      handlePageTransition(() => {
          setCurrentView('help');
      });
  };

  const finishOnboarding = () => {
      setShowOnboarding(false);
      localStorage.setItem('velicia_has_onboarded', 'true');
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

  const updateActiveSession = (sessionId: string, newMessages: Message[]) => {
      setHistory(prev => prev.map(session => 
          session.id === sessionId ? { ...session, messages: newMessages } : session
      ));
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
    
    // Create new session OR update existing one BEFORE sending to AI
    let targetSessionId = activeChatId;
    
    if (!targetSessionId) {
        const newSession = createNewSession(newUserMessage);
        targetSessionId = newSession.id;
    } else {
        updateActiveSession(targetSessionId, currentMessages);
    }

    // Pass the specific Session ID to the processor
    await processAIResponse(text, selectedModel, currentMessages, attachments, targetSessionId);
  };

  const processAIResponse = async (text: string, selectedModel: string, historyMessages: Message[], attachments: Attachment[] | undefined, sessionId: string) => {
    setIsAILoading(true);
    setLoadingState('thinking'); 

    const lowerText = text.toLowerCase();
    const hasAttachments = attachments && attachments.length > 0;
    
    const youtubeKeywords = ['youtube', 'video', 'nonton', 'watch', 'clip', 'cuplikan', 'trailer', 'film'];
    const isYoutubeIntent = youtubeKeywords.some(keyword => lowerText.includes(keyword)) && !hasAttachments;
    
    const searchKeywords = [
        'siapa', 'kapan', 'dimana', 'berapa', 'terbaru', 'berita', 'hari ini', 'sekarang', 
        'news', 'latest', 'price', 'who', 'when', 'where', 'search', 'cari', 'info', 
        'live', 'realtime', 'gaza', 'israel', 'gempa', 'cuaca', 'skor', 'hasil', 'profil',
        'biografi', 'saham', 'kurs', 'rupiah', 'dollar', 'jadwal', 'klasemen', 'pemilu',
        'presiden', 'menteri', 'kebijakan', 'uu', 'hukum', 'kasus', 'viral', 'trending'
    ];
    const isGeneralSearch = searchKeywords.some(keyword => lowerText.includes(keyword)) && !hasAttachments;

    // Loading State Logic (Visual only)
    let searchToggleInterval: ReturnType<typeof setInterval> | undefined;
    if (isYoutubeIntent || isGeneralSearch) {
        const searchType = isYoutubeIntent ? 'youtube_search' : 'searching';
        setLoadingState(searchType);
        searchToggleInterval = setInterval(() => {
            setLoadingState(currentState => 
                (currentState === 'searching' || currentState === 'youtube_search') ? 'thinking' : searchType
            );
        }, 2500); 
    }

    // Initialize the AI Message placeholder
    const aiMessageId = (Date.now() + 1).toString();
    const placeholderMessage: Message = {
        id: aiMessageId,
        role: Role.MODEL,
        text: '', // Start empty
        timestamp: Date.now(),
    };

    // Update UI immediately with empty message to prevent "blink"
    let currentConversation = [...historyMessages, placeholderMessage];
    
    // Function to update local messages state AND history state safely
    const updateConversationState = (updatedMsg: Message) => {
        const newConv = currentConversation.map(m => m.id === updatedMsg.id ? updatedMsg : m);
        currentConversation = newConv; // Update reference
        
        // Update View
        setMessages(newConv);
        
        // Update History (Persist)
        setHistory(prev => prev.map(s => s.id === sessionId ? { ...s, messages: newConv } : s));
    };

    // Add placeholder to state
    updateConversationState(placeholderMessage);

    try {
      // Use Streaming API
      const stream = streamMessageToGemini(text, selectedModel, historyMessages, attachments);
      
      let accumulatedText = "";
      
      for await (const chunk of stream) {
          accumulatedText += chunk.text;
          
          const updatedAiMessage: Message = {
              ...placeholderMessage,
              text: accumulatedText,
              groundingMetadata: chunk.groundingMetadata || placeholderMessage.groundingMetadata
          };
          
          updateConversationState(updatedAiMessage);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: aiMessageId,
        role: Role.MODEL,
        text: error instanceof Error ? `⚠️ ${error.message}` : "Maaf, terjadi kesalahan.",
        timestamp: Date.now(),
      };
      updateConversationState(errorMessage);

    } finally {
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
    if (activeChatId) {
        updateActiveSession(activeChatId, newHistory);
        await processAIResponse(newText, model, newHistory, updatedUserMessage.attachments, activeChatId);
    }
  };

  const handleModelSelectFromDashboard = (type: 'text' | 'image') => {
    setModel(ModelType.GEN2_V2_5);
  };

  // --- MODAL HANDLERS ---
  const toggleModal = (key: keyof typeof modals) => {
      setModals(prev => ({ ...prev, [key]: !prev[key] }));
      setIsSidebarOpen(false); 
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
                    language={language}
                    setLanguage={setLanguage}
                />
            </div>
        )}

        {currentView === 'article' && selectedArticleId !== null && (
            <div className="min-h-screen bg-white">
                <ArticlePage 
                    articleId={selectedArticleId} 
                    onBack={handleBackToLanding}
                    onReadArticle={handleReadArticle} 
                />
            </div>
        )}

        {currentView === 'help' && (
            <HelpPage 
                onBack={handleBackFromHelp}
                language={language}
            />
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
                    onOpenHelp={handleOpenHelpPage} 
                    onLogin={handleLogin}
                    translations={APP_TRANSLATIONS[language]}
                />
                
                <Header 
                    onNewChat={handleNewChat} 
                    onMenuClick={() => setIsSidebarOpen(true)} 
                    user={userProfile.isLoggedIn ? { name: userProfile.name, initial: userProfile.name.charAt(0) } : null} 
                    translations={APP_TRANSLATIONS[language]}
                />
                
                <main className="flex-1 w-full max-w-5xl mx-auto pt-20 overflow-y-auto no-scrollbar relative flex flex-col scroll-smooth">
                    <div className="flex-1 px-4 md:px-6 py-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <Dashboard onModelSelect={handleModelSelectFromDashboard} translations={APP_TRANSLATIONS[language]} />
                            </div>
                        ) : (
                            <MessageList 
                                messages={messages} 
                                isLoading={isAILoading} 
                                loadingState={loadingState} 
                                currentModel={model} 
                                onEditMessage={handleEditMessage} 
                                translations={APP_TRANSLATIONS[language]}
                            />
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
                        translations={APP_TRANSLATIONS[language]}
                    />
                </div>

                <Onboarding 
                    isOpen={showOnboarding}
                    steps={APP_TRANSLATIONS[language].onboarding as OnboardingStep[]}
                    onComplete={finishOnboarding}
                    onSkip={finishOnboarding}
                />
            </div>
        )}
    </>
  );
};

export default App;
