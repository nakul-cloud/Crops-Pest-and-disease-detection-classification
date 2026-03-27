import { Bug, TrendingUp, AlertTriangle } from "lucide-react";
import { ImageUploadSection } from "./ImageUploadSection";
import { DetectionOutput } from "./DetectionOutput";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { AnalysisProvider } from "./AnalysisContext";

const pestStats = [
  { label: "Total Pests", value: "189", trend: "-3.1%", icon: Bug },
  { label: "Most Common", value: "Aphids", trend: "+5.2%", icon: TrendingUp },
  { label: "Critical", value: "12", trend: "+2", icon: AlertTriangle },
];

const recentPests = [
  { name: "Aphids", count: 45, severity: "High", color: "#fbbf24" },
  { name: "Whiteflies", count: 32, severity: "Medium", color: "#f59e0b" },
  { name: "Spider Mites", count: 28, severity: "High", color: "#ef4444" },
  { name: "Leaf Miners", count: 19, severity: "Low", color: "#10b981" },
  { name: "Thrips", count: 15, severity: "Medium", color: "#f59e0b" },
];

export function PestDetection() {
  return (
    <AnalysisProvider>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">
            Pest Detection
          </h1>
          <p className="text-muted-foreground">
            YOLO-based pest identification and monitoring
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
          <Bug className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-400">
            Pest Detection Active
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pestStats.map((stat, index) => (
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
                <p
                  className={`text-sm ${
                    stat.trend.startsWith("+") ? "text-red-400" : "text-primary"
                  }`}
                >
                  {stat.trend} this week
                </p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-400/20">
                <stat.icon className="w-6 h-6 text-yellow-400" />
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
              Pest Distribution
            </h3>
            <div className="space-y-3">
              {recentPests.map((pest, index) => (
                <motion.div
                  key={pest.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pest.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {pest.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pest.count} detections
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: pest.color,
                      color: pest.color,
                    }}
                    className="text-xs"
                  >
                    {pest.severity}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Treatment Guide */}
          <div className="rounded-2xl bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">
              Treatment Guide
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                <p className="text-sm text-gray-300">
                  Apply neem oil spray for aphids
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                <p className="text-sm text-gray-300">
                  Use yellow sticky traps for whiteflies
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                <p className="text-sm text-gray-300">
                  Introduce beneficial predators
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
