import React, { useState, useEffect } from 'react';
import { SMSQuery } from '../types';
import { MessageCircle, Clock, CheckCircle, Smartphone, Send, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { askWatchdog } from '../lib/gemini';

export default function QueryFeed() {
  const [queries, setQueries] = useState<SMSQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Local state for "simulating" a new message response if user wants to play with it
  const [testMode, setTestMode] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    fetch('/api/queries')
      .then(res => res.json())
      .then(data => {
        setQueries(data);
        setLoading(false);
      });
  }, []);

  const handleTestQuery = async () => {
    const newQuery: SMSQuery = {
      id: Date.now().toString(),
      sender: "+254712345678",
      message: testMessage,
      timestamp: new Date().toISOString(),
      status: 'pending',
      response: ''
    };
    
    setQueries([newQuery, ...queries]);
    setTestMessage('');

    try {
      const response = await askWatchdog(testMessage);
      setQueries(prev => prev.map(q => 
        q.id === newQuery.id 
          ? { ...q, status: 'responded' as const, response } 
          : q
      ));
    } catch (err) {
      console.error(err);
      setQueries(prev => prev.map(q => 
        q.id === newQuery.id ? { ...q, status: 'error' as const } : q
      ));
    }
  };

  const filteredQueries = queries.filter(q => 
    q.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.sender.includes(searchTerm)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Pane: Query List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Citizen Feedback Loop</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Live SMS Audit Logs from Ward Residents</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
            <input 
              type="text" 
              placeholder="Search by sender/message..."
              className="px-8 pl-9 py-2 text-[11px] border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 w-64 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredQueries.length === 0 ? (
          <div className="card p-12 text-center bg-white border-dashed">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-slate-300" size={24} />
            </div>
            <p className="text-xs text-slate-400 italic">No incoming query packets detected.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {filteredQueries.map(query => (
              <motion.div 
                key={query.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col gap-2"
              >
                <div className="flex flex-col max-w-[85%] self-start">
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-tighter">{query.sender}</span>
                    <span className="text-[9px] text-slate-400 uppercase">{new Date(query.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="bg-slate-100 p-3.5 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm">
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">{query.message}</p>
                  </div>
                </div>

                {query.response && (
                  <div className="flex flex-col max-w-[85%] self-end">
                    <div className="flex items-center gap-2 mb-1 px-1 justify-end">
                      <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">WATCHDOG AI</span>
                      <CheckCircle size={10} className="text-brand-green" />
                    </div>
                    <div className="bg-brand-dark p-3.5 rounded-2xl rounded-br-none shadow-lg">
                      <p className="text-xs font-medium text-slate-100 leading-relaxed italic">
                        "{query.response}"
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Right Pane: Watchdog Simulator */}
      <div className="space-y-6">
        <div className="card bg-brand-dark text-white border-none shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <div className="p-6 relative z-10">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <Smartphone size={16} className="text-brand-green" /> SMS Simulator
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed">
              Stress-test the RAG engine by simulating resident requests via standard SMS protocol.
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 ml-1">Mock Sender UID</label>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-[11px] font-mono text-slate-300">
                  +254 7XX XXX XXX
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5 ml-1">Message Payload</label>
                <textarea 
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-xs font-sans min-h-[120px] focus:outline-none focus:ring-1 focus:ring-brand-green transition-all placeholder:text-slate-600 outline-none"
                  placeholder="e.g. How much was allocated to the ward clinic in Kibera?"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                />
              </div>
              <button 
                onClick={handleTestQuery}
                disabled={!testMessage}
                className={`w-full py-3.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  !testMessage ? 'bg-slate-800 text-slate-600' : 'bg-brand-green text-white hover:bg-emerald-600 shadow-lg shadow-brand-green/20'
                }`}
              >
                <Send size={14} /> Dispatch Signal
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-white shadow-sm">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-brand-green rounded-full shadow-[0_0_5px_rgba(5,150,105,1)]"></div> INFRASTRUCTURE STATUS
          </h4>
          <div className="space-y-4">
            {[
              { label: "Africa's Talking", status: "STANDBY", color: "text-amber-500" },
              { label: "Gemini 1.5 Pro", status: "CONNECTED", color: "text-brand-green" },
              { label: "B-Query Logging", status: "OFFLINE", color: "text-slate-300" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">{stat.label}</span>
                <span className={`text-[10px] font-bold ${stat.color} font-mono tracking-tighter`}>{stat.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
