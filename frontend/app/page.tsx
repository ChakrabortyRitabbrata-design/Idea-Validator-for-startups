"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { marked } from 'marked';
import { 
  BrainCircuit, 
  Sparkles, 
  History, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  ShieldAlert,
  ListChecks,
  RefreshCw
} from 'lucide-react';

export default function IdeaValidatorPage() {
  const { 
    history, 
    currentReport, 
    isLoading, 
    error, 
    fetchHistory, 
    analyzeIdea, 
    setCurrentReport 
  } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    await analyzeIdea(title, description);
    // Optional: Reset form or leave it populated
    // setTitle('');
    // setDescription('');
  };

  const createMarkup = (markdown: string) => {
    return { __html: marked(markdown) };
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] font-sans selection:bg-[#fff]/10 selection:text-white flex flex-col items-center">
      {/* Linear-style top subtle glow line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#4B4B4B] to-transparent opacity-50 absolute top-0"></div>

      {/* Navigation */}
      <nav className="w-full max-w-7xl px-6 py-6 flex items-center justify-between border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-[#1A1A1A] border border-[#333] shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <BrainCircuit size={18} className="text-[#A3A3A3]" />
          </div>
          <span className="font-semibold tracking-tight text-[15px] text-[#EDEDED]">Validator<span className="text-[#888]">OS</span></span>
        </div>
      </nav>

      <main className="w-full max-w-7xl flex-grow px-6 py-12 flex flex-col lg:flex-row gap-12 relative">
        
        {/* Abstract Background Blur (Linear style) */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#FFFFFF] opacity-[0.015] blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {/* LEFT PANE: Form & Result */}
        <div className="w-full lg:w-2/3 flex flex-col gap-10">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 decoration-slice bg-clip-text text-transparent bg-gradient-to-br from-white to-[#666]">
              Analyze your project.
            </h1>
            <p className="text-[#888] text-lg max-w-xl leading-relaxed">
              Define your startup idea below. Our LLM-powered engine will evaluate market fit, risk vectors, and execution strategy.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-[13px] font-medium text-[#A3A3A3]">Project Title</label>
              <input 
                id="title"
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Linear for Hardware"
                disabled={isLoading}
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-[15px] placeholder-[#555] focus:outline-none focus:border-[#666] focus:ring-1 focus:ring-[#666] transition-all disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-[13px] font-medium text-[#A3A3A3]">Core Proposition</label>
              <textarea 
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What problem does it solve? Who is the audience?"
                disabled={isLoading}
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-[15px] placeholder-[#555] focus:outline-none focus:border-[#666] focus:ring-1 focus:ring-[#666] transition-all resize-none disabled:opacity-50"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !title.trim() || !description.trim()}
              className="mt-2 h-11 self-start inline-flex items-center justify-center gap-2 bg-[#F2F2F2] hover:bg-[#FFFFFF] text-black px-6 rounded-md text-[14px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#666]" />
                  <span className="text-[#666]">Processing Protocol...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Run Analysis</span>
                  {/* Subtle hover gradient on button */}
                  <div className="absolute inset-0 border border-black/10 rounded-md mix-blend-overlay"></div>
                </>
              )}
            </button>

            {error && (
              <div className="flex items-center gap-2 text-red-500/90 bg-red-500/10 border border-red-500/20 rounded-md p-3 text-sm mt-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Skeleton Loader */}
          {isLoading && (
            <div className="mt-8 rounded-xl border border-[#222] bg-[#111] p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#222] to-transparent w-[200%] animate-[shimmer_2s_infinite] -translate-x-full" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 h-5 rounded-full bg-[#333] animate-pulse"></div>
                <div className="h-5 w-40 bg-[#333] rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-[#222] rounded animate-pulse"></div>
                <div className="h-4 w-[90%] bg-[#222] rounded animate-pulse"></div>
                <div className="h-4 w-[95%] bg-[#222] rounded animate-pulse"></div>
                <div className="h-4 w-[70%] bg-[#222] rounded animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Report Card */}
          {!isLoading && currentReport && (
            typeof currentReport === 'object' && currentReport !== null ? (
              <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Verdict Badge */}
                {currentReport.verdict && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 border ${
                    currentReport.verdict.toUpperCase().includes('GO') && !currentReport.verdict.toUpperCase().includes('NO-GO') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                    currentReport.verdict.toUpperCase().includes('NO-GO') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                    'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {currentReport.verdict.toUpperCase().includes('GO') && !currentReport.verdict.toUpperCase().includes('NO-GO') ? <CheckCircle /> : currentReport.verdict.toUpperCase().includes('NO-GO') ? <XCircle /> : <AlertTriangle />}
                    <span className="font-bold text-lg tracking-wider">VERDICT: {currentReport.verdict.toUpperCase()}</span>
                  </div>
                )}
            
                {/* Assumptions */}
                {currentReport.assumptions && (
                  <div className="p-6 rounded-xl bg-[#111]/80 backdrop-blur-md border border-[#222] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#EAEAEA] mb-4">
                      <Target size={18} className="text-[#888]" /> Core Assumptions
                    </h3>
                    <ul className="space-y-2">
                      {(Array.isArray(currentReport.assumptions) ? currentReport.assumptions : [currentReport.assumptions]).map((ass: any, i: number) => (
                        <li key={i} className="flex gap-3 text-[#A3A3A3] text-[15px]">
                          <span className="text-[#555] mt-1">•</span> <span className="pt-0.5">{String(ass)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            
                {/* Risks Grid */}
                {currentReport.risks && typeof currentReport.risks === 'object' && Object.keys(currentReport.risks).length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#EAEAEA] mb-4 mt-8">
                      <ShieldAlert size={18} className="text-[#888]" /> Risk Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {Array.isArray(currentReport.risks) ? (
                         <div className="p-5 rounded-lg bg-[#161616] border border-[#2A2A2A] shadow-inner md:col-span-3">
                           <ul className="space-y-2">
                              {currentReport.risks.map((r: string, i: number) => (
                                <li key={i} className="text-[13.5px] text-[#A3A3A3] flex gap-2 leading-snug"><span className="text-red-500/50 mt-0.5">•</span> <span>{String(r)}</span></li>
                              ))}
                           </ul>
                         </div>
                       ) : (
                         Object.entries(currentReport.risks).map(([category, risksList]) => {
                            const items = Array.isArray(risksList) ? risksList : typeof risksList === 'object' && risksList !== null ? Object.values(risksList) : [risksList];
                            return (
                              <div key={category} className="p-5 rounded-lg bg-[#161616] border border-[#2A2A2A] shadow-inner">
                                 <h4 className="text-sm font-semibold tracking-wider uppercase text-[#888] mb-3">{category} Risks</h4>
                                 <ul className="space-y-2">
                                    {items.map((r, i) => (
                                      <li key={i} className="text-[13.5px] text-[#A3A3A3] flex gap-2 leading-snug"><span className="text-red-500/50 mt-0.5">•</span> <span>{String(r)}</span></li>
                                    ))}
                                 </ul>
                              </div>
                            );
                         })
                       )}
                    </div>
                  </div>
                )}
            
                {/* Validation Plan */}
                {currentReport.validation_plan && (
                  <div className="p-6 rounded-xl bg-gradient-to-br from-[#111] to-[#151515] border border-[#222] mt-8 shadow-[0_0_20px_rgba(0,0,0,0.5)] shadow-black/50">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#EAEAEA] mb-4">
                      <ListChecks size={18} className="text-[#888]" /> Validation Plan
                    </h3>
                    <ol className="space-y-4">
                      {(Array.isArray(currentReport.validation_plan) ? currentReport.validation_plan : [currentReport.validation_plan]).map((step: any, i: number) => (
                        <li key={i} className="flex gap-4 text-[#A3A3A3] text-[15px]">
                          <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded bg-[#222] text-[#888] text-xs font-mono">{i+1}</span>
                          <span className="pt-0.5 leading-relaxed">{String(step)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {/* Refine Button */}
                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Optional: You could focus the description box here if desired
                  }}
                  className="mt-6 w-full py-4 rounded-xl border border-[#333] hover:border-[#555] hover:bg-[#1A1A1A] transition-all text-[#EDEDED] font-medium flex justify-center items-center gap-2 group"
                >
                  <RefreshCw size={16} className="text-[#888] group-hover:rotate-180 transition-transform duration-500" />
                  Refine Idea & Resubmit
                </button>
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-[#333] bg-[#111] p-8 md:p-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 duration-500 relative group">
                {/* Subtle top border glow equivalent to Linear */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#555] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-3 mb-8 border-b border-[#222] pb-6">
                  <Sparkles size={20} className="text-[#A3A3A3]" />
                  <h2 className="text-xl font-semibold tracking-tight text-[#EAEAEA]">Evaluation Result</h2>
                </div>
                
                {/* Legacy Markdown Content rendered here */}
                <div 
                  className="prose prose-invert prose-p:text-[#A3A3A3] prose-headings:text-[#EDEDED] prose-a:text-[#888] prose-strong:text-[#EAEAEA] prose-ul:text-[#A3A3A3] prose-li:marker:text-[#555] max-w-none text-[15.5px] leading-relaxed"
                  dangerouslySetInnerHTML={createMarkup(currentReport as string)}
                />
              </div>
            )
          )}
        </div>

        {/* RIGHT PANE: Sidebar */}
        <div className="w-full lg:w-1/3">
          <aside className="sticky top-12 flex flex-col h-[calc(100vh-6rem)]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
              <h3 className="text-sm font-semibold tracking-wide text-[#EDEDED] flex items-center gap-2">
                <History size={16} className="text-[#666]" />
                Past Protocols
              </h3>
              <div className="text-xs text-[#666] flex items-center gap-1">
                <Database size={12} />
                {history.length} stored
              </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-4 space-y-2 -mr-4 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-[#555] text-[13px] py-4">No evaluations recorded.</div>
              ) : (
                history.map((ev, i) => (
                  <button
                    key={ev.id || i}
                    onClick={() => {
                      setCurrentReport(ev.report);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full text-left group p-4 rounded-lg bg-[#151515] border border-[#222] hover:border-[#444] hover:bg-[#1A1A1A] transition-all flex flex-col gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#555]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#EAEAEA] text-[14px] truncate tracking-tight pr-4">
                        {ev.title || 'Untitled Protocol'}
                      </span>
                      <ChevronRight size={14} className="text-[#444] group-hover:text-[#888] transition-colors shrink-0" />
                    </div>
                    <span className="text-[13px] text-[#888] line-clamp-1 leading-snug">
                      {ev.description}
                    </span>
                  </button>
                ))
              )}
            </div>
          </aside>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        /* Shimmer Animation */
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        
        /* Custom subtle scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}} />
    </div>
  );
}
