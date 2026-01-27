
import React, { useState } from 'react';
import { Layout, Sparkles, Image as ImageIcon, Search, ChevronRight, X, Layers, BrainCircuit } from 'lucide-react';
import { PresentationConfig, ModelOption, ModelType } from '../types';

interface PresentationSetupProps {
  onClose: () => void;
  onGenerate: (config: PresentationConfig) => void;
  availableModels: ModelOption[];
}

const PresentationSetup: React.FC<PresentationSetupProps> = ({ onClose, onGenerate, availableModels }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [topic, setTopic] = useState('');
  const [cardCount, setCardCount] = useState(6);
  const [selectedModel, setSelectedModel] = useState<string>(ModelType.GEMINI_3_PRO); // Default to a smart model
  const [imageSource, setImageSource] = useState<'ai_generated' | 'google_search'>('ai_generated');

  const textModels = availableModels.filter(m => m.category === 'text');

  const handleNext = () => {
    if (topic.trim().length > 0) {
      setStep(2);
    }
  };

  const handleFinalize = () => {
    onGenerate({
      topic,
      cardCount,
      modelId: selectedModel,
      imageSource,
      language: 'Indonesian' // Bisa dibuat dinamis nanti
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/50 relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <div className="flex items-center gap-2">
              <div className="p-1.5 bg-pink-100 rounded-lg text-pink-600">
                <Layout size={18} />
              </div>
              <span className="font-bold text-gray-800">Buat Presentasi Baru</span>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
             <X size={20} />
           </button>
        </div>

        <div className="p-8">
            {step === 1 ? (
                // STEP 1: TOPIC
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                    <div className="text-center space-y-2 mb-8">
                        <h2 className="text-2xl font-black text-gray-900">Apa yang ingin Anda presentasikan?</h2>
                        <p className="text-gray-500">Jelaskan topik Anda, dan AI akan membuatkan strukturnya.</p>
                    </div>

                    <div className="relative">
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Contoh: Strategi Pemasaran Digital untuk UMKM di tahun 2025..."
                            className="w-full h-32 p-4 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-gray-400"
                            autoFocus
                        />
                        <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium">
                            {topic.length} karakter
                        </div>
                    </div>

                    <button 
                        onClick={handleNext}
                        disabled={!topic.trim()}
                        className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                    >
                        Lanjut <ChevronRight size={20} />
                    </button>
                </div>
            ) : (
                // STEP 2: CONFIGURATION
                <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <div className="flex items-center gap-3 mb-2">
                        <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-400 hover:text-gray-600">Topik</button>
                        <ChevronRight size={14} className="text-gray-300"/>
                        <span className="text-sm font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">Pengaturan</span>
                    </div>

                    {/* Card Count Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-bold text-gray-800 flex items-center gap-2">
                                <Layers size={16} className="text-purple-500"/> Jumlah Kartu
                            </label>
                            <span className="text-2xl font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">{cardCount}</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            value={cardCount} 
                            onChange={(e) => setCardCount(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-medium">
                            <span>1 Kartu</span>
                            <span>10 Kartu (Maks)</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Model Selection */}
                        <div className="space-y-3">
                            <label className="font-bold text-gray-800 flex items-center gap-2">
                                <BrainCircuit size={16} className="text-blue-500"/> Model AI
                            </label>
                            <div className="relative">
                                <select 
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 appearance-none font-medium text-gray-700"
                                >
                                    {textModels.map(m => (
                                        <option key={m.id} value={m.id}>{m.label} ({m.brand})</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <ChevronRight size={16} className="rotate-90" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">Model 'Pro' direkomendasikan untuk konten yang lebih mendalam.</p>
                        </div>

                        {/* Image Source */}
                        <div className="space-y-3">
                            <label className="font-bold text-gray-800 flex items-center gap-2">
                                <ImageIcon size={16} className="text-pink-500"/> Sumber Gambar
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => setImageSource('ai_generated')}
                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${imageSource === 'ai_generated' ? 'border-pink-500 bg-pink-50 text-pink-700 ring-1 ring-pink-500' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                >
                                    <Sparkles size={20} />
                                    <span className="text-xs font-bold">AI Generated</span>
                                </button>
                                <button 
                                    onClick={() => setImageSource('google_search')}
                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${imageSource === 'google_search' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                >
                                    <Search size={20} />
                                    <span className="text-xs font-bold">Google Search</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleFinalize}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-pink-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        <Sparkles size={20} fill="white" />
                        Generate Presentation
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PresentationSetup;
    