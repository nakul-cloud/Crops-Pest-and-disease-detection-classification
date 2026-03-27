import { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Header() {
  const [hasNotification] = useState(true);

  return (
    <header
      className="h-14 flex items-center justify-between px-6 shrink-0"
      style={{
        background: "rgba(8, 17, 30, 0.7)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
          style={{ color: "var(--muted-foreground)" }}
        />
        <input
          type="text"
          placeholder="Search detections..."
          className="pl-9 pr-4 py-1.5 rounded-lg text-sm outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--foreground)",
            width: "220px",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/8"
          style={{ color: "var(--muted-foreground)" }}
        >
          <Bell className="w-4 h-4" />
          {hasNotification && (
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary"
            />
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* User */}
        <button className="flex items-center gap-2.5 group">
          <Avatar className="w-8 h-8" style={{ border: "2px solid rgba(34,197,94,0.3)" }}>
            <AvatarFallback
              className="text-xs font-semibold"
              style={{ background: "rgba(34,197,94,0.15)", color: "var(--primary)" }}
            >
              AT
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium leading-tight" style={{ color: "var(--foreground)" }}>
              Dr. Aria Thorne
            </p>
            <p className="text-xs leading-tight" style={{ color: "var(--muted-foreground)" }}>
              Lead Agronomist
            </p>
          </div>
          <ChevronDown
            className="w-3.5 h-3.5 hidden sm:block"
            style={{ color: "var(--muted-foreground)" }}
          />
        </button>
      </div>
    </header>
  );
}
