import React from 'react';
import { motion } from 'framer-motion';

export default function MetricGauge({ data }: { data: any }) {
  const percentage = data.max > 0 ? (data.value / data.max) * 100 : 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-4"
    >
      <h4 className="text-zinc-300 font-semibold tracking-wide text-lg">{data.label}</h4>
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <motion.circle 
            cx="50" cy="50" r="45" fill="none" 
            stroke="currentColor" strokeWidth="10" strokeLinecap="round"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-extrabold text-white tracking-tighter shadow-black drop-shadow-md">
            {data.value}{data.unit}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
