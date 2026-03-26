import React from 'react';
import { motion } from 'framer-motion';

export default function CompetitorMap({ data }: { data: any }) {
  if (!data || !data.competitors) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      <h4 className="text-zinc-200 font-bold mb-8 tracking-wide text-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Competitive Positioning
      </h4>
      <div className="relative w-full aspect-video md:h-72 bg-zinc-900 border-l-2 border-b-2 border-zinc-700 max-w-2xl mx-auto rounded-tl-sm rounded-br-sm">
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-widest uppercase text-zinc-500">{data.x_label || 'X Axis'}</span>
        <span className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold tracking-widest uppercase text-zinc-500">{data.y_label || 'Y Axis'}</span>
        
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-5 pointer-events-none border border-white/10 select-none">
          {Array.from({length: 16}).map((_, i) => <div key={i} className="border border-white/20"/>)}
        </div>

        {data.competitors.map((comp: any, i: number) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-10 hover:z-20 group"
            style={{ 
              left: `${(Math.min(10, Math.max(0, comp.x || 0)) / 10) * 100}%`, 
              bottom: `${(Math.min(10, Math.max(0, comp.y || 0)) / 10) * 100}%` 
            }}
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.9)] cursor-pointer border-2 border-zinc-900 group-hover:scale-125 transition-transform" />
            <span className="absolute top-6 mt-1 text-[11px] text-zinc-300 font-semibold bg-zinc-800/90 px-2 py-1 rounded shadow-lg border border-zinc-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {comp.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
