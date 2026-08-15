const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../src/app/(app)/dashboard/page.tsx"
);
let s = fs.readFileSync(filePath, "utf8");

const metricsStart = s.indexOf("// Données des métriques");
const navStart = s.indexOf("const navigation = [");
const kpiStart = s.indexOf("{/* KPI Cards */}");
const mainEnd = s.lastIndexOf("</main>");

if (metricsStart === -1 || navStart === -1 || kpiStart === -1 || mainEnd === -1) {
  console.error("markers missing", { metricsStart, navStart, kpiStart, mainEnd });
  process.exit(1);
}

const metricsBlock = s.slice(metricsStart, navStart);
const kpiBlock = s.slice(kpiStart, mainEnd);

const out = `"use client";

import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronRight,
  DollarSign,
  MoreVertical,
  Plus,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

${metricsBlock}
  if (isLoading) {
    return (
      <motion.div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative mx-auto h-16 w-16">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
          </div>
          <p className="mt-4 font-medium text-gray-300">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="24h" className="bg-slate-900">Dernières 24h</option>
          <option value="7d" className="bg-slate-900">7 derniers jours</option>
          <option value="30d" className="bg-slate-900">30 derniers jours</option>
          <option value="90d" className="bg-slate-900">90 derniers jours</option>
        </select>
      </div>
          ${kpiBlock}
    </motion.div>
  );
}
`;

const themed = out
  .replace(/bg-white\/80 backdrop-blur border border-slate-200/g, "glass-panel")
  .replace(/border-slate-200/g, "border-white/10")
  .replace(/text-slate-900/g, "text-white")
  .replace(/text-slate-700/g, "text-gray-300")
  .replace(/text-slate-600/g, "text-gray-300")
  .replace(/text-slate-500/g, "text-gray-400")
  .replace(/hover:bg-slate-50/g, "hover:bg-white/10")
  .replace(/motion\.div/g, "div");

fs.writeFileSync(filePath, themed);
console.log("Dashboard refactored");
