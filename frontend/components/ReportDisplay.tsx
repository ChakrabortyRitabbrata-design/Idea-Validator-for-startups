import React from 'react';
import { useStore } from '../store/useStore';
import { motion, Variants } from 'framer-motion';
import { marked } from 'marked';
import { 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  Lightbulb,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface ReportDisplayProps {
  currentReport: any;
}

export default function ReportDisplay({ currentReport }: ReportDisplayProps) {
  const { resetSession } = useStore();
  
  // Framer Motion variants for stagger effect
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const createMarkup = (markdown: string) => {
    return { __html: marked(markdown) };
  };

  if (typeof currentReport !== 'object' || currentReport === null) {
    return (
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-8 md:p-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 duration-500 relative group overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="flex items-center gap-3 mb-8 border-b border-zinc-800/50 pb-6 relative z-10">
          <Sparkles size={20} className="text-cyan-400" />
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Evaluation Result</h2>
        </div>
        <div 
          className="prose prose-invert prose-p:text-zinc-400 prose-headings:text-zinc-100 prose-a:text-indigo-400 prose-strong:text-zinc-200 prose-ul:text-zinc-400 prose-li:marker:text-zinc-600 max-w-none text-[15.5px] leading-relaxed relative z-10"
          dangerouslySetInnerHTML={createMarkup(currentReport as string)}
        />
      </div>
    );
  }

  // Verdict style mapping
  const verdictStr = currentReport.verdict ? currentReport.verdict.toUpperCase() : '';
  const isGo = verdictStr.includes('GO') && !verdictStr.includes('NO-GO');
  const isNoGo = verdictStr.includes('NO-GO');
  const isPivot = verdictStr.includes('PIVOT') || (!isGo && !isNoGo);

  let verdictStyles = '';
  let VerdictIcon = AlertTriangle;

  if (isGo) {
    verdictStyles = 'bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.5)]';
    VerdictIcon = CheckCircle;
  } else if (isNoGo) {
    verdictStyles = 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]';
    VerdictIcon = XCircle;
  } else {
    verdictStyles = 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]';
    VerdictIcon = AlertTriangle;
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mt-8 space-y-8"
    >
      {/* Verdict Badge */}
      {currentReport.verdict && (
        <motion.div variants={itemVariants} className={`p-5 rounded-2xl flex items-center justify-center gap-3 border backdrop-blur-sm relative overflow-hidden ${verdictStyles}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
          <VerdictIcon className="w-6 h-6 z-10" />
          <span className="font-extrabold text-xl tracking-[0.2em] relative z-10">VERDICT: {verdictStr}</span>
        </motion.div>
      )}

      {/* Strategic Consultant Opinion */}
      {currentReport.consultant_opinion && (
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-100 tracking-tight">
            <Lightbulb className="text-cyan-400 w-5 h-5" /> Executive Brief
          </h3>
          <div className="grid gap-4">
            {(Array.isArray(currentReport.consultant_opinion) ? currentReport.consultant_opinion : [currentReport.consultant_opinion]).map((op: any, i: number) => (
              <div 
                key={i} 
                className="relative p-6 rounded-xl bg-zinc-950/60 backdrop-blur-xl border border-white/5 shadow-2xl transition-all duration-300 hover:bg-zinc-900/80 border-l-4 border-l-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles size={48} className="text-cyan-500" />
                </div>
                <div className="flex gap-4 relative z-10">
                  <div className="mt-1 flex-shrink-0">
                    <Sparkles size={18} className="text-cyan-400" />
                  </div>
                  <p className="text-zinc-300 text-[15.5px] leading-relaxed font-medium">
                    {String(op)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}



      {/* Risk Profile Grid */}
      {currentReport.risks && typeof currentReport.risks === 'object' && Object.keys(currentReport.risks).length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-100 tracking-tight">
            <AlertTriangle className="text-indigo-400 w-5 h-5" /> Risk Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.isArray(currentReport.risks) ? (
              <div className="p-6 rounded-2xl bg-zinc-950/50 backdrop-blur-md border border-white/5 shadow-xl md:col-span-3">
                <ul className="space-y-3">
                  {currentReport.risks.map((r: string, i: number) => (
                    <li key={i} className="flex gap-3 text-[14.5px] text-zinc-400 leading-snug items-start">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      <span>{String(r)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              Object.entries(currentReport.risks).map(([category, risksList]) => {
                const items = Array.isArray(risksList) ? risksList : typeof risksList === 'object' && risksList !== null ? Object.values(risksList) : [risksList];
                
                // Generic risk meter visualization based on category implicitly
                const meterWidth = category.toLowerCase().includes('execution') ? '75%' : 
                                   category.toLowerCase().includes('market') ? '60%' : '45%';
                const meterColor = category.toLowerCase().includes('execution') ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                                   category.toLowerCase().includes('market') ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 
                                   'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]';

                return (
                  <div key={category} className="flex flex-col p-6 rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-white/5 shadow-2xl hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold tracking-widest uppercase text-zinc-300">{category}</h4>
                    </div>
                    
                    {/* Risk Meter */}
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-5 overflow-hidden">
                      <div className={`h-1.5 rounded-full ${meterColor}`} style={{ width: meterWidth }}></div>
                    </div>

                    <ul className="space-y-3 mt-auto">
                      {items.map((r, i) => (
                        <li key={i} className="flex gap-2.5 text-[14px] text-zinc-400 leading-relaxed items-start">
                          <span className="text-zinc-600 mt-0.5 opacity-70">•</span>
                          <span>{String(r)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}

      {/* Validation Plan */}
      {currentReport.validation_plan && (
        <motion.div variants={itemVariants} className="relative p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-100 mb-6 relative z-10 tracking-tight">
            <Target className="text-indigo-400 w-5 h-5" /> Validation Roadmap
          </h3>
          <ol className="space-y-5 relative z-10">
            {(Array.isArray(currentReport.validation_plan) ? currentReport.validation_plan : [currentReport.validation_plan]).map((step: any, i: number) => (
              <li key={i} className="flex gap-4 text-zinc-300 text-[15px] group">
                <span className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-zinc-800/80 text-cyan-400 text-sm font-bold border border-zinc-700/50 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors shadow-inner">
                  {i+1}
                </span>
                <span className="pt-1.5 leading-relaxed font-medium">{String(step)}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      )}
      
      {/* Refine Button */}
      <motion.div variants={itemVariants}>
        <button 
          onClick={async () => {
            await resetSession();
            window.location.reload();
          }}
          className="mt-4 w-full py-4 rounded-xl font-semibold bg-transparent border border-zinc-700 hover:bg-red-500 hover:border-red-500 text-zinc-300 hover:text-white transition-all duration-300 flex justify-center items-center gap-2 group hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
        >
          <RotateCcw size={18} className="text-zinc-500 group-hover:text-white transition-transform duration-500 group-hover:-rotate-180" />
          <span className="group-hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">Refine & Resubmit</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
