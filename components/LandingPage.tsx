
import React, { useState } from 'react';
import { 
  Sparkles, MessageSquare, Search, PenTool, Image as ImageIcon, 
  FileText, Globe, Zap, ArrowRight, Check, Play, Menu, X, 
  Bot, Layers, BrainCircuit, Share2, MousePointer2, ChevronDown
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  initialScrollTo?: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'search' | 'write'>('chat');

  // --- MOCK DATA ---
  const models = [
    { name: 'Gemini Pro', icon: 'https://img.icons8.com/?size=100&id=iBkBIBWE6tfT&format=png&color=000000' },
    { name: 'GPT-4o', icon: 'https://img.icons8.com/?size=100&id=FBO05Dys9QCg&format=png&color=000000' },
    { name: 'Claude 3', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/1024px-Anthropic_logo.svg.png' }, // Generic placeholder if needed, using generic icon in code
    { name: 'Mistral', icon: 'M' }
  ];

  const features = [
    {
      title: "Chat & Ask",
      desc: "Chat with advanced AI models like Gemini 3.0 and GPT-4o. Get answers, write code, and solve problems.",
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50"
    },
    {
      title: "AI Search",
      desc: "Real-time web search capability. Get up-to-date information with cited sources directly in your chat.",
      icon: <Search className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50"
    },
    {
      title: "Copywriting",
      desc: "Generate high-quality essays, blogs, emails, and marketing copy in seconds.",
      icon: <PenTool className="w-6 h-6 text-green-600" />,
      bg: "bg-green-50"
    },
    {
      title: "Image Gen",
      desc: "Turn text into stunning visuals using Flux and Gemini Vision models.",
      icon: <ImageIcon className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-50"
    },
    {
      title: "Summarize",
      desc: "Summarize long articles, PDFs, and web pages into concise bullet points.",
      icon: <FileText className="w-6 h-6 text-red-600" />,
      bg: "bg-red-50"
    },
    {
      title: "Translate",
      desc: "Accurate translation across 90+ languages with cultural context awareness.",
      icon: <Globe className="w-6 h-6 text-cyan-600" />,
      bg: "bg-cyan-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-9 h-9 bg-gradient-to-br from-[#7C3AED] to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-purple-200">
              <Sparkles size={20} fill="white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">Velicia</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8 font-medium text-[15px] text-gray-600">
             <div className="group relative cursor-pointer h-[72px] flex items-center hover:text-purple-600 transition-colors">
                <span>Features</span>
                <ChevronDown size={14} className="ml-1 opacity-50 group-hover:rotate-180 transition-transform"/>
                {/* Dropdown would go here */}
             </div>
             <a href="#models" className="hover:text-purple-600 transition-colors">AI Models</a>
             <a href="#usecases" className="hover:text-purple-600 transition-colors">Use Cases</a>
             <a href="#pricing" className="hover:text-purple-600 transition-colors">Pricing</a>
          </div>

          {/* Buttons */}
          <div className="hidden lg:flex items-center gap-3">
             <button className="text-[15px] font-bold text-gray-600 hover:text-purple-700 px-4 py-2 transition-colors">
               Log in
             </button>
             <button 
                onClick={onEnterApp} 
                className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full text-[15px] font-bold transition-all shadow-lg shadow-purple-200 hover:-translate-y-0.5 active:translate-y-0"
             >
               Get Started - It's Free
             </button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
           <div className="lg:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-6 shadow-2xl absolute w-full h-screen">
               <a href="#features" className="text-lg font-bold text-gray-800" onClick={() => setMobileMenuOpen(false)}>Features</a>
               <a href="#models" className="text-lg font-bold text-gray-800" onClick={() => setMobileMenuOpen(false)}>AI Models</a>
               <a href="#pricing" className="text-lg font-bold text-gray-800" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
               <hr className="border-gray-100"/>
               <button className="w-full py-3 text-gray-600 font-bold border border-gray-200 rounded-xl">Log in</button>
               <button onClick={onEnterApp} className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold shadow-lg">Get Started Free</button>
           </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-purple-100/50 to-transparent rounded-[100%] blur-[80px] -z-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center animate-in slide-in-from-bottom-8 duration-700">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 border border-purple-100 rounded-full mb-8 cursor-pointer hover:bg-purple-100 transition-colors">
             <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-pulse"></span>
             <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">New: Gemini 3.0 Pro Available</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
             Your All-in-One <br className="hidden md:block"/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-pink-500">AI Personal Assistant</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
             Chat, Search, Write, Translate & Create Images with Velicia. 
             Powered by GPT-4, Gemini 3.0, and Claude 3.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
             <button 
               onClick={onEnterApp}
               className="h-14 px-8 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full font-bold text-lg shadow-xl shadow-purple-200 transition-all hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center"
             >
               <MessageSquare size={20} className="fill-white/20" />
               Chat with Velicia
             </button>
             <button className="h-14 px-8 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-full font-bold text-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
               <Play size={18} className="fill-gray-800" />
               Watch Demo
             </button>
          </div>

          {/* HERO IMAGE / MOCKUP */}
          <div className="relative max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-gray-200 to-white border border-gray-200 shadow-2xl">
             <div className="bg-[#FAFAFA] rounded-xl overflow-hidden aspect-[16/10] relative flex">
                 {/* Sidebar Mock */}
                 <div className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col p-4 gap-4">
                     <div className="flex items-center gap-2 px-2 opacity-50"><div className="w-6 h-6 bg-purple-200 rounded-md"></div><div className="h-3 w-20 bg-gray-200 rounded"></div></div>
                     <div className="space-y-2 mt-4">
                         {[1,2,3,4].map(i => <div key={i} className="h-8 w-full bg-gray-100 rounded-lg"></div>)}
                     </div>
                 </div>
                 {/* Main Content Mock */}
                 <div className="flex-1 flex flex-col bg-white">
                     <div className="h-14 border-b border-gray-100 flex items-center px-6 justify-between">
                         <div className="flex gap-2">
                            <div className="h-8 w-24 bg-gray-100 rounded-lg"></div>
                         </div>
                     </div>
                     <div className="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
                         <div className="flex gap-4">
                             <div className="w-10 h-10 rounded-xl bg-purple-100 shrink-0"></div>
                             <div className="space-y-2 max-w-lg">
                                 <div className="h-4 w-full bg-gray-100 rounded"></div>
                                 <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                             </div>
                         </div>
                         <div className="flex gap-4 flex-row-reverse">
                             <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0"></div>
                             <div className="bg-purple-50 p-4 rounded-2xl rounded-tr-none max-w-lg">
                                 <p className="text-sm text-gray-600 font-medium">Hello! I am Velicia. How can I help you today? I can analyze data, generate images, or write code for you.</p>
                             </div>
                         </div>
                         {/* Floating Elements on top of mockup */}
                         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200 shadow-xl">
                             <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><img src="https://img.icons8.com/?size=100&id=FBO05Dys9QCg&format=png&color=000000" className="w-5"/></div>
                             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><img src="https://img.icons8.com/?size=100&id=iBkBIBWE6tfT&format=png&color=000000" className="w-5"/></div>
                             <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><Bot size={18} className="text-orange-600"/></div>
                             <span className="px-3 text-xs font-bold text-gray-500">All models included</span>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- TRUST BADGE --- */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-6 text-center">
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Trusted by 1M+ Users from companies like</p>
             <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale">
                 <span className="text-xl font-black text-gray-900 flex items-center gap-2"><div className="w-6 h-6 bg-gray-800 rounded-full"></div>Google</span>
                 <span className="text-xl font-black text-gray-900 flex items-center gap-2"><div className="w-6 h-6 bg-gray-800 rounded-full"></div>Meta</span>
                 <span className="text-xl font-black text-gray-900 flex items-center gap-2"><div className="w-6 h-6 bg-gray-800 rounded-full"></div>Amazon</span>
                 <span className="text-xl font-black text-gray-900 flex items-center gap-2"><div className="w-6 h-6 bg-gray-800 rounded-full"></div>Netflix</span>
                 <span className="text-xl font-black text-gray-900 flex items-center gap-2"><div className="w-6 h-6 bg-gray-800 rounded-full"></div>Uber</span>
             </div>
         </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">One Agent, Infinite Possibilities</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Velicia brings together the most powerful AI models and tools into a single, easy-to-use interface.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
               <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                   <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                       {f.icon}
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                   <p className="text-gray-500 leading-relaxed">{f.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* --- SHOWCASE SECTION (TABBED) --- */}
      <section id="usecases" className="py-24 px-6 bg-gray-50 border-y border-gray-100">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Whatever you need, just ask.</h2>
                    <p className="text-gray-500 text-lg">Switch between modes to get the best results.</p>
                </div>
                
                <div className="flex p-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                    {(['chat', 'search', 'write'] as const).map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                           {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden min-h-[500px] flex flex-col md:flex-row">
                 {/* Left Content */}
                 <div className="p-10 md:p-14 md:w-1/2 flex flex-col justify-center">
                     <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-8">
                         {activeTab === 'chat' && <MessageSquare size={32}/>}
                         {activeTab === 'search' && <Search size={32}/>}
                         {activeTab === 'write' && <PenTool size={32}/>}
                     </div>
                     
                     <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {activeTab === 'chat' && "Chat with Top AI Models"}
                        {activeTab === 'search' && "Your AI Copilot for the Web"}
                        {activeTab === 'write' && "Write Better, Faster"}
                     </h3>
                     <p className="text-gray-500 text-lg leading-relaxed mb-8">
                        {activeTab === 'chat' && "Access Gemini 3.0, GPT-4o, and Claude 3 in one place. Switch models instantly to find the best reasoning for your task."}
                        {activeTab === 'search' && "Stop clicking through links. Velicia browses the web, reads multiple sources, and synthesizes a direct answer with citations."}
                        {activeTab === 'write' && "From emails to essays, Velicia helps you draft, edit, and polish your writing. Choose tone, length, and format effortlessly."}
                     </p>
                     
                     <button onClick={onEnterApp} className="flex items-center gap-2 text-purple-600 font-bold hover:gap-3 transition-all group">
                         Try {activeTab} mode now <ArrowRight size={18}/>
                     </button>
                 </div>

                 {/* Right Visual */}
                 <div className="md:w-1/2 bg-gray-50 border-l border-gray-100 relative overflow-hidden flex items-center justify-center p-8">
                      {/* Abstract Visual Representation */}
                      <div className="relative w-full max-w-sm aspect-[4/5] bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 flex flex-col gap-4 transform rotate-3 transition-transform hover:rotate-0">
                           <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-pink-500 flex items-center justify-center text-white"><Sparkles size={16}/></div>
                               <div>
                                   <div className="text-sm font-bold text-gray-900">Velicia</div>
                                   <div className="text-xs text-gray-400">AI Assistant</div>
                               </div>
                           </div>
                           <div className="bg-gray-50 p-4 rounded-xl rounded-tl-none text-sm text-gray-600 leading-relaxed">
                               {activeTab === 'chat' && "Certainly! Here is the Python code to visualize the stock data using Matplotlib..."}
                               {activeTab === 'search' && "According to the latest reports from 2024, the global AI market has grown by 35%..."}
                               {activeTab === 'write' && "Subject: Proposal for Q4 Marketing Strategy\n\nDear Team,\n\nI'm excited to present our new direction..."}
                           </div>
                           <div className="mt-auto h-24 bg-gray-100 rounded-xl animate-pulse"></div>
                      </div>
                 </div>
            </div>
         </div>
      </section>

      {/* --- MODELS SHOWCASE --- */}
      <section id="models" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div className="order-2 md:order-1 relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-[100px] opacity-50"></div>
                 <div className="relative bg-white rounded-[32px] border border-gray-200 shadow-2xl p-8">
                     <div className="space-y-4">
                         {models.map((m, i) => (
                             <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer group">
                                 <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden">
                                        {m.icon.length > 5 ? <img src={m.icon} className="w-6 h-6 object-contain"/> : <span className="font-bold">{m.icon}</span>}
                                     </div>
                                     <span className="font-bold text-gray-900 text-lg">{m.name}</span>
                                 </div>
                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'border-purple-600 bg-purple-600' : 'border-gray-300'}`}>
                                     {i === 0 && <Check size={12} className="text-white"/>}
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
             
             <div className="order-1 md:order-2">
                 <h2 className="text-4xl font-black text-gray-900 mb-6">Chat with any model you like.</h2>
                 <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                     Why subscribe to multiple services? Velicia gives you access to the world's best LLMs in a single subscription. 
                     Compare answers, switch models for different tasks, and enjoy the best of AI.
                 </p>
                 <ul className="space-y-4 mb-10">
                     <li className="flex items-center gap-3 text-gray-700 font-medium">
                         <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Check size={14} strokeWidth={3}/></div>
                         Gemini 3.0 Pro & Flash
                     </li>
                     <li className="flex items-center gap-3 text-gray-700 font-medium">
                         <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Check size={14} strokeWidth={3}/></div>
                         GPT-4o & GPT-4 Turbo
                     </li>
                     <li className="flex items-center gap-3 text-gray-700 font-medium">
                         <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Check size={14} strokeWidth={3}/></div>
                         Claude 3 Opus & Sonnet
                     </li>
                 </ul>
                 <button onClick={onEnterApp} className="px-8 py-3 bg-black text-white rounded-full font-bold shadow-lg hover:bg-gray-800 transition-colors">
                     Start Chatting
                 </button>
             </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
              <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-purple-600 rounded-lg flex items-center justify-center text-white">
                          <Sparkles size={16} fill="white" />
                      </div>
                      <span className="text-xl font-bold text-gray-900">Velicia</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
                      Your all-in-one AI assistant for chatting, searching, writing, and translating.
                  </p>
                  <div className="flex gap-4 text-gray-400">
                      {/* Social Icons Placeholder */}
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors cursor-pointer"><Share2 size={16}/></div>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors cursor-pointer"><Globe size={16}/></div>
                  </div>
              </div>
              
              <div>
                  <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                  <ul className="space-y-3 text-sm text-gray-500">
                      <li className="hover:text-purple-600 cursor-pointer">Chat</li>
                      <li className="hover:text-purple-600 cursor-pointer">Search</li>
                      <li className="hover:text-purple-600 cursor-pointer">Writing</li>
                      <li className="hover:text-purple-600 cursor-pointer">Image Gen</li>
                  </ul>
              </div>
              
              <div>
                  <h4 className="font-bold text-gray-900 mb-6">Resources</h4>
                  <ul className="space-y-3 text-sm text-gray-500">
                      <li className="hover:text-purple-600 cursor-pointer">Blog</li>
                      <li className="hover:text-purple-600 cursor-pointer">Help Center</li>
                      <li className="hover:text-purple-600 cursor-pointer">Prompt Library</li>
                      <li className="hover:text-purple-600 cursor-pointer">API</li>
                  </ul>
              </div>

              <div>
                  <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                  <ul className="space-y-3 text-sm text-gray-500">
                      <li className="hover:text-purple-600 cursor-pointer">About</li>
                      <li className="hover:text-purple-600 cursor-pointer">Pricing</li>
                      <li className="hover:text-purple-600 cursor-pointer">Contact</li>
                      <li className="hover:text-purple-600 cursor-pointer">Terms</li>
                  </ul>
              </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <p>&copy; 2024 Velicia AI. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                  <span className="hover:text-gray-900 cursor-pointer">Privacy Policy</span>
                  <span className="hover:text-gray-900 cursor-pointer">Terms of Service</span>
              </div>
          </div>
      </footer>

    </div>
  );
};

export default LandingPage;
