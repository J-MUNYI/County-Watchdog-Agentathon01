import React, { useState, useEffect } from 'react';
import { GazetteNotice } from '../types';
import { Bell, Newspaper, ExternalLink, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function GazetteMonitor() {
  const [notices, setNotices] = useState<GazetteNotice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gazette')
      .then(res => res.json())
      .then(data => {
        setNotices(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Gazette Watcher</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Automated scanning of the <span className="font-bold text-slate-700 underline decoration-slate-300">Kenya Law Gazette</span> RSS feed.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-brand-green text-[10px] font-bold uppercase rounded border border-emerald-100 shadow-sm">
          <Bell size={12} className="animate-bounce" /> Sentinel Mode Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notices.map((notice) => (
          <motion.div 
            key={notice.id}
            whileHover={{ y: -4 }}
            className={`card p-6 relative overflow-hidden transition-all bg-white ${
              notice.isBudgetRelated ? 'border-amber-200' : ''
            }`}
          >
            {notice.isBudgetRelated && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold uppercase px-3 py-1 tracking-tighter">
                Fiscally Relevant
              </div>
            )}
            
            <div className="flex items-start gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex-shrink-0">
                <Newspaper size={24} className="text-slate-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">{notice.date}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-tight mb-2">{notice.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {notice.summary}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <button className="text-[10px] font-bold uppercase flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                    Access Source PDF <ExternalLink size={12} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-brand-green" />
                    <span className="text-[10px] font-bold uppercase text-brand-green">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card p-8 text-center bg-slate-900 border-none shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-green/20 via-transparent to-transparent"></div>
        <div className="relative z-10">
          <h4 className="font-bold text-white text-base mb-2 uppercase tracking-widest">Identify New Amendments</h4>
          <p className="text-slate-400 text-[11px] font-medium mb-6 uppercase tracking-wider">Manual submission gate for AI structural auditing</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. kenyalaw.org/gazette/..."
              className="flex-1 bg-slate-800 border border-slate-700/50 rounded-lg px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-green transition-all outline-none"
            />
            <button className="bg-brand-green text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-brand-green/20 hover:bg-emerald-600 transition-all">Audit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
