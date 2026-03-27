import { NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Bug, 
  Sprout, 
  ScanLine, 
  Workflow, 
  FileText, 
  Settings as SettingsIcon,
  Leaf
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/pest-detection", icon: Bug, label: "Pest Detection" },
  { to: "/disease-detection", icon: Sprout, label: "Disease Detection" },
  { to: "/classification", icon: ScanLine, label: "Classification" },
  { to: "/full-pipeline", icon: Workflow, label: "Full Pipeline" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/settings", icon: SettingsIcon, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="w-60 flex flex-col border-r" style={{ background: "var(--sidebar)", borderColor: "var(--sidebar-border)" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)" }}>
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold" style={{ color: "var(--sidebar-foreground)" }}>CropAI</h1>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Smart Agriculture</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-[#8899b8] hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-white" : "text-[#8899b8] group-hover:text-white"}`} style={{ width: "1.1rem", height: "1.1rem" }} />
                <span className="text-sm font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="px-3 py-3 rounded-xl" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--sidebar-foreground)" }}>System Status</p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <p className="text-xs text-primary">All Models Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
