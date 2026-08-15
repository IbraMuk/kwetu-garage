"use client";

import { CheckCircle2, Shield, Target, Users } from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "Chaque intervention est réalisée avec rigueur et souci du détail.",
  },
  {
    icon: Shield,
    title: "Transparence",
    description: "Devis clairs, explications honnêtes, aucune surprise sur la facture.",
  },
  {
    icon: Users,
    title: "Proximité",
    description: "Une relation de confiance avec nos clients et un suivi personnalisé.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-slate-800">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-900/30">
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Kwetu Garage</h3>
                  <p className="mt-2 text-slate-400">Votre partenaire automobile de confiance</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-2xl border border-white/10 bg-slate-800/95 p-6 shadow-xl backdrop-blur-sm">
              <div className="text-4xl font-bold text-blue-500">15+</div>
              <div className="text-sm font-medium text-slate-300">Années d expérience</div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <span className="mb-4 inline-block rounded-full bg-blue-600/10 px-4 py-1.5 text-sm font-semibold text-blue-400">
                À propos de nous
              </span>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                Un garage moderne à la pointe de la technologie
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Fondé à Kinshasa, Kwetu Garage est devenu une référence dans l entretien et la réparation automobile. 
                Notre équipe de mécaniciens certifiés et notre équipement de dernière génération nous permettent 
                d assurer un service rapide, fiable et garanti.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Diagnostic informatique multimarque",
                "Pièces d origine et garanties constructeur",
                "Devis gratuit et transparent",
                "Service client disponible 6j/7",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-500" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
                  <value.icon className="mb-3 h-6 w-6 text-blue-500" />
                  <h4 className="font-semibold text-white">{value.title}</h4>
                  <p className="mt-1 text-sm text-slate-500">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
