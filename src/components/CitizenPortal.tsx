import React, { useState, useRef, useEffect } from 'react';
import { Send, Smartphone, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { askWatchdog } from '../lib/gemini';

interface LocalMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function CitizenPortal() {
  const [messages, setMessages] = useState<LocalMessage[]>([
    {
      id: '1',
      text: "Hello! I am your County Budget Watchdog. Ask me anything about the Nairobi County 2025/26 budget in plain English, Swahili, or Sheng.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: LocalMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await askWatchdog(input);
      const aiMsg: LocalMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'err',
        text: "I'm having trouble connecting to the fiscal database. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Citizen Portal</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Direct AI query line for Nairobi County residents</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm text-[10px] font-bold text-slate-500">
             <Smartphone size={12} className="text-brand-green" /> SMS SIMULATOR
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <Sparkles className="text-brand-green" size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-none">Fiscal Watchdog AI</p>
            <p className="text-[10px] text-brand-green font-bold uppercase tracking-wider mt-1">Nairobi Budget 2025/26 Indexed</p>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar z-10"
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-brand-dark text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200/50'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 z-10">
          <div className="flex gap-2 max-w-3xl mx-auto relative">
             <input 
               type="text" 
               placeholder="Ask e.g. 'How much for schools in Kibra?'..."
               className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-all shadow-sm pr-16"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
             />
             <button 
               onClick={handleSend}
               disabled={!input.trim() || isTyping}
               className={`absolute right-2 top-2 bottom-2 w-12 rounded-xl flex items-center justify-center transition-all ${
                 !input.trim() || isTyping ? 'bg-slate-100 text-slate-300' : 'bg-brand-green text-white shadow-lg shadow-brand-green/20 hover:scale-105 active:scale-95'
               }`}
             >
               <Send size={18} />
             </button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-6">
             <div className="flex items-center gap-1.5">
               <ShieldCheck size={12} className="text-brand-green" />
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Database</span>
             </div>
             <div className="flex items-center gap-1.5">
               <HelpCircle size={12} className="text-slate-400" />
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest underline cursor-pointer">Sample Questions</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
