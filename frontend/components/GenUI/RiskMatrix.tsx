import React from 'react';
import { motion } from 'framer-motion';

export default function RiskMatrix({ data }: { data: any[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      <h4 className="text-zinc-200 font-bold mb-8 tracking-wide text-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        Vector Risk Matrix
      </h4>
      <div className="relative w-full aspect-video md:h-72 bg-zinc-900 border-l-2 border-b-2 border-zinc-700 max-w-2xl mx-auto rounded-tl-sm rounded-br-sm">
        {/* Axes labels */}
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-widest uppercase text-zinc-500 text-shadow-sm">Impact</span>
        <span className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold tracking-widest uppercase text-zinc-500">Probability</span>
        
        {/* Quadrants */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20 pointer-events-none rounded-tr-md">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5"/><div className="bg-gradient-to-bl from-red-500/30 to-red-500/10"/>
          <div className="bg-gradient-to-tr from-green-500/20 to-green-500/5"/><div className="bg-gradient-to-tl from-yellow-500/20 to-yellow-500/5"/>
        </div>

        {data && Array.isArray(data) && data.map((risk, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.2 + 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="absolute w-5 h-5 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.9)] flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group hover:scale-125 transition-transform cursor-pointer border-2 border-white/20"
            style={{ left: `${(Math.min(10, Math.max(0, risk.impact)) / 10) * 100}%`, bottom: `${(Math.min(10, Math.max(0, risk.probability)) / 10) * 100}%` }}
          >
            <div className="absolute bottom-8 bg-zinc-800 text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap z-20 border border-zinc-600 shadow-xl font-medium text-white pointer-events-none">
              {risk.name} <span className="text-indigo-400 ml-1">(I: {risk.impact}, P: {risk.probability})</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
