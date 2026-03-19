import { create } from 'zustand';

export interface StructuredAnalysis {
  assumptions?: string[];
  risks?: Record<string, string[]>;
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
  isLoading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
  analyzeIdea: (title: string, description: string) => Promise<void>;
  setCurrentReport: (report: StructuredAnalysis | string) => void;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

export const useStore = create<AppState>((set, get) => ({
  history: [],
  currentReport: null,
  isLoading: false,
  error: null,

  fetchHistory: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/evaluations`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      set({ history: Array.isArray(data) ? data : data.data || [] });
    } catch (err) {
      console.error(err);
      set({ error: 'Could not load history. Is the backend running?' });
    }
  },

  analyzeIdea: async (title: string, description: string) => {
    set({ isLoading: true, error: null, currentReport: null });
    
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

      const data = await res.json();
      // Handle the robust new structured 'analysis' field, fallback to 'report'
      set({ currentReport: data.analysis || data.report, isLoading: false });
      
      // Refresh history correctly
      get().fetchHistory();
      
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || 'An error occurred during analysis', isLoading: false });
    }
  },

  setCurrentReport: (report: StructuredAnalysis | string) => {
    let parsedReport = report;
    // Attempt rudimentary parse if history contains python str representation of dict
    if (typeof report === 'string' && report.trim().startsWith('{')) {
      try {
        const sanitized = report.replace(/'/g, '"').replace(/None/g, 'null').replace(/True/g, 'true').replace(/False/g, 'false');
        parsedReport = JSON.parse(sanitized);
      } catch (e) {
        // Fall back to original string rendering if regex fails
      }
    }
    set({ currentReport: parsedReport });
  },
}));
