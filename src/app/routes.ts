import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { PestDetection } from "./components/PestDetection";
import { DiseaseDetection } from "./components/DiseaseDetection";
import { Classification } from "./components/Classification";
import { FullPipeline } from "./components/FullPipeline";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "pest-detection", Component: PestDetection },
      { path: "disease-detection", Component: DiseaseDetection },
      { path: "classification", Component: Classification },
      { path: "full-pipeline", Component: FullPipeline },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);
