import React from 'react';
import { motion } from 'framer-motion';

export default function GanttComplianceChart({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data)) return null;

  const totalWeeks = data.reduce((sum, item) => sum + (item.duration_weeks || 1), 0);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-8 rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      <h4 className="text-zinc-200 font-bold mb-8 tracking-wide text-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
        Action Plan Gantt
      </h4>
      <div className="space-y-6 max-w-2xl mx-auto">
        {data.map((item, i) => {
          const w = item.duration_weeks || 1;
          const widthPct = totalWeeks > 0 ? (w / totalWeeks) * 100 : 100;
          const isCritical = item.status?.toLowerCase() === 'critical';

          return (
            <div key={i} className="flex flex-col gap-2 group">
              <div className="flex justify-between text-sm md:text-base font-medium text-zinc-300">
                <span className="flex items-center gap-2">
                  {isCritical && <span className="text-red-400 text-xs px-1 border border-red-500/30 rounded uppercase tracking-wider bg-red-500/10">Critical</span>}
                  {item.task}
                </span>
                <span className="text-zinc-500 font-mono text-sm">{w} wk{w !== 1 && 's'}</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden shadow-inner border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ delay: i * 0.2 + 0.3, duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] ${isCritical ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
