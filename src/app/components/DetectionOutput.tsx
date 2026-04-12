import { useState } from "react";
import { ZoomIn, Download, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { motion } from "motion/react";
import { useAnalysis } from "./AnalysisContext";
import { InsightsPanel } from "./InsightsPanel";

const TYPE_COLORS: Record<string, string> = {
  pest: "#fbbf24",
  disease: "#ef4444",
  healthy: "#22c55e",
};

function pickColor(label: string, index: number) {
  const lower = label.toLowerCase();
  if (lower.includes("pest") || lower.includes("aphid") || lower.includes("mite")) return "#fbbf24";
  if (lower.includes("healthy")) return "#22c55e";
  // cycle through palette for diseases
  const palette = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#ec4899"];
  return palette[index % palette.length];
}

export function DetectionOutput() {
  const { detections, classification, pipelineResults, previewUrl, selectedMode, isLoading } = useAnalysis();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Build display items
  const hasResults = detections.length > 0 || !!classification || pipelineResults.length > 0;

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, #14213d 0%, #111d34 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Detection Results</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {isLoading
              ? "Processing…"
              : hasResults
              ? `${detections.length} object(s) detected`
              : "Upload an image and click Analyze to see results"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--foreground)", background: "transparent" }}
          >
            <ZoomIn className="w-3.5 h-3.5 mr-1.5" />
            Zoom
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--foreground)", background: "transparent" }}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Image with Bounding Boxes has been moved to ImageUploadSection */}


      {/* Classification Result (classification mode) */}
      {classification && selectedMode === "classification" && (
        <div className="mb-4 p-4 rounded-xl bg-accent/10 border border-accent/30">
          <p className="text-sm text-white font-semibold mb-1">Predicted Class</p>
          <div className="flex items-center justify-between">
            <span className="text-accent font-bold text-lg">{classification.class}</span>
            <span className="text-sm text-muted-foreground">{Math.round(classification.confidence * 100)}% confidence</span>
          </div>
          <Progress value={classification.confidence * 100} className="h-2 mt-2 bg-white/10" />
        </div>
      )}

      {/* Pipeline Classification Results */}
      {pipelineResults.length > 0 && (
        <div className="mb-4 space-y-2">
          {pipelineResults.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-medium">{item.detection.label}</span>
                <span className="text-muted-foreground">→ {item.classification.class}</span>
                <span className="text-primary">{Math.round(item.classification.confidence * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detection List */}
      {detections.length > 0 && (
        <div className="space-y-2.5">
          {detections.map((det, index) => {
            const color = pickColor(det.label, index);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                onMouseEnter={() => setSelectedIdx(index)}
                onMouseLeave={() => setSelectedIdx(null)}
                className="p-3.5 rounded-xl transition-all cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{det.label}</span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
                  >
                    {selectedMode}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--muted-foreground)" }}>Confidence</span>
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>
                      {Math.round(det.confidence * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={det.confidence * 100}
                    className="h-1.5"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      ["--progress-background" as string]: color,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !hasResults && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Results will appear here after analysis.
        </div>
      )}

      {/* Embedded AI Insights Panel */}
      {(hasResults || isLoading) && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <InsightsPanel />
        </div>
      )}
    </div>
  );
}