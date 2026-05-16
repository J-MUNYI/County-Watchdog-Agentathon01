import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function BudgetUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');

  const handleUpload = () => {
    if (!file) return;
    setStatus('uploading');
    
    // Simulating the 2-hour tactical playbook ingestion
    setTimeout(() => {
      setStatus('processing');
      setTimeout(() => {
        setStatus('success');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="card transition-all duration-500">
          <div className="card-header border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Fiscal Data Ingestion</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Upload Official PDF/CSV Budget Estimates</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded border border-emerald-100 uppercase">
              Doc-AI Ready
            </div>
          </div>

          <div className="p-8">
            <div 
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all ${
                file ? 'border-brand-green bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
              }}
            >
              {file ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-lg">
                    <FileText size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{file.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-tighter">{(file.size / (1024 * 1024)).toFixed(2)} MB • READY FOR GEMINI ANALYSIS</p>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="text-[10px] font-bold uppercase text-red-500 hover:text-red-600 transition-colors"
                  >
                    Discard and Select New
                  </button>
                </div>
              ) : (
                <div className="text-center group flex flex-col items-center">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="text-slate-400 group-hover:text-brand-green transition-colors" size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Drag budget dataset here</p>
                  <p className="text-[11px] text-slate-400 mb-6 max-w-xs">Supported formats: PDF, XLSX, CSV. Gemini 1.5 Pro will handle multi-page table structures.</p>
                  <input 
                    type="file" 
                    id="budget-file" 
                    className="hidden" 
                    onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                  />
                  <label 
                    htmlFor="budget-file"
                    className="px-6 py-2.5 bg-white border border-slate-200 text-[11px] font-bold uppercase tracking-widest text-slate-700 rounded-lg shadow-sm hover:shadow-md hover:bg-slate-50 cursor-pointer transition-all"
                  >
                    Select Local Source
                  </label>
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={handleUpload}
                disabled={!file || status !== 'idle'}
                className={`w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg flex items-center justify-center gap-2 shadow-sm ${
                  !file || status !== 'idle' 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-brand-dark text-white hover:bg-slate-800 shadow-brand-dark/20'
                }`}
              >
                {status === 'idle' && 'Begin Cross-Referencing'}
                {status === 'uploading' && <><Loader2 className="animate-spin" size={14} /> Uploading to GCS...</>}
                {status === 'processing' && <><Loader2 className="animate-spin" size={14} /> Gemini Scanning 400+ Pages...</>}
                {status === 'success' && <><CheckCircle2 size={14} className="text-emerald-400" /> Model Ready</>}
              </button>
            </div>
          </div>
        </div>

        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-white border-l-4 border-l-brand-green"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase">Analysis Complete</h3>
                  <p className="text-[10px] text-slate-500">Framework: Nairobi_County_2025_26</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Expenditure", val: "KSh 42.8B" },
                  { label: "Development Fund", val: "KSh 1.2B" },
                  { label: "Primary Sector", val: "Health" },
                  { label: "Detected Items", val: "1,402 Lines" }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-sm font-bold text-slate-900 font-mono">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
