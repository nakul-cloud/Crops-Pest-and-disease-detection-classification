import { useEffect, useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

const API_BASE = "http://localhost:8000";

/* ─── Types ─────────────────────────────────────────────────── */
interface ClassMetric { class: string; precision: number; recall: number; f1: number; support: number }
interface HistoryPoint { epoch: number; mAP50: number; mAP50_95: number; precision: number; recall: number; box_loss: number; cls_loss: number }
interface PestMetrics  { mAP50: number; mAP50_95: number; precision: number; recall: number; epochs: number }
interface AnalyticsData {
  pest: { confusion_matrix_img: string; pr_curve_img: string; metrics: PestMetrics | null; training_history: HistoryPoint[] | null }
  disease: { confusion_matrix_img: string }
  classification: {
    confusion_matrix_img: string; confusion_matrix: number[][] | null;
    class_names: string[]; report: string; accuracy: string; class_metrics: ClassMetric[]
  }
}

/* ─── Shared styles ─────────────────────────────────────────── */
const card = {
  background: "linear-gradient(135deg, #14213d 0%, #111d34 100%)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "1rem",
  padding: "1.5rem",
};
const tt = {
  backgroundColor: "#0d1629", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", color: "#e2e8f4",
};
const ACCENT  = "#22c55e";
const ACCENT2 = "#38bdf8";
const RED     = "#ef4444";
const YELLOW  = "#fbbf24";

/* ─── Confusion Heatmap (SVG, using top N classes) ─────────── */
function ConfusionHeatmap({ matrix, classNames }: { matrix: number[][]; classNames: string[] }) {
  const N = matrix.length;
  // Limit to first 11 classes for visibility (most interesting ones)
  const SHOW = Math.min(N, 11);
  const slim = matrix.slice(0, SHOW).map(r => r.slice(0, SHOW));
  const names = classNames.slice(0, SHOW).map(n => n.split(" ").slice(-1)[0]); // last word

  const maxVal = Math.max(...slim.flat());
  const cellSize = 34;
  const labelW  = 80;
  const topH    = 80;
  const svgW    = labelW + SHOW * cellSize;
  const svgH    = topH  + SHOW * cellSize;

  function heatColor(v: number) {
    const t = maxVal > 0 ? v / maxVal : 0;
    if (t === 0) return "#0d1629";
    // green gradient: low → dark green, high → bright green
    const r = Math.round(13  + t * (34  - 13));
    const g = Math.round(22  + t * (197 - 22));
    const b = Math.round(41  + t * (94  - 41));
    return `rgb(${r},${g},${b})`;
  }

  return (
    <div className="overflow-x-auto">
      <svg width={svgW} height={svgH} style={{ display: "block", margin: "0 auto" }}>
        {/* Column labels */}
        {names.map((n, j) => (
          <text
            key={j}
            x={labelW + j * cellSize + cellSize / 2}
            y={topH - 4}
            fill="#8899b8" fontSize={9} textAnchor="end"
            transform={`rotate(-45, ${labelW + j * cellSize + cellSize / 2}, ${topH - 4})`}
          >{n}</text>
        ))}
        {/* Rows */}
        {slim.map((row, i) => (
          <g key={i}>
            {/* Row label */}
            <text x={labelW - 4} y={topH + i * cellSize + cellSize / 2 + 3}
              fill="#8899b8" fontSize={9} textAnchor="end">{names[i]}</text>
            {row.map((v, j) => (
              <g key={j}>
                <rect
                  x={labelW + j * cellSize} y={topH + i * cellSize}
                  width={cellSize - 1} height={cellSize - 1}
                  fill={heatColor(v)} rx={2}
                />
                {v > 0 && (
                  <text
                    x={labelW + j * cellSize + cellSize / 2}
                    y={topH + i * cellSize + cellSize / 2 + 4}
                    fill={v / maxVal > 0.4 ? "#fff" : "#8899b8"}
                    fontSize={9} textAnchor="middle">{v}</text>
                )}
              </g>
            ))}
          </g>
        ))}
      </svg>
      <p className="text-xs text-center mt-2" style={{ color: "#8899b8" }}>
        Showing top {SHOW} of {N} classes · Diagonal = correct predictions
      </p>
    </div>
  );
}

/* ─── Classification Report Table ───────────────────────────── */
function ClassTable({ rows }: { rows: ClassMetric[] }) {
  const sorted = [...rows].sort((a, b) => b.f1 - a.f1);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {["Class", "Precision", "Recall", "F1-Score", "Support"].map(h => (
              <th key={h} className="pb-2 pr-3 text-left font-medium" style={{ color: "#8899b8" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => {
            const is_top = i === 0;
            return (
              <tr key={r.class} className="group" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="py-2 pr-3 font-medium" style={{ color: is_top ? ACCENT : "var(--foreground)" }}>
                  {is_top && "🏆 "}{r.class}
                </td>
                <td className="py-2 pr-3" style={{ color: ACCENT2 }}>{(r.precision * 100).toFixed(1)}%</td>
                <td className="py-2 pr-3" style={{ color: YELLOW }}>{(r.recall * 100).toFixed(1)}%</td>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${r.f1 * 100}%`, background: r.f1 > 0.85 ? ACCENT : r.f1 > 0.7 ? YELLOW : RED }} />
                    </div>
                    <span style={{ color: r.f1 > 0.85 ? ACCENT : r.f1 > 0.7 ? YELLOW : RED }}>{(r.f1 * 100).toFixed(1)}%</span>
                  </div>
                </td>
                <td className="py-2" style={{ color: "#8899b8" }}>{r.support}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Stat card ─────────────────────────────────────────────── */
function StatCard({ label, value, color = ACCENT, sub = "" }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <p className="text-xs mb-1" style={{ color: "#8899b8" }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "#8899b8" }}>{sub}</p>}
    </div>
  );
}

/* ─── Section header ────────────────────────────────────────── */
function SectionHead({ dot = ACCENT, children }: { dot?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
      <h4 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{children}</h4>
    </div>
  );
}

/* ─── Classification Tab ────────────────────────────────────── */
function ClassificationTab({ data }: { data: AnalyticsData["classification"] }) {
  const accuracy = useMemo(() => {
    const n = parseFloat(data.accuracy);
    return isNaN(n) ? data.accuracy : (n * 100).toFixed(1) + "%";
  }, [data.accuracy]);

  const topClass = [...data.class_metrics].sort((a, b) => b.f1 - a.f1)[0];
  const worstClass = [...data.class_metrics].sort((a, b) => a.f1 - b.f1)[0];

  const top8 = [...data.class_metrics].sort((a, b) => b.f1 - a.f1).slice(0, 8).map(c => ({
    name: c.class.split(" ").pop(),
    f1: c.f1, precision: c.precision, recall: c.recall
  }));

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Overall Accuracy" value={accuracy} color={ACCENT} />
        <StatCard label="Classes" value={String(data.class_metrics.length)} color={ACCENT2} />
        <StatCard label="Best Class" value={topClass?.class.split(" ").slice(-1)[0] ?? "–"} color={ACCENT} sub={topClass ? `F1 ${(topClass.f1 * 100).toFixed(0)}%` : ""} />
        <StatCard label="Hardest Class" value={worstClass?.class.split(" ").slice(-1)[0] ?? "–"} color={RED} sub={worstClass ? `F1 ${(worstClass.f1 * 100).toFixed(0)}%` : ""} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart: F1 by class */}
        <div style={card}>
          <SectionHead dot={ACCENT}>Per-Class F1 Scores (Top 8)</SectionHead>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={top8} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 1]} stroke="#8899b8" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
              <YAxis type="category" dataKey="name" stroke="#8899b8" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={75} />
              <Tooltip contentStyle={tt} formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#8899b8" }} />
              <Bar dataKey="f1" name="F1" fill={ACCENT} radius={[0, 5, 5, 0]} />
              <Bar dataKey="precision" name="Precision" fill={ACCENT2} radius={[0, 5, 5, 0]} />
              <Bar dataKey="recall" name="Recall" fill={YELLOW} radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Confusion heatmap */}
        <div style={card}>
          <SectionHead dot={ACCENT2}>Confusion Matrix (Interactive Heatmap)</SectionHead>
          {data.confusion_matrix
            ? <ConfusionHeatmap matrix={data.confusion_matrix} classNames={data.class_names} />
            : <p className="text-sm text-muted-foreground">No confusion data</p>}
        </div>
      </div>

      {/* Classification report table */}
      <div style={card}>
        <SectionHead dot={YELLOW}>Full Classification Report</SectionHead>
        {data.class_metrics.length > 0
          ? <ClassTable rows={data.class_metrics} />
          : <pre className="text-xs font-mono" style={{ color: "#8899b8" }}>{data.report}</pre>}
      </div>
    </div>
  );
}

function ModernTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-lg border border-white/10 shadow-2xl backdrop-blur-md" style={{ background: "rgba(13, 22, 41, 0.9)" }}>
        <p className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Epoch {label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: entry.color }} />
                <span className="text-[10px] text-muted-foreground font-medium">{entry.name}</span>
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: entry.color }}>
                {entry.name === "Box Loss" ? entry.value.toFixed(4) : (entry.value * 100).toFixed(1) + "%"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

/* ─── Detection (YOLO) Tab ──────────────────────────────────── */
type DetectionView = "training" | "metrics" | "confusion" | "pr";

function DetectionTab({ model, data }: {
  model: "pest" | "disease";
  data: AnalyticsData;
}) {
  const [view, setView] = useState<DetectionView>("training");

  const yolo = model === "pest" ? data.pest : data.disease as any;
  const imgUrl = yolo?.confusion_matrix_img;
  const prUrl  = yolo?.pr_curve_img;

  // Use full training history (no sampling for better precision)
  const history = yolo?.training_history ?? [];

  const metricsBar = yolo?.metrics ? [
    { metric: "mAP50",     value: yolo.metrics.mAP50 },
    { metric: "mAP50-95",  value: yolo.metrics.mAP50_95 },
    { metric: "Precision", value: yolo.metrics.precision },
    { metric: "Recall",    value: yolo.metrics.recall },
  ] : [];

  const views: { id: DetectionView; label: string }[] = [
    { id: "training",  label: "Training Progress" },
    { id: "metrics",   label: "Metrics Summary" },
    { id: "confusion", label: "Confusion Matrix" },
    ...(prUrl ? [{ id: "pr" as DetectionView, label: "PR Curve" }] : []),
  ];

  return (
    <div className="space-y-5">
      {/* Dropdown */}
      <div className="flex items-center gap-3 flex-wrap">
        {views.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: view === v.id ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
              border: view === v.id ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(255,255,255,0.07)",
              color: view === v.id ? ACCENT : "#8899b8",
            }}
          >{v.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>

          {/* Training Progress */}
          {view === "training" && (
            <div style={card}>
              <SectionHead dot={ACCENT}>
                {model === "pest" ? "Pest" : "Disease"} YOLO — Training Progress (mAP vs Loss)
              </SectionHead>
              {history.length > 0 ? (
                <div className="relative h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gr_map" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis 
                        dataKey="epoch" 
                        stroke="#525252" 
                        tick={{ fontSize: 10 }} 
                        axisLine={false} 
                        tickLine={false}
                        label={{ value: "Epoch", position: "insideBottomRight", offset: -5, fill: "#525252", fontSize: 10 }}
                      />
                      <YAxis 
                        yAxisId="left" 
                        stroke={ACCENT} 
                        tick={{ fontSize: 10 }} 
                        axisLine={false} 
                        tickLine={false} 
                        domain={[0, 1]} 
                        tickFormatter={v => `${(v * 100).toFixed(0)}%`}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke={RED} 
                        tick={{ fontSize: 10 }} 
                        axisLine={false} 
                        tickLine={false} 
                        domain={['auto', 'auto']} 
                      />
                      <Tooltip content={<ModernTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 0 }} />
                      <Area 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="mAP50" 
                        stroke={ACCENT} 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#gr_map)" 
                        name="mAP50" 
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="precision" 
                        stroke={ACCENT2} 
                        strokeWidth={2} 
                        dot={false} 
                        name="Precision" 
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="box_loss" 
                        stroke={RED} 
                        strokeWidth={2} 
                        dot={false} 
                        name="Box Loss" 
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm" style={{ color: "#8899b8" }}>
                  Training data not available.
                </p>
              )}
            </div>
          )}

          {/* Metrics Summary */}
          {view === "metrics" && (
            <div style={card}>
              <SectionHead dot={ACCENT}>Final Performance Metrics</SectionHead>
              {metricsBar.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {metricsBar.map(m => (
                      <StatCard key={m.metric} label={m.metric} value={`${(m.value * 100).toFixed(1)}%`}
                        color={m.value > 0.7 ? ACCENT : m.value > 0.5 ? YELLOW : RED}
                        sub={`${(m.value * 100).toFixed(2)}%`}
                      />
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={metricsBar} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" domain={[0, 1]} stroke="#8899b8" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                      <YAxis type="category" dataKey="metric" stroke="#8899b8" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={72} />
                      <Tooltip contentStyle={tt} formatter={(v: number) => `${(v * 100).toFixed(2)}%`} />
                      <Bar dataKey="value" fill={ACCENT} radius={[0, 6, 6, 0]} name="Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              ) : <p className="text-sm" style={{ color: "#8899b8" }}>Metrics not available.</p>}
            </div>
          )}

          {/* Confusion Matrix — styled image with glass frame */}
          {view === "confusion" && (
            <div style={card}>
              <SectionHead dot={ACCENT2}>Confusion Matrix</SectionHead>
              <a href={`${API_BASE}${imgUrl}`} target="_blank" rel="noopener noreferrer" className="block">
                <img
                  src={`${API_BASE}${imgUrl}`}
                  alt="Confusion Matrix"
                  className="max-h-[500px] mx-auto rounded-xl object-contain hover:scale-[1.01] transition-transform"
                  style={{ border: "1px solid rgba(34,197,94,0.2)", background: "#090f1e" }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </a>
              <p className="text-xs text-center mt-3" style={{ color: "#8899b8" }}>Click to open full size</p>
            </div>
          )}

          {/* PR Curve */}
          {view === "pr" && prUrl && (
            <div style={card}>
              <SectionHead dot={YELLOW}>Precision-Recall Curve</SectionHead>
              <a href={`${API_BASE}${prUrl}`} target="_blank" rel="noopener noreferrer" className="block">
                <img
                  src={`${API_BASE}${prUrl}`}
                  alt="PR Curve"
                  className="max-h-[480px] mx-auto rounded-xl object-contain hover:scale-[1.01] transition-transform"
                  style={{ border: "1px solid rgba(56,189,248,0.2)", background: "#090f1e" }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </a>
              <p className="text-xs text-center mt-3" style={{ color: "#8899b8" }}>Click to open full size</p>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
type Tab = "classification" | "pest" | "disease";

export function AnalyticsSection() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("classification");

  useEffect(() => {
    fetch(`${API_BASE}/analytics`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const tabs: { id: Tab; label: string; dot: string }[] = [
    { id: "classification", label: "🧪 Classification (AlexNet)", dot: ACCENT },
    { id: "pest",           label: "🐛 Pest YOLO",                dot: YELLOW },
    { id: "disease",        label: "🌿 Disease YOLO",             dot: RED },
  ];

  if (loading) return (
    <div className="space-y-6">
      <div style={{ ...card, height: 120 }} className="animate-pulse flex items-center justify-center">
        <span className="text-sm" style={{ color: "#8899b8" }}>Loading analytics…</span>
      </div>
    </div>
  );

  if (error || !data) return (
    <div style={card}>
      <p className="text-sm text-red-400">⚠️ Could not load analytics: {error}. Is the backend running?</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Performance Analytics
        </h3>
        <p className="text-sm" style={{ color: "#8899b8" }}>
          Interactive model evaluation — real data from training runs
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: tab === t.id ? "rgba(34,197,94,0.10)" : "rgba(255,255,255,0.03)",
              border: tab === t.id ? `1px solid ${t.dot}55` : "1px solid rgba(255,255,255,0.07)",
              color: tab === t.id ? t.dot : "#8899b8",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: tab === t.id ? t.dot : "#8899b8" }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {tab === "classification" && <ClassificationTab data={data.classification} />}
          {tab === "pest"           && <DetectionTab model="pest"    data={data} />}
          {tab === "disease"        && <DetectionTab model="disease" data={data} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
