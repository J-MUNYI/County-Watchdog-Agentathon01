import React from 'react';
import { BarChart3, Users, PieChart, Info, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Queries Logged", val: "1,284", icon: <MessageCircle size={18} />, trend: "+12% this week", positive: true },
          { label: "Wards Tracked", val: "85", icon: <PieChart size={18} />, trend: "100% saturation", positive: true },
          { label: "Budget Accuracy", val: "99.2%", icon: <TrendingUp size={18} />, trend: "Gemini 1.5 Verified", positive: true },
          { label: "Active Amendments", val: "3", icon: <AlertTriangle size={18} />, trend: "Requires Audit", positive: false }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider font-sans">{stat.label}</span>
              <div className="text-slate-400">{stat.icon}</div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{stat.val}</span>
            </div>
            <div className={`text-[10px] font-bold mt-2 flex items-center gap-1 ${stat.positive ? 'text-brand-green' : 'text-amber-600'}`}>
              <div className={`w-1 h-1 rounded-full ${stat.positive ? 'bg-brand-green' : 'bg-amber-600'}`}></div>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 font-sans uppercase tracking-tight">Allocation Breakdown</h3>
            <div className="flex bg-slate-100 p-1 rounded-md">
              <button className="px-3 py-1 bg-white text-[10px] font-bold text-slate-900 rounded shadow-sm">YEAR</button>
              <button className="px-3 py-1 text-[10px] font-bold text-slate-500">MONTH</button>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {[
              { name: "Health & Sanitation", amount: 9.4, color: "bg-emerald-600" },
              { name: "Infrastructure & Roads", amount: 7.2, color: "bg-slate-700" },
              { name: "Education & Youth", amount: 4.8, color: "bg-slate-500" },
              { name: "Urban Renewal", amount: 3.5, color: "bg-slate-400" },
              { name: "Agriculture", amount: 2.1, color: "bg-slate-300" }
            ].map((dept, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-semibold text-slate-700">{dept.name}</span>
                  <span className="text-[11px] font-bold text-brand-dark font-mono">KSh {dept.amount}B</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full w-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(dept.amount / 9.4) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className={`h-full rounded-full ${dept.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-brand-green" />
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Watchdog Insights</h3>
            </div>
          </div>
          <div className="p-6 flex flex-col h-full bg-slate-50/30">
            <p className="text-xs font-medium leading-relaxed text-slate-600 italic border-l-2 border-brand-green pl-4 mb-6">
              "The 2025/26 budget shows a significant focus on Health, yet 24% of the allocation remains 'Unspecified Development'. This is a primary audit target."
            </p>
            
            <div className="space-y-3 mt-auto">
              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <h4 className="text-[10px] font-bold uppercase text-slate-500 mb-1">System Core Mission</h4>
                <p className="text-[11px] leading-normal text-slate-700">
                  Transposing fiscal datasets into plain-language citizen digests via Google Gemini 1.5 Pro.
                </p>
              </div>
              <button className="w-full py-3 bg-brand-dark text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-md">
                Download Full Analysis (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Added imports needed for Overview
import { MessageCircle } from 'lucide-react';
