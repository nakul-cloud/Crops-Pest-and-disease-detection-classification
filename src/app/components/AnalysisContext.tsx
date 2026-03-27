import React, { createContext, useContext, useRef, useState } from "react";

const API_BASE = "http://localhost:8000";

// --- Types ---
export interface Detection {
  box: number[];
  label: string;
  confidence: number;
}

export interface ClassificationResult {
  class: string;
  confidence: number;
}

export interface PipelineItem {
  detection: Detection;
  classification: ClassificationResult;
}

interface AnalysisState {
  detections: Detection[];
  classification: ClassificationResult | null;
  pipelineResults: PipelineItem[];
  insights: any | null;
  error: string | null;
  isLoading: boolean;
  previewUrl: string | null;
  selectedMode: string;
}

interface AnalysisContextValue extends AnalysisState {
  fileRef: React.MutableRefObject<File | null>;
  setPreviewUrl: (url: string | null) => void;
  setSelectedMode: (mode: string) => void;
  analyze: () => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used inside AnalysisProvider");
  return ctx;
}

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const fileRef = useRef<File | null>(null);
  const [selectedMode, setSelectedMode] = useState("pipeline");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [pipelineResults, setPipelineResults] = useState<PipelineItem[]>([]);
  const [insights, setInsights] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = async () => {
    const file = fileRef.current;
    if (!file) {
      setError("No image selected.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setDetections([]);
    setClassification(null);
    setPipelineResults([]);
    setInsights(null);

    const formData = new FormData();
    formData.append("image", file);
    console.log("[CV App] Sending request. Mode:", selectedMode, "File:", file.name);

    try {
      let url = "";
      if (selectedMode === "pest") url = `${API_BASE}/detect/pest`;
      else if (selectedMode === "disease") url = `${API_BASE}/detect/disease`;
      else if (selectedMode === "classification") url = `${API_BASE}/classify`;
      else url = `${API_BASE}/pipeline`;

      const res = await fetch(url, { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Request failed");
      }
      const data = await res.json();
      console.log("[CV App] API Response:", data);

      if (selectedMode === "pest" || selectedMode === "disease") {
        setDetections(data.detections ?? []);
      } else if (selectedMode === "classification") {
        setClassification({ class: data.class, confidence: data.confidence });
      } else {
        // pipeline
        const items: PipelineItem[] = (data.pipeline_results ?? []).map((r: any) => ({
          detection: r.detection,
          classification: { class: r.classification.class, confidence: r.classification.confidence },
        }));
        setPipelineResults(items);
        // also populate detections for the bounding box overlay
        setDetections(items.map((i) => i.detection));
      }

      // Explicit check and fallback for AI insights debug
      if (data.insights && data.insights !== null) {
        console.log("[CV App] Setting insights:", data.insights);
        setInsights(data.insights);
      } else {
        console.warn("[CV App] Insights missing from backend response.");
        setInsights({
          summary: "Analysis Complete",
          severity: "Moderate",
          recommendation: "Review the detected bounding boxes and classification for more details."
        });
      }
    } catch (e: any) {
      console.error("[CV App] Error:", e);
      setError(e.message ?? "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnalysisContext.Provider
      value={{
        fileRef,
        selectedMode,
        setSelectedMode,
        previewUrl,
        setPreviewUrl,
        detections,
        classification,
        pipelineResults,
        insights,
        error,
        isLoading,
        analyze,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}
