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

      {/* Image with Bounding Boxes */}
      <div className="relative rounded-xl overflow-hidden mb-5 group" style={{ background: "#050d18" }}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Crop Analysis"
            className="w-full h-80 object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-80 flex items-center justify-center text-muted-foreground text-sm">
            No image uploaded yet
          </div>
        )}

        {/* Bounding Boxes Overlay — rendered as %, so works at any image resolution */}
        {previewUrl && detections.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1 1" preserveAspectRatio="none">
            {detections.map((det, idx) => {
              // det.box = [x1, y1, x2, y2] in pixels; we need to relative-size them.
              // We don't know original img dims here so we use a 640×640 reference (YOLO default).
              const ref = 640;
              const [x1, y1, x2, y2] = det.box;
              const x = x1 / ref;
              const y = y1 / ref;
              const w = (x2 - x1) / ref;
              const h = (y2 - y1) / ref;
              const color = pickColor(det.label, idx);
              return (
                <g
                  key={idx}
                  className={`transition-opacity ${selectedIdx === idx || selectedIdx === null ? "opacity-100" : "opacity-30"}`}
                >
                  <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth="0.004" rx="0.005" />
                  <rect x={x} y={Math.max(0, y - 0.04)} width={w} height="0.04" fill={color} opacity="0.85" rx="0.005" />
                  <text x={x + 0.005} y={Math.max(0.04, y - 0.01)} fill="white" fontSize="0.025" fontWeight="600">
                    {det.label} {Math.round(det.confidence * 100)}%
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" className="bg-white text-black hover:bg-white/90 text-xs">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            View Full Size
          </Button>
        </div>
      </div>

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