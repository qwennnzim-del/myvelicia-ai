
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, AudioLines, ArrowUp, ChevronUp, X, FileText, Image as ImageIcon, FileSpreadsheet, FileIcon, Sparkles, Video, FileChartColumn } from 'lucide-react';
import { ModelOption, Attachment } from '../types';

interface InputAreaProps {
  onSend: (text: string, modelId: string, attachments?: Attachment[]) => void;
  isLoading: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  availableModels: ModelOption[];
  translations: any;
}

const BrandIcon: React.FC<{ brand: string, className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <Sparkles className={`${className} text-[#7928CA]`} strokeWidth={2.5} />
  );
};

const InputArea: React.FC<InputAreaProps> = ({ 
  onSend, 
  isLoading, 
  selectedModel, 
  onModelChange,
  availableModels,
  translations
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations.input;

  const activeModelOption = availableModels.find(m => m.id === selectedModel);
  const activeModelLabel = activeModelOption?.label || selectedModel;

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;
    onSend(text, selectedModel, attachments.length > 0 ? attachments : undefined);
    setText('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleTriggerFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxFiles = 5;
    const remainingSlots = maxFiles - attachments.length;
    
    if (remainingSlots <= 0) {
        alert(t.maxFiles);
        return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    filesToProcess.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            let type: Attachment['type'] = 'file';
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('video/')) type = 'video';
            else if (file.type.startsWith('audio/')) type = 'audio';

            setAttachments(prev => [...prev, {
                type: type,
                content: event.target?.result as string,
                mimeType: file.type,
                name: file.name
            }]);
        };
        reader.readAsDataURL(file);
    });

    // Reset input value to allow selecting the same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (mimeType: string, type: string) => {
      if (type === 'image') return <ImageIcon size={16} className="text-purple-500" />;
      if (type === 'video') return <Video size={16} className="text-pink-500" />;
      if (type === 'audio') return <AudioLines size={16} className="text-orange-500" />;
      
      if (mimeType.includes('pdf')) return <FileText size={16} className="text-red-500" />;
      if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) return <FileSpreadsheet size={16} className="text-green-500" />;
      if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return <FileChartColumn size={16} className="text-orange-400" />;
      
      return <FileIcon size={16} className="text-blue-500" />;
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

  return (
    <div className="w-full max-w-2xl mx-auto px-3 pb-2 md:pb-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple
        // Support: Images, Videos, Audio, PDF, Word, Excel, PowerPoint, Text, CSV
        accept="image/*,video/*,audio/*,application/pdf,text/plain,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" 
        onChange={handleFileChange}
      />

      <div className="relative bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border transition-all duration-300 focus-within:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.1)] border-gray-100 p-1.5 md:p-2">
        
        {/* Attachment Preview Rail */}
        {attachments.length > 0 && (
          <div className="px-3 pt-2 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
            {attachments.map((att, idx) => (
                <div key={idx} className="relative group shrink-0">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex flex-col items-center justify-center relative">
                        {att.type === 'image' ? (
                            <img src={att.content} alt="Preview" className="w-full h-full object-cover" />
                        ) : att.type === 'video' ? (
                            <div className="w-full h-full bg-black flex items-center justify-center">
                                <Video size={20} className="text-white" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-1 w-full text-center h-full">
                                {getFileIcon(att.mimeType, att.type)}
                                <span className="text-[8px] text-gray-500 font-medium truncate w-full mt-1 px-1">{att.name}</span>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => removeAttachment(idx)} 
                        className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white rounded-full p-0.5 shadow-md hover:bg-red-500 transition-colors z-10"
                    >
                        <X size={10} strokeWidth={2} />
                    </button>
                </div>
            ))}
          </div>
        )}

        <div className={`px-3 pb-1 ${attachments.length > 0 ? 'pt-1' : 'pt-2'}`}>
          <textarea
            id="tour-input"
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={attachments.length > 0 ? t.placeholderFile : t.placeholder}
            disabled={isLoading}
            rows={1}
            className="w-full resize-none text-gray-800 placeholder-gray-400 bg-transparent border-none focus:ring-0 focus:outline-none text-sm max-h-[120px] overflow-y-auto no-scrollbar"
            style={{ minHeight: '20px' }}
          />
        </div>

        <div className="flex items-center justify-between px-1 pb-1 mt-1">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="relative" ref={menuRef}>
                <button
                    id="tour-model-selector"
                    onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                    className="flex items-center space-x-1.5 hover:bg-gray-100 text-gray-700 py-1.5 px-2.5 rounded-full transition-all border border-gray-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50"
                >
                    <BrandIcon brand="velicia" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <div className="flex flex-col items-start text-left leading-tight pr-0.5">
                        <span className="font-bold text-[10px] whitespace-nowrap">{activeModelLabel}</span>
                    </div>
                    <ChevronUp size={10} className={`text-gray-400 transition-transform duration-200 ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isModelMenuOpen && (
                <div className="absolute bottom-full left-0 mb-3 w-56 md:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-30 origin-bottom-left animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="px-4 py-2 bg-gray-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    Velicia Intelligence Engine
                    </div>
                    {availableModels.map((model) => (
                    <button
                        key={model.id}
                        onClick={() => {
                            onModelChange(model.id);
                            setIsModelMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${selectedModel === model.id ? 'bg-purple-50/50' : ''}`}
                    >
                        <div className="flex items-center gap-2">
                            <BrandIcon brand="velicia" className="w-4 h-4" />
                            <div>
                                <div className="font-bold text-gray-900 leading-none mb-0.5 text-xs">
                                    {model.label}
                                </div>
                                {model.description && <div className="text-[8px] text-gray-400 font-bold uppercase tracking-wide">{model.description}</div>}
                            </div>
                        </div>
                    </button>
                    ))}
                </div>
                )}
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button id="tour-attachments" onClick={handleTriggerFile} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 md:p-2 transition-colors relative" title="Upload File">
              <Paperclip className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2} />
              {attachments.length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <button
              onClick={handleSend}
              disabled={(!text.trim() && attachments.length === 0) || isLoading}
              className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300 ${ (text.trim() || attachments.length > 0) && !isLoading ? 'bg-black text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              {isLoading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ArrowUp className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={3} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
