import { useEffect, useState } from "react";
import { FileText, Download, TrendingUp, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AnalyticsSection } from "./AnalyticsSection";
import { motion } from "motion/react";

const API_BASE = "http://localhost:8000";

const reports = [
  {
    id: "RPT-0001",
    title: "Pest Detection Confusion Matrix",
    type: "Confusion Matrix",
    date: "Mar 22, 2026",
    status: "ready",
  },
  {
    id: "RPT-0002",
    title: "Disease Detection PR Curve",
    type: "Pr Curve",
    date: "Mar 22, 2026",
    status: "ready",
  },
  {
    id: "RPT-0003",
    title: "AlexNet Classification Results",
    type: "Classification",
    date: "Mar 21, 2026",
    status: "ready",
  },
  {
    id: "RPT-0004",
    title: "Full Pipeline Evaluation",
    type: "Pipeline",
    date: "Mar 20, 2026",
    status: "critical",
  },
  {
    id: "RPT-0005",
    title: "Weekly mAP Performance",
    type: "Weekly",
    date: "Mar 16, 2026",
    status: "ready",
  },
];

const exportFormats = [
  { name: "PDF Report", icon: "📄", format: "pdf" },
  { name: "Excel Spreadsheet", icon: "📊", format: "xlsx" },
  { name: "JSON Data", icon: "💾", format: "json" },
  { name: "CSV Export", icon: "📋", format: "csv" },
];

const cardStyle = {
  background: "linear-gradient(135deg, #14213d 0%, #111d34 100%)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "1rem",
  padding: "1.5rem",
};

export function Reports() {
  const [accuracy, setAccuracy] = useState("…");

  useEffect(() => {
    fetch(`${API_BASE}/analytics`)
      .then((r) => r.json())
      .then((d) => {
        const raw = d?.classification?.accuracy ?? "";
        const num = parseFloat(raw);
        setAccuracy(isNaN(num) ? raw : (num * 100).toFixed(1) + "%");
      })
      .catch(() => setAccuracy("N/A"));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
            Model Analytics &amp; Reports
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Deep dive into model performance metrics and historical data.
          </p>
        </div>
        <Button
          className="gap-2 text-white text-sm"
          style={{ background: "var(--primary)" }}
        >
          <Download className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Reports Generated", value: "127", icon: FileText },
          { label: "Total Exports", value: "342", icon: Download },
          { label: "AlexNet Accuracy", value: accuracy, icon: TrendingUp },
          { label: "Last Report", value: "Mar 22, 2026", icon: Calendar },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            style={cardStyle}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ background: "rgba(34,197,94,0.12)" }}
              >
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{stat.label}</p>
                <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <AnalyticsSection />

      {/* Reports Log Table */}
      <div style={cardStyle}>
        <h3 className="text-base font-semibold mb-5" style={{ color: "var(--foreground)" }}>
          Generated Reports Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["ID", "TITLE", "TYPE", "DATE GENERATED", "ACTION"].map((h) => (
                  <th
                    key={h}
                    className="text-left pb-3 pr-4"
                    style={{ color: "var(--muted-foreground)", fontSize: "0.7rem", letterSpacing: "0.05em" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className="group"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td className="py-3.5 pr-4">
                    <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                      {report.id}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 shrink-0 text-primary" />
                      <span style={{ color: "var(--foreground)" }}>{report.title}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "var(--muted-foreground)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      {report.type}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4" style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>
                    {report.date}
                  </td>
                  <td className="py-3.5">
                    <button
                      className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div style={cardStyle}>
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Export Formats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {exportFormats.map((format, index) => (
            <motion.button
              key={format.format}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              className="p-4 rounded-xl text-center transition-all"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,197,94,0.3)";
                (e.currentTarget as HTMLElement).style.background = "rgba(34,197,94,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <div className="text-2xl mb-2">{format.icon}</div>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{format.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>.{format.format}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
