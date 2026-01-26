
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, AudioLines, ArrowUp, ChevronUp, Image as ImageIcon, MessageSquareText, X, Sparkles, Zap, Aperture, Code, Palette, Settings2, Layout } from 'lucide-react';
import { ModelOption, Attachment, ModelType } from '../types';

interface InputAreaProps {
  onSend: (text: string, modelId: string, attachment?: Attachment) => void;
  isLoading: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  availableModels: ModelOption[];
}

// --- Brand Icon Components ---
const BrandIcon: React.FC<{ brand: string, className?: string }> = ({ brand, className = "w-6 h-6" }) => {
  switch (brand) {
    case 'velicia':
      return (
        <div className={`${className} bg-gradient-to-tr from-[#7C3AED] to-pink-500 rounded-md flex items-center justify-center text-white shadow-sm`}>
          <Sparkles size={14} fill="white" />
        </div>
      );
    case 'google':
      return (
        <img 
            src="https://img.icons8.com/?size=100&id=iBkBIBWE6tfT&format=png&color=000000" 
            alt="Gemini" 
            className={`${className} object-contain`} 
        />
      );
    case 'openai':
      return (
        <img 
            src="https://img.icons8.com/?size=100&id=FBO05Dys9QCg&format=png&color=000000" 
            alt="GPT" 
            className={`${className} object-contain`} 
        />
      );
    case 'deepseek':
      return (
         <img 
            src="https://img.icons8.com/?size=100&id=YWOidjGxCpFW&format=png&color=000000" 
            alt="DeepSeek" 
            className={`${className} object-contain`} 
        />
      );
    case 'midjourney':
      return (
        <img 
            src="https://img.icons8.com/?size=100&id=2Wgfq9p8joZQ&format=png&color=000000" 
            alt="Midjourney" 
            className={`${className} object-contain`} 
        />
      );
    case 'flux':
      return (
        <div className={`${className} bg-black rounded-sm flex items-center justify-center`}>
            <Palette size={14} className="text-white" />
        </div>
      );
    case 'stability':
    case 'pollinations':
      return (
        <div className={`${className} bg-indigo-500 rounded-sm flex items-center justify-center`}>
            <ImageIcon size={14} className="text-white" />
        </div>
      );
    default:
      return <Zap size={16} className={className} />;
  }
};

const InputArea: React.FC<InputAreaProps> = ({ 
  onSend, 
  isLoading, 
  selectedModel, 
  onModelChange,
  availableModels 
}) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeModelOption = availableModels.find(m => m.id === selectedModel);
  const activeModelLabel = activeModelOption?.label || selectedModel;
  const isImageModel = activeModelOption?.category === 'image';

  const handleSend = () => {
    if ((!text.trim() && !attachment) || isLoading) return;
    
    // Kirim pesan without imageSize
    onSend(text, selectedModel, attachment || undefined);
    
    // Reset state
    setText('');
    setAttachment(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  // Handle File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Saat ini hanya mendukung file gambar.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAttachment({
          type: 'image',
          content: event.target.result, 
          mimeType: file.type
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleTriggerFile = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsModelMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const textModels = availableModels.filter(m => m.category === 'text');
  const imageModels = availableModels.filter(m => m.category === 'image');

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileSelect}
      />

      <div className={`relative bg-white rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border transition-all duration-300 focus-within:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] border-gray-100 p-2`}>
        
        {attachment && (
          <div className="px-4 pt-3 pb-1 flex">
            <div className="relative group">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                <img 
                  src={attachment.content} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={handleRemoveAttachment}
                className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white rounded-full p-0.5 shadow-md hover:bg-black transition-colors"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}

        {/* Text Input Area */}
        <div className={`px-4 pb-2 ${attachment ? 'pt-2' : 'pt-3'}`}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
                isImageModel ? "Deskripsikan gambar yang ingin dibuat..." : 
                "Ketik pesan ke Velicia..."
            }
            disabled={isLoading}
            rows={1}
            className="w-full resize-none text-gray-800 placeholder-gray-400 bg-transparent border-none focus:ring-0 focus:outline-none text-[16px] max-h-[150px] overflow-y-auto no-scrollbar"
            style={{ minHeight: '24px' }}
          />
        </div>

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between px-2 pb-1 mt-1">
          
          <div className="flex items-center gap-2">
            {/* Model Selector Pill */}
            <div className="relative" ref={menuRef}>
                <button
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className={`flex items-center space-x-2 hover:bg-gray-100 text-gray-700 py-1.5 px-3 rounded-2xl transition-all border border-gray-100 ${
                    activeModelOption?.brand === 'velicia' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-pink-100 text-gray-800' : 'bg-gray-50'
                }`}
                >
                <BrandIcon brand={activeModelOption?.brand || 'velicia'} className="w-5 h-5" />
                <div className="flex flex-col items-start text-left leading-tight">
                    <span className="font-bold text-[12px]">{activeModelLabel}</span>
                    <span className="text-[9px] opacity-60 font-medium tracking-wide">{activeModelOption?.description}</span>
                </div>
                <ChevronUp size={14} className={`ml-1 text-gray-400 transition-transform duration-200 ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isModelMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 origin-bottom-left animate-in fade-in slide-in-from-bottom-2 duration-200 max-h-[400px] overflow-y-auto no-scrollbar">
                    
                    {/* Text Models */}
                    {textModels.length > 0 && (
                    <div>
                        <div className="px-4 py-2 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10 border-t border-gray-100">
                        Reasoning & Chat
                        </div>
                        {textModels.map((model) => (
                        <button
                            key={model.id}
                            onClick={() => {
                            onModelChange(model.id);
                            setIsModelMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                            selectedModel === model.id ? 'bg-gray-50' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 flex items-center justify-center`}>
                                    <BrandIcon brand={model.brand} className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className={`font-bold text-gray-800 flex items-center gap-2 ${model.brand === 'velicia' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500' : ''}`}>
                                        {model.label}
                                        {model.brand === 'velicia' && <span className="bg-pink-100 text-pink-600 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide">Pro</span>}
                                    </div>
                                    {model.description && <div className="text-[10px] text-gray-400 font-medium">{model.description}</div>}
                                </div>
                            </div>
                        </button>
                        ))}
                    </div>
                    )}

                    {/* Image Models */}
                    {imageModels.length > 0 && (
                    <div>
                        <div className="px-4 py-2 bg-purple-50/30 text-[10px] font-bold text-purple-600 uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10 border-t border-gray-100">
                        Vision & Art
                        </div>
                        {imageModels.map((model) => (
                        <button
                            key={model.id}
                            onClick={() => {
                            onModelChange(model.id);
                            setIsModelMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-purple-50/30 transition-colors border-b border-gray-50 last:border-0 ${
                            selectedModel === model.id ? 'bg-purple-50/50' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 flex items-center justify-center`}>
                                    <BrandIcon brand={model.brand} className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">
                                        {model.label}
                                    </div>
                                    {model.description && <div className="text-[10px] text-gray-400 font-medium">{model.description}</div>}
                                </div>
                            </div>
                        </button>
                        ))}
                    </div>
                    )}
                    
                </div>
                )}
            </div>
            
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleTriggerFile}
              className={`transition-colors p-2 rounded-full hover:bg-gray-100 ${attachment ? 'text-gray-900 bg-gray-100' : 'text-gray-400 hover:text-gray-600'}`} 
              title="Attach file"
            >
              <Paperclip size={20} strokeWidth={attachment ? 2.5 : 2} />
            </button>
            
            <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors" title="Voice input">
              <AudioLines size={20} />
            </button>

            <button
              onClick={handleSend}
              disabled={(!text.trim() && !attachment) || isLoading}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                (text.trim() || attachment) && !isLoading
                  ? 'bg-black text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                  : isLoading 
                    ? 'bg-gray-100 cursor-wait'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="btn-jump-loader"></div>
              ) : (
                <ArrowUp size={20} strokeWidth={3} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
