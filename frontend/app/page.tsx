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
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReportDisplay from '../components/ReportDisplay';

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
          {isLoading && !currentReport && (
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
          {currentReport && (
            <ReportDisplay currentReport={currentReport} />
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
                      setCurrentReport(ev.report, ev.id);
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
