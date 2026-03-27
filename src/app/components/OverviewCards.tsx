import { Activity, Bug, Sprout, Target } from "lucide-react";
import { motion } from "motion/react";

const stats = [
  {
    title: "Total Detections",
    value: "1,247",
    change: "+12.5%",
    changeLabel: "from last month",
    icon: Activity,
    color: "text-primary",
    iconBg: "rgba(34,197,94,0.12)",
    iconColor: "#22c55e",
    accentColor: "rgba(34,197,94,0.6)",
  },
  {
    title: "Diseases Detected",
    value: "342",
    change: "+8.2%",
    changeLabel: "from last month",
    icon: Sprout,
    color: "text-red-400",
    iconBg: "rgba(239,68,68,0.12)",
    iconColor: "#ef4444",
    accentColor: "rgba(239,68,68,0.6)",
  },
  {
    title: "Pests Detected",
    value: "189",
    change: "-3.1%",
    changeLabel: "from last month",
    icon: Bug,
    color: "text-yellow-400",
    iconBg: "rgba(251,191,36,0.12)",
    iconColor: "#fbbf24",
    accentColor: "rgba(251,191,36,0.6)",
  },
  {
    title: "Accuracy (mAP50-95)",
    value: "94.3%",
    change: "+2.1%",
    changeLabel: "from last month",
    icon: Target,
    color: "text-accent",
    iconBg: "rgba(56,189,248,0.12)",
    iconColor: "#38bdf8",
    accentColor: "rgba(56,189,248,0.6)",
  },
];

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl p-5 group cursor-default"
          style={{
            background: "linear-gradient(135deg, #14213d 0%, #111d34 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = `${stat.accentColor}`;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${stat.accentColor}22`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(90deg, transparent, ${stat.iconColor}, transparent)` }}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className="p-2.5 rounded-xl"
              style={{ background: stat.iconBg }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.iconColor }} />
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: stat.change.startsWith('+') ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                color: stat.change.startsWith('+') ? "#22c55e" : "#ef4444",
                border: `1px solid ${stat.change.startsWith('+') ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}
            >
              {stat.change}
            </span>
          </div>

          <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{stat.title}</p>
          <h3 className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{stat.value}</h3>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{stat.changeLabel}</p>
        </motion.div>
      ))}
    </div>
  );
}
