"use client";

import { Award, Clock, Users, Wrench } from "lucide-react";

const stats = [
  {
    icon: Wrench,
    value: "5 000+",
    label: "Réparations effectuées",
    description: "Depuis notre création",
  },
  {
    icon: Users,
    value: "2 400+",
    label: "Clients fidèles",
    description: "Nous font confiance",
  },
  {
    icon: Clock,
    value: "24h",
    label: "Délai moyen",
    description: "Pour la plupart des interventions",
  },
  {
    icon: Award,
    value: "15+",
    label: "Mécaniciens certifiés",
    description: "Experts multimarques",
  },
];

export default function Stats() {
  return (
    <section className="relative border-y border-white/5 bg-slate-900/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-all hover:border-blue-500/30 hover:bg-slate-800/60"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 font-semibold text-slate-300">{stat.label}</div>
              <div className="mt-1 text-sm text-slate-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
