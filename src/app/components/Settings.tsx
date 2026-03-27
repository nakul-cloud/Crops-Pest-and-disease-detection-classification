import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, Zap, Sliders, RefreshCw } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { motion } from "motion/react";
import { toast } from "sonner";

interface DetectionSettings {
  conf: number;
  iou: number;
  max_det: number;
}

interface AllSettings {
  pest: DetectionSettings;
  disease: DetectionSettings;
}

const API_BASE = "http://localhost:8000";

const defaultSettings: AllSettings = {
  pest: { conf: 0.5, iou: 0.45, max_det: 3 },
  disease: { conf: 0.5, iou: 0.45, max_det: 3 }
};

export function Settings() {
  const [settings, setSettings] = useState<AllSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/detection`);
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/settings/detection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success("Settings applied successfully", {
          description: "Detection parameters have been updated on the backend.",
          duration: 3000
        });
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      toast.error("Error connecting to backend");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast.info("Settings reset to default values");
  };

  const updateSetting = (model: "pest" | "disease", key: keyof DetectionSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [model]: {
        ...prev[model],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your CropAI detection system
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="border-white/10 text-white hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Detection Parameters Section */}
      <div className="rounded-2xl bg-card border border-white/10 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-yellow-500/20">
            <Sliders className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Detection Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pest Panel */}
          <div className="space-y-6 p-4 rounded-xl bg-white/5 border border-white/5">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">A. Pest Detection Settings</h4>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm text-white">Confidence Threshold</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{settings.pest.conf.toFixed(2)}</span>
                </div>
                <Slider 
                  value={[settings.pest.conf]} 
                  min={0.1} 
                  max={1.0} 
                  step={0.05} 
                  onValueChange={([val]) => updateSetting("pest", "conf", val)} 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm text-white">IoU Threshold</label>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{settings.pest.iou.toFixed(2)}</span>
                </div>
                <Slider 
                  value={[settings.pest.iou]} 
                  min={0.1} 
                  max={1.0} 
                  step={0.05} 
                  onValueChange={([val]) => updateSetting("pest", "iou", val)} 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm text-white">Max Detections</label>
                </div>
                <Input 
                  type="number" 
                  min={1} 
                  max={10} 
                  value={settings.pest.max_det} 
                  onChange={(e) => updateSetting("pest", "max_det", parseInt(e.target.value) || 1)}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          {/* Disease Panel */}
          <div className="space-y-6 p-4 rounded-xl bg-white/5 border border-white/5">
            <h4 className="text-sm font-bold text-accent uppercase tracking-wider">B. Disease Detection Settings</h4>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm text-white">Confidence Threshold</label>
                  <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">{settings.disease.conf.toFixed(2)}</span>
                </div>
                <Slider 
                  value={[settings.disease.conf]} 
                  min={0.1} 
                  max={1.0} 
                  step={0.05} 
                  onValueChange={([val]) => updateSetting("disease", "conf", val)} 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm text-white">IoU Threshold</label>
                  <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">{settings.disease.iou.toFixed(2)}</span>
                </div>
                <Slider 
                  value={[settings.disease.iou]} 
                  min={0.1} 
                  max={1.0} 
                  step={0.05} 
                  onValueChange={([val]) => updateSetting("disease", "iou", val)} 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm text-white">Max Detections</label>
                </div>
                <Input 
                  type="number" 
                  min={1} 
                  max={10} 
                  value={settings.disease.max_det} 
                  onChange={(e) => updateSetting("disease", "max_det", parseInt(e.target.value) || 1)}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Configuration */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/20">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Active AI Model
            </h3>
            <p className="text-sm text-muted-foreground">
              Current detection model configuration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Model Version", value: "YOLOv8-nano", color: "text-primary" },
            { label: "Last Updated", value: "March 15, 2026", color: "text-accent" },
            { label: "Total Parameters", value: "3.2M", color: "text-yellow-400" },
            { label: "Model Size", value: "89.4 MB", color: "text-green-400" },
          ].map((info, index) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <p className="text-xs text-muted-foreground mb-1">{info.label}</p>
              <p className={`text-sm font-semibold ${info.color}`}>
                {info.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="rounded-2xl bg-card border border-white/10 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/20">
            <Palette className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Appearance
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "Dark (Default)", value: "dark", active: true },
            { name: "Light", value: "light", active: false },
            { name: "System", value: "system", active: false },
          ].map((theme) => (
            <button
              key={theme.value}
              className={`p-4 rounded-xl border transition-all ${
                theme.active
                  ? "bg-primary/10 border-primary/30 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              <div className="text-center">
                <p className="text-sm font-medium">{theme.name}</p>
                {theme.active && (
                  <Badge className="mt-2 bg-primary text-white text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl bg-red-500/10 border border-red-400/30 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-red-100 mb-2">
          Danger Zone
        </h3>
        <p className="text-sm text-red-200/60 mb-4">
          Irreversible actions that affect your account and data
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="border-red-400/30 text-red-400 hover:bg-red-400/10"
          >
            Clear All Data
          </Button>
          <Button
            variant="outline"
            className="border-red-400/30 text-red-400 hover:bg-red-400/10"
            onClick={handleReset}
          >
            Reset Settings
          </Button>
          <Button
            variant="outline"
            className="border-red-400/30 text-red-400 hover:bg-red-400/10"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
