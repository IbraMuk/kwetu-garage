"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Bell,
  Calendar,
  Car,
  ChevronRight,
  DollarSign,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  Users,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: BarChart3 },
  { name: "Rendez-vous", href: "/appointments", icon: Calendar },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Véhicules", href: "/vehicles", icon: Car },
  { name: "Réparations", href: "/repairs", icon: Wrench },
  { name: "Factures", href: "/invoices", icon: DollarSign },
  { name: "Stock", href: "/stock", icon: Package },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Tableau de bord", subtitle: "Vue d'ensemble de votre garage" },
  "/appointments": { title: "Rendez-vous", subtitle: "Planification et suivi" },
  "/clients": { title: "Clients", subtitle: "Gestion de la clientèle" },
  "/customers": { title: "Clients", subtitle: "Gestion de la clientèle" },
  "/vehicles": { title: "Véhicules", subtitle: "Parc automobile" },
  "/repairs": { title: "Réparations", subtitle: "Suivi des interventions" },
  "/invoices": { title: "Factures", subtitle: "Facturation et paiements" },
  "/stock": { title: "Stock", subtitle: "Pièces et inventaire" },
  "/settings": { title: "Paramètres", subtitle: "Configuration du compte" },
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageMeta = pageTitles[pathname] ?? {
    title: "Kwetu Garage",
    subtitle: "Gestion professionnelle",
  };

  return (
    <div className="app-shell min-h-screen flex relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-400/10 blur-3xl animate-float" />
        <div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-400/10 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute -bottom-40 left-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-300/10 blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute -bottom-40 right-40 h-80 w-80 rounded-full bg-gradient-to-br from-violet-600/20 to-violet-400/10 blur-3xl animate-float"
          style={{ animationDelay: "6s" }}
        />
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-blue-400/30 animate-pulse"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${(i % 5) * 0.8}s`,
            }}
          />
        ))}
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } xl:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Kwetu Garage"
                className="h-10 w-10 rounded-xl object-contain shadow-lg animate-glow"
              />
              <div>
                <h1 className="text-lg font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Kwetu Garage
                </h1>
                <p className="text-xs font-semibold text-gray-400">Gestion Pro</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white xl:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? "border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-300 shadow-sm"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"
                        }`}
                      />
                      <span className="flex-1">{item.name}</span>
                      {isActive && <ChevronRight className="h-4 w-4 text-blue-400" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center space-x-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <span className="text-lg font-black text-white">
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 animate-pulse rounded-full border-2 border-slate-900 bg-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="truncate text-xs font-semibold capitalize text-gray-400">
                  {user?.role ?? "Utilisateur"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-lg p-2 text-gray-400 transition-all hover:bg-white/10 hover:text-red-400"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="relative z-10 flex min-h-screen flex-1 flex-col xl:pl-72">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white xl:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="animate-slideUp">
                <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                  {pageMeta.title}
                </h1>
                {pageMeta.subtitle && (
                  <p className="text-sm font-medium text-gray-400">
                    {pageMeta.subtitle}
                    {user?.first_name ? ` · Bonjour ${user.first_name}` : ""}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-48 rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-slate-500 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 lg:w-64"
                />
              </div>
              <button
                type="button"
                className="relative rounded-xl p-2.5 text-gray-300 transition-all hover:bg-white/10 hover:text-white"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-red-500" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
