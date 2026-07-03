"use client";

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

  // Données des métriques avec classes Tailwind explicites
  const metrics = [
    {
      id: "revenue",
      title: "Revenus",
      value: "$124,563",
      change: 12.5,
      trend: "up",
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      barBg: "bg-emerald-200",
      barBgHover: "group-hover:bg-emerald-300",
      chart: [45, 52, 48, 58, 63, 68, 75, 82, 78, 85, 92, 98],
    },
    {
      id: "appointments",
      title: "Rendez-vous",
      value: "847",
      change: 8.2,
      trend: "up",
      icon: Calendar,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      barBg: "bg-blue-200",
      barBgHover: "group-hover:bg-blue-300",
      chart: [28, 32, 35, 31, 38, 42, 45, 48, 44, 51, 55, 58],
    },
    {
      id: "customers",
      title: "Clients",
      value: "2,847",
      change: 15.3,
      trend: "up",
      icon: Users,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      barBg: "bg-violet-200",
      barBgHover: "group-hover:bg-violet-300",
      chart: [120, 135, 142, 158, 165, 172, 188, 195, 202, 218, 225, 242],
    },
    {
      id: "satisfaction",
      title: "Satisfaction",
      value: "98.2%",
      change: -0.5,
      trend: "down",
      icon: Target,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      barBg: "bg-blue-200",
      barBgHover: "group-hover:bg-blue-300",
      chart: [
        98.5, 98.7, 98.6, 98.8, 98.4, 98.2, 98.3, 98.1, 98.5, 98.3, 98.2, 98.2,
      ],
    },
  ];

  // Services populaires
  const popularServices = [
    { name: "Vidange", count: 342, percentage: 35, color: "bg-emerald-500" },
    { name: "Révision", count: 286, percentage: 29, color: "bg-blue-500" },
    { name: "Diagnostic", count: 195, percentage: 20, color: "bg-violet-500" },
    { name: "Freinage", count: 156, percentage: 16, color: "bg-blue-500" },
  ];

  // Activités récentes
  const activities = [
    {
      id: 1,
      type: "appointment",
      title: "Nouveau rendez-vous",
      description: "Contrôle technique - Mercedes Classe C",
      time: "Il y a 2 min",
      user: "Marie Dubois",
      avatar: "MD",
      status: "new",
    },
    {
      id: 2,
      type: "repair",
      title: "Réparation terminée",
      description: "Changement pneus - BMW X3",
      time: "Il y a 15 min",
      user: "Thomas Bernard",
      avatar: "TB",
      status: "completed",
    },
    {
      id: 3,
      type: "payment",
      title: "Paiement reçu",
      description: "Facture #F2024-0847 - $650",
      time: "Il y a 1h",
      user: "Système",
      avatar: "SY",
      status: "success",
    },
    {
      id: 4,
      type: "alert",
      title: "Stock faible",
      description: "Huile moteur 5W30 - 3 unités restantes",
      time: "Il y a 2h",
      user: "Système",
      avatar: "SY",
      status: "warning",
    },
  ];

  // Rendez-vous du jour
  const todayAppointments = [
    {
      id: 1,
      time: "09:00",
      duration: "45min",
      client: "Sophie Martin",
      vehicle: "Audi A3",
      service: "Vidange",
      mechanic: "Alex",
      priority: "normal",
      status: "confirmed",
    },
    {
      id: 2,
      time: "10:30",
      duration: "2h",
      client: "Pierre Durand",
      vehicle: "Peugeot 308",
      service: "Révision complète",
      mechanic: "Lucas",
      priority: "high",
      status: "confirmed",
    },
    {
      id: 3,
      time: "14:00",
      duration: "1h30",
      client: "Isabelle Petit",
      vehicle: "Renault Clio",
      service: "Diagnostic électronique",
      mechanic: "Thomas",
      priority: "normal",
      status: "pending",
    },
  ];

  // Performance des mécaniciens
  const mechanicsPerformance = [
    { name: "Alex", repairs: 45, satisfaction: 99, efficiency: 95 },
    { name: "Lucas", repairs: 38, satisfaction: 98, efficiency: 92 },
    { name: "Thomas", repairs: 42, satisfaction: 97, efficiency: 88 },
    { name: "Marc", repairs: 35, satisfaction: 96, efficiency: 85 },
  ];

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
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
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div
                key={metric.id}
                className="glass-panel rounded-3xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl ${metric.iconBg} group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg`}
                  >
                    <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                  </div>
                  <div
                    className={`flex items-center text-sm font-bold px-2 py-1 rounded-full ${
                      metric.trend === "up"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-2">
                  {metric.value}
                </h3>
                <p className="text-sm font-bold text-gray-300">
                  {metric.title}
                </p>

                {/* Mini Chart */}
                <div className="mt-6 h-16 flex items-end space-x-1">
                  {metric.chart.map((value, index) => (
                    <div
                      key={index}
                      className={`flex-1 ${metric.barBg} ${metric.barBgHover} rounded-t-lg transition-all duration-300 hover:opacity-80`}
                      style={{ height: `${(value / 100) * 100}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div
              className="xl:col-span-2 glass-panel rounded-3xl p-6 animate-slideUp"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">
                  Évolution des revenus
                </h2>
                <div className="flex items-center space-x-2">
                  {["jour", "semaine", "mois"].map((period) => (
                    <button
                      key={period}
                      className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                        period === "semaine"
                          ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 border border-blue-200/50 shadow-sm"
                          : "text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-80 flex items-end justify-between space-x-2">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                  (day, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center group"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-y-110"
                        style={{ height: `${Math.random() * 40 + 60}%` }}
                      ></div>
                      <span className="text-xs text-gray-400 mt-2 font-medium">
                        {day}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Services Distribution */}
            <div
              className="glass-panel rounded-3xl p-6 animate-slideUp"
              style={{ animationDelay: "0.5s" }}
            >
              <h2 className="text-2xl font-black text-white mb-6">
                Services
              </h2>
              <div className="space-y-4">
                {popularServices.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group hover:bg-white/10 p-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full ${service.color} group-hover:scale-125 transition-transform`}
                      ></div>
                      <span className="text-sm font-bold text-gray-300">
                        {service.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-black text-white">
                        {service.count}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        ({service.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pie Chart Placeholder */}
              <div className="mt-8 relative h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">979</p>
                    <p className="text-xs text-gray-400 font-semibold">
                      Total services
                    </p>
                  </div>
                </div>
                <svg className="w-48 h-48 mx-auto transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="#e2e8f0"
                    strokeWidth="20"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="#10b981"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 84 * 0.35} ${2 * Math.PI * 84}`}
                    className="drop-shadow-sm"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 84 * 0.29} ${2 * Math.PI * 84}`}
                    strokeDashoffset={`-${2 * Math.PI * 84 * 0.35}`}
                    className="drop-shadow-sm"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="#8b5cf6"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 84 * 0.2} ${2 * Math.PI * 84}`}
                    strokeDashoffset={`-${2 * Math.PI * 84 * 0.64}`}
                    className="drop-shadow-sm"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 84 * 0.16} ${2 * Math.PI * 84}`}
                    strokeDashoffset={`-${2 * Math.PI * 84 * 0.84}`}
                    className="drop-shadow-sm"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div
              className="glass-panel rounded-3xl animate-slideUp"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white">
                    Activités récentes
                  </h2>
                  <button className="p-2.5 text-slate-400 hover:text-gray-300 hover:bg-slate-100 rounded-xl transition-all">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 hover:bg-white/10 rounded-2xl transition-all cursor-pointer group animate-slideUp"
                      style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform ${
                          activity.status === "new"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : activity.status === "completed"
                              ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                              : activity.status === "success"
                                ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                                : "bg-gradient-to-br from-blue-500 to-blue-600"
                        }`}
                      >
                        {activity.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-white">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-400 font-medium">
                            {activity.user}
                          </span>
                          <span className="text-xs text-gray-400">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Appointments */}
            <div
              className="glass-panel rounded-3xl animate-slideUp"
              style={{ animationDelay: "0.7s" }}
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white">
                    Rendez-vous du jour
                  </h2>
                  <button className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-black rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {todayAppointments.map((appointment, index) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 hover:bg-white/10 rounded-2xl transition-all cursor-pointer group animate-slideUp"
                      style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-3xl font-black text-blue-600">
                            {appointment.time.split(":")[0]}
                          </p>
                          <p className="text-xs text-gray-400 font-bold">
                            {appointment.time.split(":")[1]}
                          </p>
                        </div>
                        <div className="w-px h-14 bg-slate-200"></div>
                        <div>
                          <p className="font-black text-white">
                            {appointment.client}
                          </p>
                          <p className="text-sm text-gray-300 font-medium">
                            {appointment.vehicle}
                          </p>
                          <p className="text-sm text-blue-600 font-bold mt-1">
                            {appointment.service}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                            appointment.priority === "high"
                              ? "bg-red-50 text-red-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {appointment.priority === "high"
                            ? "Urgent"
                            : "Normal"}
                        </span>
                        <p className="text-xs text-gray-400 font-medium mt-2">
                          {appointment.duration}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          avec {appointment.mechanic}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        
    </div>
  );
}
