import { Maximize2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

const croppedRegions = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&h=300&fit=crop",
    class: "Aphid",
    confidence: 0.92,
    color: "#fbbf24",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop",
    class: "Leaf Blight",
    confidence: 0.87,
    color: "#ef4444",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=300&h=300&fit=crop",
    class: "Healthy",
    confidence: 0.95,
    color: "#22c55e",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=300&h=300&fit=crop",
    class: "Powdery Mildew",
    confidence: 0.84,
    color: "#f59e0b",
  },
];

export function CroppedRegions() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, #14213d 0%, #111d34 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Cropped Regions</h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Individual detections classified by AI
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {croppedRegions.map((region, index) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className="group relative rounded-xl overflow-hidden transition-all"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={region.image}
                alt={region.class}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-center">
                <button className="p-1.5 rounded-full backdrop-blur-sm transition-colors" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <Maximize2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                  {region.class}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ color: region.color, background: `${region.color}18`, border: `1px solid ${region.color}30` }}
                >
                  {Math.round(region.confidence * 100)}%
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${region.confidence * 100}%`, backgroundColor: region.color }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}