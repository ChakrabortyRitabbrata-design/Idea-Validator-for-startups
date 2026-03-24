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

export const useStore = create<AppState>((set, get) => ({
        history: [],
        currentReport: null,
  currentId: null,
  isLoading: false,
  error: null,

 fetchHistory: async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/evaluations`);
    const data = await res.json();
    
    const formattedData = data.map((item: any) => ({
      ...item,
      // If report is a string (common with SQLAlchemy), parse it to an object
      report: typeof item.report === 'string' ? JSON.parse(item.report.replace(/'/g, '"')) : item.report
    }));

    set({ history: formattedData });
  } catch (err) {
    set({ history: [] });
  }
},
  analyzeIdea: async (title: string, description: string) => {
    set({ isLoading: true, error: null, currentReport: null, currentId: null });
    
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
      
      // We now capture 'id' from the backend response
      set({ 
        currentReport: data.analysis || data.report, 
        currentId: data.id, 
        isLoading: false 
      });
      
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
    set({ currentReport: report, currentId: id || null });
  }
}));