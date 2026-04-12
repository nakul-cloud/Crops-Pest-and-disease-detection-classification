import { useRef } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useAnalysis } from "./AnalysisContext";

const modes = [
  { id: "pest", label: "Pest Detection", color: "text-yellow-400" },
  { id: "disease", label: "Disease Detection", color: "text-red-400" },
  { id: "classification", label: "Classification", color: "text-accent" },
  { id: "pipeline", label: "Full Pipeline", color: "text-primary" },
];

export function ImageUploadSection() {
  const { selectedMode, setSelectedMode, previewUrl, setPreviewUrl,
          fileRef, isLoading, error, analyze, detections } = useAnalysis();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    fileRef.current = file;
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  const handleSelectClick = () => inputRef.current?.click();
  const handleClear = () => {
    setPreviewUrl(null);
    fileRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  };

  // Helper function to match detection colors
  function pickColor(label: string, index: number) {
    const lower = label.toLowerCase();
    if (lower.includes("pest") || lower.includes("aphid") || lower.includes("mite")) return "#fbbf24";
    if (lower.includes("healthy")) return "#22c55e";
    const palette = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#ec4899"];
    return palette[index % palette.length];
  }

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
          <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Upload &amp; Analyze</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Upload crop images for AI-powered detection
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs text-primary">AI Ready</span>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className="p-2.5 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              background: selectedMode === mode.id ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
              border: selectedMode === mode.id ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(255,255,255,0.07)",
              color: selectedMode === mode.id ? "#22c55e" : "var(--muted-foreground)",
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!previewUrl ? handleSelectClick : undefined}
        className="relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer overflow-hidden group"
        style={{
          borderColor: "rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.02)",
          padding: previewUrl ? "0" : "2rem",
        }}
      >
        {previewUrl ? (
          <div className="relative w-full h-[400px]">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            {/* Draw bounding boxes directly over the uploaded image */}
            {detections && detections.length > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1 1" preserveAspectRatio="none">
                {detections.map((det: any, idx: number) => {
                  const refWidth = 640; 
                  const [x1, y1, x2, y2] = det.box;
                  const x = x1 / refWidth;
                  const y = y1 / refWidth;
                  const w = (x2 - x1) / refWidth;
                  const h = (y2 - y1) / refWidth;
                  const color = pickColor(det.label, idx);
                  return (
                    <g key={idx} className="opacity-100 transition-opacity">
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
            
            <button
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(34,197,94,0.12)" }}
            >
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <h4 className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Drop your image here</h4>
            <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>
              or click to browse files
            </p>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs" onClick={(e) => { e.stopPropagation(); handleSelectClick(); }}>
              <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
              Select Image
            </Button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Analyze Button */}
      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5"
        >
          <Button
            onClick={analyze}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white h-11 text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing crop using AI...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Analyze Image
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}