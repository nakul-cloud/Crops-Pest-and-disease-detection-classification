import { ScanLine, Grid3x3, Layers } from "lucide-react";
import { ImageUploadSection } from "./ImageUploadSection";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { motion } from "motion/react";
import { AnalysisProvider, useAnalysis } from "./AnalysisContext";
import { ClassificationResultBanner } from "./ClassificationResultBanner";

const classStats = [
  { label: "Total Classes", value: "15", trend: "Active", icon: Grid3x3 },
  { label: "Model Type", value: "AlexNet", trend: "CNN", icon: Layers },
  { label: "Accuracy", value: "82.9%", trend: "", icon: ScanLine },
];

const exampleClassifications = [
  { class: "Tomato Leaf", confidence: 0.98, color: "#22c55e" },
  { class: "Corn Leaf", confidence: 0.95, color: "#10b981" },
  { class: "Wheat Leaf", confidence: 0.92, color: "#14b8a6" },
  { class: "Potato Leaf", confidence: 0.89, color: "#06b6d4" },
  { class: "Rice Leaf", confidence: 0.87, color: "#0ea5e9" },
  { class: "Soybean Leaf", confidence: 0.84, color: "#3b82f6" },
  { class: "Cotton Leaf", confidence: 0.82, color: "#6366f1" },
  { class: "Lettuce Leaf", confidence: 0.79, color: "#8b5cf6" },
];

function ClassificationResultsPanel() {
  const { classification, isLoading } = useAnalysis();
  return (
    <div className="rounded-2xl bg-card border border-white/10 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">
        Classification Results
      </h3>

      {isLoading && (
        <div className="mb-4 text-sm text-primary animate-pulse">Classifying…</div>
      )}
      {classification && (
        <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30">
          <p className="text-xs text-muted-foreground mb-1">Top Prediction</p>
          <p className="text-xl font-bold text-accent">{classification.class}</p>
          <Progress value={classification.confidence * 100} className="h-2 mt-2 bg-white/10" />
          <p className="text-xs text-muted-foreground mt-1">{Math.round(classification.confidence * 100)}% confidence</p>
        </div>
      )}

      <div className="space-y-4">
        {exampleClassifications.map((item, index) => (
          <motion.div
            key={item.class}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-white">
                  {item.class}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round(item.confidence * 100)}%
              </span>
            </div>
            <Progress
              value={item.confidence * 100}
              className="h-2 bg-white/10"
              style={
                {
                  "--progress-background": item.color,
                } as React.CSSProperties
              }
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <Layers className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-1">
              Model Architecture
            </h4>
            <p className="text-xs text-muted-foreground">
              AlexNet CNN with 5 convolutional layers and 3 fully connected
              layers for optimal classification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Classification() {
  return (
    <AnalysisProvider>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">
            Crop Classification
          </h1>
          <p className="text-muted-foreground">
            AlexNet/CNN-based crop and leaf classification
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30">
          <ScanLine className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-accent">
            Classification Active
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl bg-card border border-white/10 p-6 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <h3 className="text-3xl font-semibold text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-accent">{stat.trend}</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/20">
                <stat.icon className="w-6 h-6 text-accent" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ImageUploadSection />
          {/* 🔥 FINAL RESULT BANNER — appears below upload area after analysis */}
          <ClassificationResultBanner />
        </div>

        {/* Classification Results */}
        <ClassificationResultsPanel />
      </div>

      {/* Class Distribution */}
      <div className="rounded-2xl bg-card border border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4">
          Class Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {exampleClassifications.map((item, index) => (
            <motion.div
              key={item.class}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all text-center"
            >
              <div
                className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <p className="text-xs font-medium text-white mb-1">
                {item.class.split(" ")[0]}
              </p>
              <Badge
                variant="outline"
                style={{ borderColor: item.color, color: item.color }}
                className="text-xs"
              >
                {Math.round(item.confidence * 100)}%
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </AnalysisProvider>
  );
}
