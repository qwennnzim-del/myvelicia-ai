
import React, { useRef, useEffect, useState } from 'react';
import { Message, Role } from '../types';
import ReactMarkdown from 'react-markdown';
import { IMAGE_MODELS } from '../services/geminiService';
import { Copy, ThumbsUp, Share2, Edit2, Check, ExternalLink, Globe, Play, Youtube, FileText, Brain, ChevronDown, Sparkles, Cpu } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  loadingState?: 'idle' | 'thinking' | 'searching' | 'youtube_search';
  currentModel: string;
  onEditMessage: (messageId: string, newText: string) => void;
}

// --- Helper: Extract YouTube ID ---
const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// --- Helper: Parse Chain of Thought ---
const parseChainOfThought = (text: string) => {
  // Regex to capture PART 1 and PART 2, handling potential formatting variations like bolding or extra text
  // Matches: "PART 1: THE THINKING SPACE" (case insensitive, ignoring leading markdown chars)
  // Group 1: Thinking Content
  // Matches: "PART 2: THE FINAL EXECUTION"
  // Group 2: Final Answer
  const pattern = /(?:^|\n)(?:[\#\*\_]*)\s*PART 1: THE THINKING SPACE(?:[^\n]*)(?:\n+)([\s\S]*?)(?:\n+)(?:[\#\*\_]*)\s*PART 2: THE FINAL EXECUTION(?:[^\n]*)(?:\n+)([\s\S]*)/i;
  
  const match = text.match(pattern);

  if (match) {
    let thought = match[1].trim();
    let answer = match[2].trim();

    // CLEANUP: If the model wrapped the ENTIRE answer in a code block (common mistake), unwrap it.
    // e.g. ```\nAnswer...\n```
    const codeBlockWrapper = /^```(?:markdown|md|text)?\s*([\s\S]*?)\s*```$/i;
    const codeMatch = answer.match(codeBlockWrapper);
    if (codeMatch) {
        answer = codeMatch[1].trim();
    }

    // Handle weird trailing artifacts if any (e.g. "]))" from the user's screenshot, likely JSON closure artifact)
    // If the answer looks like a sliced JSON string ending weirdly, we can't easily fix it without context, 
    // but unwrapping the code block usually fixes the visual display issue.

    return {
      hasThought: true,
      thought: thought,
      answer: answer
    };
  }
  
  return {
    hasThought: false,
    thought: '',
    answer: text
  };
};

// --- Component: Thinking Box (CoT) ---
const ThinkingBox: React.FC<{ thought: string }> = ({ thought }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Calculate a fake "duration" based on thought length to make it look realistic (approx 50 chars per sec thinking speed)
  const duration = Math.max(1.2, (thought.length / 100)).toFixed(1);

  return (
    <div className="mb-4 w-full max-w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 border w-full md:w-auto ${
          isOpen 
            ? 'bg-purple-50 text-purple-700 border-purple-100' 
            : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
        }`}
      >
        <div className={`p-1 rounded-md ${isOpen ? 'bg-purple-100' : 'bg-gray-200'}`}>
           <Brain size={12} className={isOpen ? 'text-purple-600' : 'text-gray-500'} />
        </div>
        <span>Deep Reasoning Process</span>
        <span className="text-[10px] opacity-60 font-normal ml-1">({duration}s)</span>
        <ChevronDown size={12} className={`ml-auto md:ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 text-xs font-mono text-gray-600 leading-relaxed shadow-inner overflow-x-auto">
           <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Cpu size={12} /> Chain of Thought Log
           </div>
           <ReactMarkdown>{thought}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

// --- Internal Component: Typewriter Effect ---
const TypewriterLabel: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    if (currentPhraseIndex >= phrases.length) {
        setCurrentPhraseIndex(0);
        setCharIndex(0);
        setDisplayedText('');
        return;
    }

    const currentFullText = phrases[currentPhraseIndex];
    if (!currentFullText) return; 

    if (isFadingOut) {
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(false);
        setDisplayedText('');
        setCharIndex(0);
        if (currentPhraseIndex < phrases.length - 1) {
            setCurrentPhraseIndex(prev => prev + 1);
        }
      }, 500); 
      return () => clearTimeout(fadeTimeout);
    }

    if (charIndex < currentFullText.length) {
      const typeTimeout = setTimeout(() => {
        setDisplayedText(prev => prev + currentFullText[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 40); 
      return () => clearTimeout(typeTimeout);
    } else {
      if (currentPhraseIndex < phrases.length - 1) {
        const holdTimeout = setTimeout(() => {
          setIsFadingOut(true);
        }, 1500); 
        return () => clearTimeout(holdTimeout);
      }
    }
  }, [charIndex, currentPhraseIndex, phrases, isFadingOut]);

  return (
    <span className={`text-xs font-medium transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, loadingState = 'idle', currentModel, onEditMessage }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, editingId, loadingState]); 

  const isImageModel = IMAGE_MODELS.includes(currentModel) || currentModel.startsWith('flux');

  const thinkingPhrases = [
    "Berfikir...",
    "Analisis prompt...",
    "Mengidentifikasi...",
    "Menyusun jawaban...",
    "Mencari jawaban akurat...",
    "Menyampaikan hasil..."
  ];
  
  const searchPhrases = [
    "Menghubungkan ke Google...",
    "Mencari informasi...",
    "Menelusuri situs...",
    "Informasi ditemukan!"
  ];

  const youtubePhrases = [
    "Menghubungkan ke YouTube...",
    "Mencari video relevan...",
    "Mengambil cuplikan...",
    "Video ditemukan!"
  ];
  
  const activePhrases = thinkingPhrases;

  const handleStartEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(msg.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      onEditMessage(id, editText);
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleLike = (id: string) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Velicia AI Chat',
          text: text,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      alert("Fitur share tidak didukung di browser ini.");
    }
  };

  if (messages.length === 0) {
    return null; 
  }

  return (
    <div className="flex flex-col space-y-6 pb-4">
      {messages.map((msg) => {
        // Parse content for Thinking Box (Only for Model messages)
        const { hasThought, thought, answer } = (msg.role === Role.MODEL) 
            ? parseChainOfThought(msg.text) 
            : { hasThought: false, thought: '', answer: msg.text };

        return (
        <div
          key={msg.id}
          className={`flex w-full group animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both ${
            msg.role === Role.USER ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex flex-col ${
              msg.role === Role.USER
                ? 'items-end text-gray-800 text-right max-w-[90%] md:max-w-[80%]'
                : `items-start text-gray-900 text-left max-w-[90%] md:max-w-[85%]`
            }`}
          >
            {/* User Attachment Display (Multi-File) */}
            {msg.role === Role.USER && msg.attachments && msg.attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2 justify-end">
                {msg.attachments.map((att, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center group/file">
                        {att.type === 'image' ? (
                            <div className="max-w-[120px] md:max-w-[160px]">
                                <img src={att.content} alt="Attachment" className="w-full h-auto object-cover rounded-xl" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-2.5 min-w-[140px] bg-white rounded-xl">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                    <FileText className="text-gray-600" size={16} />
                                </div>
                                <div className="flex flex-col text-left overflow-hidden">
                                    <span className="text-xs font-bold text-gray-900 truncate max-w-[100px]">{att.name || "Document"}</span>
                                    <span className="text-[9px] text-gray-500 uppercase">{att.mimeType.split('/')[1] || 'FILE'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
              </div>
            )}

            {/* Message Text Area */}
            {msg.role === Role.MODEL ? (
               <div className="relative w-full">
                 
                 {/* CHAIN OF THOUGHT BOX (NEW) */}
                 {hasThought && <ThinkingBox thought={thought} />}

                 {/* Regular Text Content - Optimized Typography */}
                 <div className="prose prose-slate max-w-none 
                   prose-p:leading-relaxed prose-p:text-gray-800 prose-p:text-[15px]
                   prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0 prose-headings:text-lg
                   prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
                   prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4
                   prose-li:my-1 prose-li:text-[15px]
                   prose-strong:font-bold prose-strong:text-gray-900
                   prose-code:font-mono prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:text-sm
                   prose-pre:bg-[#1a1a1a] prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-3 prose-pre:my-3 prose-pre:shadow-sm
                   prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                   prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500
                   prose-img:rounded-2xl prose-img:shadow-md prose-img:my-2 prose-img:max-w-full prose-img:w-auto">
                    <ReactMarkdown>{answer}</ReactMarkdown>
                 </div>
                 
                 {/* GROUNDING SOURCES */}
                 {msg.groundingMetadata && msg.groundingMetadata.groundingChunks?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-700">
                             <div className="p-1 bg-blue-50 rounded-full"><Globe size={12} className="text-blue-600"/></div>
                             <span>Sumber Penelusuran</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {msg.groundingMetadata.groundingChunks.map((chunk, idx) => {
                                if (!chunk.web) return null;
                                const domain = new URL(chunk.web.uri).hostname.replace('www.', '');
                                const youtubeId = getYoutubeId(chunk.web.uri);

                                if (youtubeId) {
                                    return (
                                        <a 
                                            key={idx} 
                                            href={chunk.web.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex flex-col p-0 bg-white border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all duration-300 w-[180px] no-underline group/card overflow-hidden"
                                        >
                                            <div className="w-full h-[100px] bg-gray-200 relative">
                                                <img 
                                                    src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} 
                                                    alt="Thumbnail" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/card:bg-black/10 transition-colors">
                                                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                                                        <Play size={10} fill="white" className="text-white ml-0.5" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <div className="text-[10px] font-bold text-gray-800 line-clamp-2 mb-1 leading-tight group-hover/card:text-red-600 transition-colors">{chunk.web.title}</div>
                                                <div className="flex items-center gap-1 text-[9px] text-gray-400">
                                                    <Youtube size={10} className="text-red-500" />
                                                    <span>YouTube</span>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                }

                                return (
                                    <a 
                                        key={idx} 
                                        href={chunk.web.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-300 max-w-[240px] no-underline group/card"
                                    >
                                        <div className="w-6 h-6 rounded-md bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                                            <img 
                                                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} 
                                                alt="icon" 
                                                className="w-4 h-4 object-contain"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-bold text-gray-800 truncate group-hover/card:text-blue-600 transition-colors">{chunk.web.title}</div>
                                            <div className="text-[9px] text-gray-400 truncate">{domain}</div>
                                        </div>
                                        <ExternalLink size={10} className="text-gray-300 group-hover/card:text-blue-400" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                 )}

                 <div className="flex items-center gap-2 mt-3 pt-1">
                    <button 
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="flex items-center gap-1 text-[10px] font-medium text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                        title="Salin pesan"
                    >
                        {copiedId === msg.id ? <Check size={12} className="text-green-500"/> : <Copy size={12} />}
                        {copiedId === msg.id ? "Disalin" : "Salin"}
                    </button>
                    <button 
                        onClick={() => handleLike(msg.id)}
                        className={`flex items-center gap-1 text-[10px] font-medium transition-colors p-1 rounded-md hover:bg-gray-100 ${likedMessages.has(msg.id) ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Suka"
                    >
                        <ThumbsUp size={12} className={likedMessages.has(msg.id) ? 'fill-current' : ''} />
                    </button>
                    <button 
                        onClick={() => handleShare(msg.text)}
                        className="flex items-center gap-1 text-[10px] font-medium text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                        title="Bagikan"
                    >
                        <Share2 size={12} />
                    </button>
                 </div>
               </div>
            ) : (
              <div className="group relative">
                {editingId === msg.id ? (
                  <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-md min-w-[280px] md:min-w-[400px]">
                     <textarea 
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full text-gray-800 bg-transparent resize-none outline-none text-sm mb-2"
                        rows={3}
                        autoFocus
                     />
                     <div className="flex justify-end gap-2">
                        <button 
                           onClick={handleCancelEdit}
                           className="px-2 py-1 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                           Batal
                        </button>
                        <button 
                           onClick={() => handleSaveEdit(msg.id)}
                           disabled={!editText.trim() || editText === msg.text}
                           className="px-2 py-1 text-xs font-bold text-white bg-black hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           Simpan
                        </button>
                     </div>
                  </div>
                ) : (
                    <div className="relative group">
                         {msg.text && (
                            <div className="bg-gray-100/50 hover:bg-gray-100 transition-colors py-2 px-4 rounded-[18px] text-gray-800 text-[15px] inline-block text-left break-words">
                                {msg.text}
                            </div>
                         )}
                         <button 
                            onClick={() => handleStartEdit(msg)}
                            className="absolute -left-7 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                            title="Edit pesan"
                         >
                            <Edit2 size={12} />
                         </button>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
      })}
      
      {isLoading && (
        isImageModel ? (
          <div className="flex w-full justify-start mt-2">
             <div className="relative w-full max-w-[240px] aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-inner border border-gray-100 flex items-center justify-center">
                <div className="speeder_loader scale-75">
                  <span><span></span><span></span><span></span><span></span></span>
                  <div className="speeder_base">
                    <span></span>
                    <div className="speeder_face"></div>
                  </div>
                </div>
                <div className="speeder_longfazers scale-75">
                  <span></span><span></span><span></span><span></span>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-semibold text-gray-400 tracking-wider uppercase animate-pulse">
                  Generating Vision...
                </div>
             </div>
          </div>
        ) : (
           <div className="flex items-center justify-start w-full pl-0 mt-1 h-10 relative overflow-visible animate-in fade-in duration-500">
                <div className="flex items-center gap-3">
                    
                    {/* Simplified Container */}
                    <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                        {/* OVERLAPPING ICONS FOR SMOOTH TRANSITION */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            
                            {/* 1. Velicia / Thinking Icon */}
                            <div className={`absolute transition-all duration-500 ease-out transform ${
                                loadingState === 'thinking' || loadingState === 'idle' 
                                ? 'opacity-100 scale-100 rotate-0' 
                                : 'opacity-0 scale-50 -rotate-90'
                            }`}>
                                <img src="/logoApp/logo-app.png" alt="Velicia Logo" className="w-5 h-5 object-contain animate-pulse" />
                            </div>

                            {/* 2. Google / Searching Icon */}
                            <div className={`absolute transition-all duration-500 ease-out transform ${
                                loadingState === 'searching' 
                                ? 'opacity-100 scale-100 rotate-0' 
                                : 'opacity-0 scale-50 -rotate-90'
                            }`}>
                                <img 
                                    src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" 
                                    alt="Google" 
                                    className="w-4 h-4 object-contain"
                                />
                            </div>

                            {/* 3. YouTube Icon */}
                            <div className={`absolute transition-all duration-500 ease-out transform ${
                                loadingState === 'youtube_search' 
                                ? 'opacity-100 scale-100 rotate-0' 
                                : 'opacity-0 scale-50 -rotate-90'
                            }`}>
                                <img 
                                    src="https://img.icons8.com/?size=100&id=19318&format=png&color=000000" 
                                    alt="YouTube"
                                    className="w-4 h-4 object-contain"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Text Label with Color Transition */}
                    <div className={`transition-colors duration-700 ease-in-out ${
                        loadingState === 'searching' 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500' 
                        : loadingState === 'youtube_search'
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400'
                        : 'text-gray-400'
                    }`}>
                        {loadingState === 'searching' ? (
                            <TypewriterLabel phrases={searchPhrases} key="search" />
                        ) : loadingState === 'youtube_search' ? (
                            <TypewriterLabel phrases={youtubePhrases} key="youtube" />
                        ) : (
                            <TypewriterLabel phrases={activePhrases} key="thinking" />
                        )}
                    </div>
                </div>
           </div>
        )
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
