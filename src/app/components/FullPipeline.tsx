import { Workflow, GitBranch, CheckCircle2 } from "lucide-react";
import { ImageUploadSection } from "./ImageUploadSection";
import { DetectionOutput } from "./DetectionOutput";
import { CroppedRegions } from "./CroppedRegions";
import { InsightsPanel } from "./InsightsPanel";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { AnalysisProvider } from "./AnalysisContext";

const pipelineSteps = [
  {
    id: 1,
    name: "Image Upload",
    status: "completed",
    time: "0.1s",
    icon: CheckCircle2,
  },
  {
    id: 2,
    name: "Preprocessing",
    status: "completed",
    time: "0.3s",
    icon: CheckCircle2,
  },
  {
    id: 3,
    name: "Pest Detection",
    status: "completed",
    time: "1.2s",
    icon: CheckCircle2,
  },
  {
    id: 4,
    name: "Disease Detection",
    status: "completed",
    time: "1.4s",
    icon: CheckCircle2,
  },
  {
    id: 5,
    name: "Classification",
    status: "completed",
    time: "0.8s",
    icon: CheckCircle2,
  },
  {
    id: 6,
    name: "Report Generation",
    status: "processing",
    time: "...",
    icon: GitBranch,
  },
];

export function FullPipeline() {
  return (
    <AnalysisProvider>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">
            Full Pipeline
          </h1>
          <p className="text-muted-foreground">
            Complete detection + classification workflow
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30">
          <Workflow className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">
            Pipeline Running
          </span>
        </div>
      </div>

      {/* Pipeline Flow */}
      <div className="rounded-2xl bg-card border border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4">
          Processing Pipeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {pipelineSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-xl border transition-all ${
                step.status === "completed"
                  ? "bg-primary/10 border-primary/30"
                  : "bg-accent/10 border-accent/30 animate-pulse"
              }`}
            >
              {/* Connector Line */}
              {index < pipelineSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-white/20" />
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step.status === "completed"
                      ? "bg-primary/20"
                      : "bg-accent/20"
                  }`}
                >
                  <step.icon
                    className={`w-5 h-5 ${
                      step.status === "completed" ? "text-primary" : "text-accent"
                    }`}
                  />
                </div>
                <p className="text-xs font-medium text-white mb-1">
                  {step.name}
                </p>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    step.status === "completed"
                      ? "border-primary/30 text-primary"
                      : "border-accent/30 text-accent"
                  }`}
                >
                  {step.time}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                Total Processing Time
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Average across all stages
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-primary">3.8s</p>
              <p className="text-xs text-muted-foreground">Per image</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ImageUploadSection />
          <DetectionOutput />
          <CroppedRegions />
        </div>

        <div className="space-y-6">
          {/* Pipeline Stats */}
          <div className="rounded-2xl bg-card border border-white/10 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">
              Pipeline Performance
            </h3>
            <div className="space-y-4">
              {[
                { label: "Images Processed", value: "2,847" },
                { label: "Success Rate", value: "98.4%" },
                { label: "Avg. Accuracy", value: "94.2%" },
                { label: "Queue Time", value: "< 1s" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Benefits */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">
              Pipeline Benefits
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  Complete analysis in one workflow
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  Automated report generation
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  Multiple detection models combined
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  Real-time processing and alerts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AnalysisProvider>
  );
}
