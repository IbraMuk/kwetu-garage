"use client";

import {
    Car,
    FileText,
    LayoutDashboard,
    Package,
    Users,
    Wrench,
} from "lucide-react";

export type TabType =
  | "overview"
  | "clients"
  | "vehicles"
  | "repairs"
  | "parts"
  | "invoices";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "clients", label: "Clients", icon: Users },
    { id: "vehicles", label: "Véhicules", icon: Car },
    { id: "repairs", label: "Réparations", icon: Wrench },
    { id: "parts", label: "Pièces", icon: Package },
    { id: "invoices", label: "Factures", icon: FileText },
  ];

  return (
    <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-40">
      <div className="flex flex-col flex-grow bg-white border-r border-slate-200 shadow-sm">
        <div className="flex items-center px-6 h-16 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Kwetu Garage"
              className="w-10 h-10 rounded-xl object-contain shadow-lg"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900">Kwetu Garage</h1>
              <p className="text-xs text-slate-500">Gestion Pro</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-5 w-5 mr-3 flex-shrink-0 ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
