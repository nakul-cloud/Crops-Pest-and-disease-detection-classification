import { Plane, Radio, Satellite, Smartphone } from "lucide-react";

const features = [
  {
    icon: Plane,
    title: "Drone Integration",
    description: "Aerial crop monitoring",
  },
  {
    icon: Radio,
    title: "Real-time Updates",
    description: "Live detection alerts",
  },
  {
    icon: Satellite,
    title: "Satellite Data",
    description: "Multi-spectral analysis",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Field scanning tool",
  },
];

export function FutureScope() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(56,189,248,0.06) 50%, rgba(168,85,247,0.06) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Future Enhancements</h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Coming soon to CropAI
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-3 rounded-xl transition-all group cursor-default"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,197,94,0.25)";
              (e.currentTarget as HTMLElement).style.background = "rgba(34,197,94,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
            }}
          >
            <div className="mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.12)" }}
              >
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <h4 className="text-xs font-medium mb-0.5" style={{ color: "var(--foreground)" }}>
              {feature.title}
            </h4>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-3 p-2.5 rounded-lg text-center"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Request beta access for upcoming features
        </p>
      </div>
    </div>
  );
}