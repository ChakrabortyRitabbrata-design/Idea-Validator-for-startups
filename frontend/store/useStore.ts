import { create } from 'zustand';

export interface StructuredAnalysis {
  consultant_opinion?: string[];
  risks?: Record<string, string | string[]>;
  validation_plan?: string[];
  verdict?: string;
  [key: string]: any;
}

export interface Evaluation {
  id?: number;
  title: string;
  description: string;
  report: string | StructuredAnalysis;
  created_at?: string;
}

interface AppState {
  history: Evaluation[];
  currentReport: StructuredAnalysis | string | null;
  currentId: number | null; // Added to track current session ID
  isLoading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
  analyzeIdea: (title: string, description: string) => Promise<void>;
  setCurrentReport: (report: StructuredAnalysis | string, id?: number) => void;
  resetSession: () => Promise<void>; // The new "Refine & Resubmit" logic
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const parseReportString = (str: string) => {
  try {
    let cleaned = str.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    }
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("Failed to parse report string as JSON.", e);
    try {
      const start = str.indexOf('{');
      const end = str.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
         return JSON.parse(str.substring(start, end + 1));
      }
    } catch (err) {}
    
    return str; // Fallback to raw string
  }
};

export const useStore = create<AppState>((set, get) => ({
        history: [],
        currentReport: null,
  currentId: null,
  isLoading: false,
  error: null,

 fetchHistory: async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/evaluations`);
    if (!res.ok) throw new Error('Failed to fetch history');
    
    const data = await res.json();
    
    // 1. Ensure we have an array
    const rawHistory = Array.isArray(data) ? data : (data.data || []);

    // 2. The "Hydration" Logic: Parse JSON Strings
    const formattedHistory = rawHistory.map((item: any) => {
      let parsedReport = item.report;
      
      if (typeof item.report === 'string') {
        parsedReport = parseReportString(item.report);
      }
      
      return { ...item, report: parsedReport };
    });

    set({ history: formattedHistory, error: null });
  } catch (err) {
    console.error("History Sync Error:", err);
    set({ history: [], error: 'Could not sync with database.' });
  }
},
  analyzeIdea: async (title: string, description: string) => {
    // 1. Optimistic Update (Immediate Feedback, reduces perceived TTFT)
    set({ isLoading: true, error: null, currentReport: "Researcher is working...", currentId: null });
    
    try {
      const res = await fetch(`${API_BASE_URL}/analyze-idea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to analyze idea');
      }

      // Check for Evaluation ID in headers
      const evalId = res.headers.get('X-Evaluation-Id');
      if (evalId) {
        set({ currentId: parseInt(evalId, 10) });
      }

      // Expecting standard JSON response
      const data = await res.json();

      set({ isLoading: false });
      const finalId = data.id || (evalId ? parseInt(evalId, 10) : undefined);
      get().setCurrentReport(data.report, finalId);
      get().fetchHistory();
      
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || 'An error occurred during analysis', isLoading: false });
    }
  },

  // Reset Logic: Deletes from DB, clears state, and reloads page
  resetSession: async () => {
    const id = get().currentId;
    if (id) {
      try {
        await fetch(`${API_BASE_URL}/evaluations/${id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error("Failed to delete from database:", err);
      }
    }
  },

  setCurrentReport: (report: StructuredAnalysis | string, id?: number) => {
    let parsed = report;
    if (typeof report === 'string') {
      parsed = parseReportString(report);
    }
    set({ currentReport: parsed as StructuredAnalysis, currentId: id || null });
  }
}));