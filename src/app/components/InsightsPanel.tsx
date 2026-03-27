import { AlertCircle, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { useAnalysis } from "./AnalysisContext";

export function InsightsPanel() {
  const { insights, isLoading } = useAnalysis();

  if (isLoading) {
    return (
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #14213d 0%, #111d34 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-lg bg-accent/10">
            <Lightbulb className="w-4 h-4 text-accent animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">AI Insights</h3>
            <p className="text-xs text-muted-foreground">Generating recommendations...</p>
          </div>
        </div>
        <div className="flex justify-center py-6 text-sm text-muted-foreground">
          Analyzing image data...
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #14213d 0%, #111d34 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-lg bg-accent/10">
            <Lightbulb className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">AI Insights</h3>
            <p className="text-xs text-muted-foreground">Real-time recommendations</p>
          </div>
        </div>
        <div className="flex justify-center py-6 text-sm text-muted-foreground">
          AI insights not available. Please try again.
        </div>
      </div>
    );
  }

  // Determine styles based on severity
  let icon = Lightbulb;
  let iconColor = "#22c55e"; // default low
  let badgeColor = "#22c55e";
  let bg = "rgba(34,197,94,0.07)";
  let border = "rgba(34,197,94,0.2)";

  if (insights.severity === "High") {
    icon = AlertCircle;
    iconColor = badgeColor = "#ef4444";
    bg = "rgba(239,68,68,0.07)";
    border = "rgba(239,68,68,0.2)";
  } else if (insights.severity === "Moderate") {
    icon = AlertTriangle;
    iconColor = badgeColor = "#fbbf24";
    bg = "rgba(251,191,36,0.07)";
    border = "rgba(251,191,36,0.2)";
  } else if (insights.severity === "Early") {
    icon = CheckCircle;
    // Keep default green
  }

  const IconComponent = icon;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "linear-gradient(135deg, #14213d 0%, #111d34 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div
          className="p-2 rounded-lg"
          style={{ background: "rgba(56,189,248,0.12)" }}
        >
          <Lightbulb className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>AI Insights</h3>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Real-time recommendations</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl transition-all"
        style={{
          background: bg,
          border: `1px solid ${border}`,
        }}
      >
        <div className="flex items-start gap-3">
          <IconComponent className="w-5 h-5 mt-0.5 shrink-0" style={{ color: iconColor }} />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{insights.summary}</h4>
              <span
                className="text-xs px-2 py-1 rounded shrink-0 font-medium"
                style={{
                  color: badgeColor,
                  background: `${badgeColor}18`,
                  border: `1px solid ${badgeColor}30`,
                }}
              >
                {insights.severity}
              </span>
            </div>
            
            <div className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {insights.recommendation}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expert CTA */}
      <div
        className="mt-4 p-3.5 rounded-xl"
        style={{
          background: "rgba(56,189,248,0.07)",
          border: "1px solid rgba(56,189,248,0.2)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Need Expert Help?</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Connect with agronomists</p>
          </div>
          <button
            className="px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}
