import { Sprout, Activity, AlertCircle } from "lucide-react";
import { ImageUploadSection } from "./ImageUploadSection";
import { DetectionOutput } from "./DetectionOutput";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { AnalysisProvider } from "./AnalysisContext";

const diseaseStats = [
  { label: "Total Diseases", value: "342", trend: "+8.2%", icon: Sprout },
  { label: "Most Common", value: "Blight", trend: "+12%", icon: Activity },
  { label: "Severe Cases", value: "23", trend: "+5", icon: AlertCircle },
];

const recentDiseases = [
  { name: "Leaf Blight", count: 89, severity: "High", color: "#ef4444" },
  { name: "Powdery Mildew", count: 67, severity: "Medium", color: "#f59e0b" },
  { name: "Rust Disease", count: 54, severity: "High", color: "#ef4444" },
  { name: "Leaf Spot", count: 43, severity: "Medium", color: "#f59e0b" },
  { name: "Root Rot", count: 28, severity: "Critical", color: "#dc2626" },
];

export function DiseaseDetection() {
  return (
    <AnalysisProvider>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">
            Disease Detection
          </h1>
          <p className="text-muted-foreground">
            YOLO-based plant disease identification and diagnosis
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-400/10 border border-red-400/30">
          <Sprout className="w-5 h-5 text-red-400" />
          <span className="text-sm font-medium text-red-400">
            Disease Detection Active
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {diseaseStats.map((stat, index) => (
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
                <p className="text-sm text-red-400">{stat.trend} this week</p>
              </div>
              <div className="p-3 rounded-xl bg-red-400/20">
                <stat.icon className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ImageUploadSection />
          <DetectionOutput />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Detections */}
          <div className="rounded-2xl bg-card border border-white/10 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">
              Disease Distribution
            </h3>
            <div className="space-y-3">
              {recentDiseases.map((disease, index) => (
                <motion.div
                  key={disease.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: disease.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {disease.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {disease.count} cases
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: disease.color,
                      color: disease.color,
                    }}
                    className="text-xs"
                  >
                    {disease.severity}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Treatment Protocol */}
          <div className="rounded-2xl bg-gradient-to-br from-red-400/10 to-orange-500/10 border border-red-400/30 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">
              Treatment Protocol
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                <p className="text-sm text-gray-300">
                  Isolate infected plants immediately
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                <p className="text-sm text-gray-300">
                  Apply copper-based fungicides
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                <p className="text-sm text-gray-300">
                  Improve air circulation and drainage
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                <p className="text-sm text-gray-300">
                  Monitor closely for 2-3 weeks
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
