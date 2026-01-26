
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Mic2, Layout, Image as ImageIcon, Search, Download, Share2 } from 'lucide-react';
import { PresentationData, Slide, SlideLayout } from '../types';
import { generatePresentationImage } from '../services/geminiService';

interface PresentationViewerProps {
  data: PresentationData;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({ data }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slides, setSlides] = useState<Slide[]>(data.slides);

  // Generate Image when component mounts if source is AI
  useEffect(() => {
    if (data.config.imageSource === 'ai_generated') {
        generateImagesForSlides();
    }
  }, [data]);

  const generateImagesForSlides = async () => {
    const newSlides = [...slides];
    const promises = newSlides.map(async (slide, index) => {
        // Only generate if no image yet and has a prompt
        if (!slide.imageUrl && slide.visualDescription) {
            setSlides(prev => {
                const updated = [...prev];
                updated[index] = { ...updated[index], imageStatus: 'loading' };
                return updated;
            });
            try {
                const url = await generatePresentationImage(slide.visualDescription);
                setSlides(prev => {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], imageUrl: url, imageStatus: 'generated' };
                    return updated;
                });
            } catch (e) {
                setSlides(prev => {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], imageStatus: 'failed' };
                    return updated;
                });
            }
        }
    });
  };

  const handleNext = () => { if (currentSlideIndex < slides.length - 1) setCurrentSlideIndex(prev => prev + 1); };
  const handlePrev = () => { if (currentSlideIndex > 0) setCurrentSlideIndex(prev => prev - 1); };
  const currentSlide = slides[currentSlideIndex];

  // --- THEME ENGINE ---
  // Maps JSON 'theme' string to Tailwind classes
  const themes = {
    modern_dark: {
      bg: "bg-[#111111]",
      text: "text-white",
      accent: "text-purple-400",
      accentBg: "bg-purple-500",
      border: "border-gray-800",
      gradient: "bg-gradient-to-br from-[#1a1a1a] to-[#000000]",
      font: "font-sans",
      overlay: "bg-black/40"
    },
    neon_glass: {
      bg: "bg-gray-900",
      text: "text-white",
      accent: "text-cyan-400",
      accentBg: "bg-cyan-500",
      border: "border-white/10",
      gradient: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900",
      font: "font-sans tracking-wide",
      overlay: "bg-black/20"
    },
    minimal_light: {
      bg: "bg-white",
      text: "text-gray-900",
      accent: "text-black",
      accentBg: "bg-black",
      border: "border-gray-100",
      gradient: "bg-[#FAFAFA]",
      font: "font-serif",
      overlay: "bg-white/40"
    },
    professional_blue: {
      bg: "bg-slate-50",
      text: "text-slate-900",
      accent: "text-blue-600",
      accentBg: "bg-blue-600",
      border: "border-slate-200",
      gradient: "bg-gradient-to-br from-white to-blue-50",
      font: "font-sans",
      overlay: "bg-white/40"
    }
  };

  const theme = themes[data.theme as keyof typeof themes] || themes.modern_dark;

  // --- LAYOUT RENDERERS ---
  
  const renderImage = (slide: Slide, className: string = "") => {
    if (data.config.imageSource === 'ai_generated') {
        if (slide.imageStatus === 'loading') {
            return (
                <div className={`flex flex-col items-center justify-center bg-black/5 rounded-2xl ${className} backdrop-blur-sm`}>
                    <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin opacity-50 mb-2"></div>
                    <span className="text-xs font-medium opacity-50">Rendering Visuals...</span>
                </div>
            );
        }
        if (slide.imageUrl) {
            return <img src={slide.imageUrl} alt="Slide visual" className={`object-cover w-full h-full rounded-2xl shadow-lg transition-transform duration-1000 hover:scale-[1.02] ${className}`} />;
        }
        return <div className={`bg-gray-100 rounded-2xl flex items-center justify-center ${className}`}><ImageIcon className="opacity-20" size={32}/></div>;
    } 
    // Google Search Fallback UI
    return (
         <div className={`flex flex-col items-center justify-center bg-gray-100/50 rounded-2xl border border-dashed border-gray-300 p-4 text-center ${className}`}>
             <p className="text-xs text-gray-500 mb-2 line-clamp-2">{slide.searchQuery}</p>
             <a href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(slide.searchQuery || "")}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-white border rounded-full text-xs font-bold shadow-sm hover:bg-gray-50">Search Image</a>
         </div>
    );
  };

  // The Core Template Engine
  const LayoutRenderer = ({ slide }: { slide: Slide }) => {
    switch (slide.layout) {
        
        // 1. Title Modern (For Start Slide)
        case 'title_modern':
            return (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                     {/* Background Image Effect */}
                     {slide.imageUrl && (
                         <div className="absolute inset-0 opacity-30 blur-sm scale-110">
                             <img src={slide.imageUrl} className="w-full h-full object-cover" />
                             <div className={`absolute inset-0 bg-gradient-to-t from-${theme.bg.split('-')[1]} via-transparent to-transparent`}></div>
                         </div>
                     )}
                     <div className="relative z-10 max-w-3xl animate-in slide-in-from-bottom-8 duration-700">
                         <div className={`inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase border rounded-full ${theme.accent} border-current opacity-70`}>
                             {data.config.topic}
                         </div>
                         <h1 className={`text-4xl md:text-6xl font-black mb-6 leading-tight ${theme.text} drop-shadow-xl`}>
                             {slide.title}
                         </h1>
                         {slide.subtitle && (
                             <p className={`text-lg md:text-2xl font-light opacity-80 ${theme.text}`}>
                                 {slide.subtitle}
                             </p>
                         )}
                         <div className={`mt-8 w-24 h-1 mx-auto ${theme.accentBg}`}></div>
                     </div>
                </div>
            );
        
        // 2. Image Focus (Impact Slide)
        case 'image_focus':
             return (
                 <div className="h-full relative rounded-2xl overflow-hidden group">
                     {renderImage(slide, "absolute inset-0 w-full h-full object-cover")}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
                         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md transform translate-y-0 transition-transform group-hover:-translate-y-2">
                             {slide.title}
                         </h2>
                         <div className="space-y-2 max-w-2xl">
                             {slide.content.map((point, i) => (
                                 <p key={i} className="text-white/90 text-lg font-medium border-l-4 border-white/50 pl-4">{point}</p>
                             ))}
                         </div>
                     </div>
                 </div>
             );

        // 3. Big Number (Statistics Slide)
        case 'big_number':
            return (
                <div className="h-full flex flex-col md:flex-row items-center gap-8 p-8">
                    <div className="flex-1 space-y-6">
                        <h2 className={`text-3xl font-bold ${theme.text}`}>{slide.title}</h2>
                        <ul className="space-y-4">
                            {slide.content.map((p, i) => (
                                <li key={i} className={`flex items-start gap-3 text-lg opacity-80 ${theme.text}`}>
                                    <span className={`mt-2 w-1.5 h-1.5 rounded-full ${theme.accentBg}`}></span>
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={`flex-1 flex items-center justify-center aspect-square rounded-3xl ${theme.bg} border ${theme.border} relative overflow-hidden shadow-2xl`}>
                        {slide.imageUrl && <img src={slide.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />}
                        <div className="relative z-10 text-center animate-in zoom-in duration-500">
                            <span className={`text-8xl font-black ${theme.accent} tracking-tighter`}>
                                {slide.highlightMetric || "100%"}
                            </span>
                            {slide.subtitle && <p className={`mt-2 font-bold uppercase tracking-widest opacity-60 ${theme.text}`}>{slide.subtitle}</p>}
                        </div>
                    </div>
                </div>
            );
        
        // 4. Features Grid (List Slide)
        case 'features_grid':
            return (
                <div className="h-full flex flex-col p-8">
                     <div className="text-center mb-8">
                        <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>{slide.title}</h2>
                        <div className={`h-1 w-20 mx-auto rounded-full ${theme.accentBg}`}></div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 flex-1">
                         {slide.content.map((item, i) => (
                             <div key={i} className={`p-4 rounded-xl border ${theme.border} bg-white/5 backdrop-blur-sm flex flex-col justify-center hover:bg-white/10 transition-colors`}>
                                 <div className={`w-8 h-8 rounded-full ${theme.accentBg} flex items-center justify-center text-white font-bold text-sm mb-2`}>{i+1}</div>
                                 <p className={`font-medium ${theme.text}`}>{item}</p>
                             </div>
                         ))}
                         {slide.imageUrl && (
                             <div className="col-span-2 row-span-1 md:col-span-1 md:row-span-2 rounded-xl overflow-hidden relative min-h-[100px]">
                                 {renderImage(slide, "absolute inset-0")}
                             </div>
                         )}
                     </div>
                </div>
            );

        // 5. Two Column (Standard Slide)
        case 'two_column':
        default:
            return (
                <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8">
                    <div className="order-2 md:order-1 flex flex-col justify-center h-full">
                        <h2 className={`text-3xl font-bold mb-6 ${theme.text} leading-tight`}>{slide.title}</h2>
                        <ul className="space-y-4">
                            {slide.content.map((point, idx) => (
                                <li key={idx} className={`flex items-start gap-3 text-lg leading-relaxed opacity-90 ${theme.text}`}>
                                    <span className={`mt-2 w-2 h-2 rounded-full shrink-0 ${theme.accentBg}`}></span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 h-[250px] md:h-full w-full rounded-2xl overflow-hidden shadow-lg relative">
                        {renderImage(slide, "absolute inset-0")}
                    </div>
                </div>
            );
    }
  };

  return (
    <div className={`flex flex-col w-full my-6 transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100] bg-black p-0' : 'max-w-5xl mx-auto'}`}>
      
      {/* Fullscreen Header */}
      {isFullscreen && (
          <div className="absolute top-0 left-0 right-0 p-4 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
              <span className="text-white font-bold tracking-wider opacity-80">{data.config.topic}</span>
              <button onClick={() => setIsFullscreen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white"><X size={20}/></button>
          </div>
      )}

      {/* Main Stage */}
      <div className={`relative w-full aspect-video ${!isFullscreen && 'rounded-3xl shadow-2xl'} overflow-hidden transition-all duration-500 ${theme.bg} ${theme.gradient} border ${!isFullscreen ? theme.border : 'border-none'}`}>
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-gradient-to-b from-white/5 to-transparent blur-3xl rounded-full mix-blend-overlay pointer-events-none"></div>
          
          <div className="w-full h-full relative z-10">
              <LayoutRenderer slide={currentSlide} />
          </div>

          {/* Navigation Overlay (Visible on Hover) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button onClick={handlePrev} disabled={currentSlideIndex === 0} className="pointer-events-auto p-3 rounded-full bg-black/10 hover:bg-black/20 text-current backdrop-blur-sm transition-all disabled:opacity-0">
                  <ChevronLeft size={32} />
              </button>
              <button onClick={handleNext} disabled={currentSlideIndex === slides.length - 1} className="pointer-events-auto p-3 rounded-full bg-black/10 hover:bg-black/20 text-current backdrop-blur-sm transition-all disabled:opacity-0">
                  <ChevronRight size={32} />
              </button>
          </div>
          
          {/* Slide Counter Badge */}
          <div className="absolute bottom-6 right-6 px-3 py-1 rounded-full bg-black/10 backdrop-blur-md text-xs font-mono font-bold opacity-60">
              {currentSlideIndex + 1} / {slides.length}
          </div>
      </div>

      {/* Control Bar (Only when not fullscreen) */}
      {!isFullscreen && (
          <div className="mt-4 flex items-center justify-between bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
             <div className="flex items-center gap-2">
                 <button onClick={() => setShowSpeakerNotes(!showSpeakerNotes)} className={`p-2 rounded-xl transition-colors ${showSpeakerNotes ? 'bg-pink-50 text-pink-600' : 'hover:bg-gray-50 text-gray-500'}`} title="Notes">
                     <Mic2 size={18} />
                 </button>
                 <div className="h-6 w-px bg-gray-200 mx-1"></div>
                 {/* Progress Bar */}
                 <div className="flex gap-1">
                     {slides.map((_, idx) => (
                         <div 
                            key={idx} 
                            onClick={() => setCurrentSlideIndex(idx)}
                            className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${currentSlideIndex === idx ? `w-8 ${theme.accentBg}` : 'w-4 bg-gray-200 hover:bg-gray-300'}`}
                         ></div>
                     ))}
                 </div>
             </div>
             
             <div className="flex items-center gap-2">
                 <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 flex items-center gap-2 text-xs font-bold">
                     <Download size={16} /> <span className="hidden sm:inline">Export PDF</span>
                 </button>
                 <button onClick={() => setIsFullscreen(true)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-500" title="Fullscreen">
                     <Maximize2 size={18} />
                 </button>
             </div>
          </div>
      )}

      {/* Speaker Notes */}
      {showSpeakerNotes && !isFullscreen && (
          <div className="mt-2 bg-yellow-50/80 border border-yellow-200 p-4 rounded-xl text-yellow-900 text-sm animate-in slide-in-from-top-2">
              <span className="font-bold uppercase text-[10px] tracking-wider opacity-60 block mb-1">Speaker Notes</span>
              {currentSlide.speakerNotes || "No notes."}
          </div>
      )}
    </div>
  );
};

export default PresentationViewer;
