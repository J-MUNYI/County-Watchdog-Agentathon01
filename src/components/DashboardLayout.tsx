import React from 'react';
import { LayoutDashboard, FileText, MessageSquare, Bell, Upload, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 w-full text-left transition-all duration-200 rounded-lg group ${
      active 
        ? 'bg-slate-900 text-white shadow-md' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    }`}
  >
    <div className={`${active ? 'text-brand-green' : 'text-slate-400 group-hover:text-slate-600'}`}>
      {icon}
    </div>
    <span className="text-[13px] font-semibold tracking-tight leading-none">{label}</span>
  </button>
);

export default function DashboardLayout({ 
  children, 
  activeTab, 
  setActiveTab 
}: { 
  children: React.ReactNode; 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="flex h-screen bg-bg-main text-slate-900 font-sans selection:bg-brand-dark selection:text-white">
      {/* Sidebar - Professional Clean Style */}
      <aside className="w-72 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-brand-green p-1.5 rounded-md shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-slate-900">Watchdog</h1>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Fiscal Accountability Agent</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <NavItem 
            icon={<Sparkles size={18} />} 
            label="Citizen Portal" 
            active={activeTab === 'citizen'} 
            onClick={() => setActiveTab('citizen')} 
          />
          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administration</p>
          </div>
          <NavItem 
            icon={<Upload size={18} />} 
            label="Budget Upload" 
            active={activeTab === 'upload'} 
            onClick={() => setActiveTab('upload')} 
          />
          <NavItem 
            icon={<MessageSquare size={18} />} 
            label="SMS Feed" 
            active={activeTab === 'queries'} 
            onClick={() => setActiveTab('queries')} 
          />
          <NavItem 
            icon={<Bell size={18} />} 
            label="Gazette Tracker" 
            active={activeTab === 'gazette'} 
            onClick={() => setActiveTab('gazette')} 
          />
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse shadow-[0_0_8px_rgba(5,150,105,0.5)]"></div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gemini 1.5 Pro</p>
              <p className="text-[10px] text-slate-400">Status: Active Connection</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white z-10">
          <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-slate-300 rounded-full"></div> Nairobi County</span>
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-slate-300 rounded-full"></div> FY 2025/26</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
               <input 
                 type="text" 
                 placeholder="Search fiscal archives..." 
                 className="bg-slate-50 border border-slate-200 rounded-full px-4 pl-9 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all w-64"
               />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-8 max-w-[1400px] mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
