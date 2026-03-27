import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, Leaf } from "lucide-react";
import { Progress } from "./ui/progress";
import { useAnalysis } from "./AnalysisContext";

function pickResultStyle(label: string) {
  const l = label.toLowerCase();
  if (l.includes("healthy"))
    return {
      color: "#22c55e",
      bg: "rgba(34,197,94,0.08)",
      border: "rgba(34,197,94,0.35)",
      Icon: CheckCircle2,
      tag: "Healthy",
    };
  if (l.includes("blight") || l.includes("mosaic") || l.includes("rot") || l.includes("rust") || l.includes("miner") || l.includes("wilt") || l.includes("spot") || l.includes("curl") || l.includes("virus") || l.includes("mite") || l.includes("armyworm") || l.includes("grasshop") || l.includes("beetle") || l.includes("bacter") || l.includes("gummosis") || l.includes("anthracnose"))
    return {
      color: "#ef4444",
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.35)",
      Icon: AlertTriangle,
      tag: "Disease / Pest",
    };
  return {
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.35)",
    Icon: Leaf,
    tag: "Detected",
  };
}

export function ClassificationResultBanner() {
  const { classification, isLoading, selectedMode } = useAnalysis();

  // Only render for classification mode
  if (selectedMode !== "classification") return null;

  return (
    <AnimatePresence>
      {(isLoading || classification) && (
        <motion.div
          key="result-banner"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {isLoading && !classification ? (
            /* Loading skeleton */
            <div
              className="rounded-2xl p-6 flex items-center gap-4"
              style={{
                background: "linear-gradient(135deg, #14213d 0%, #111d34 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded bg-white/10 animate-pulse w-1/3" />
                <div className="h-3 rounded bg-white/5 animate-pulse w-1/2" />
              </div>
            </div>
          ) : classification ? (
            /* Real result */
            (() => {
              const { color, bg, border, Icon, tag } = pickResultStyle(classification.class);
              const pct = Math.round(classification.confidence * 100);
              return (
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: `linear-gradient(135deg, ${bg} 0%, #111d34 100%)`,
                    border: `1px solid ${border}`,
                  }}
                >
                  {/* Badge row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: `${color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                          Classification Result
                        </p>
                        <p className="text-2xl font-bold leading-tight" style={{ color }}>
                          {classification.class}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}
                    >
                      {tag}
                    </span>
                  </div>

                  {/* Confidence bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: "var(--muted-foreground)" }}>Confidence</span>
                      <span className="font-bold text-lg" style={{ color }}>{pct}%</span>
                    </div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                      style={{ transformOrigin: "left" }}
                    >
                      <Progress
                        value={pct}
                        className="h-3 bg-white/10"
                        style={{ ["--progress-background" as string]: color }}
                      />
                    </motion.div>
                  </div>
                </div>
              );
            })()
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
