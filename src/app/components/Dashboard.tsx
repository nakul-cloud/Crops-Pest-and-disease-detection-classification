import { OverviewCards } from "./OverviewCards";
import { ImageUploadSection } from "./ImageUploadSection";
import { DetectionOutput } from "./DetectionOutput";
import { CroppedRegions } from "./CroppedRegions";
import { AnalyticsSection } from "./AnalyticsSection";
import { InsightsPanel } from "./InsightsPanel";
import { FutureScope } from "./FutureScope";
import { AnalysisProvider } from "./AnalysisContext";

export function Dashboard() {
  return (
    <AnalysisProvider>
    <div className="space-y-6">
      {/* Overview Cards */}
      <OverviewCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload & Detection */}
        <div className="lg:col-span-2 space-y-6">
          <ImageUploadSection />
          <DetectionOutput />
          <CroppedRegions />
        </div>

        {/* Right Column - Analytics & Future Scope */}
        <div className="space-y-6">
          <FutureScope />
        </div>
      </div>

      {/* Analytics Section */}
      <AnalyticsSection />
    </div>
    </AnalysisProvider>
  );
}
