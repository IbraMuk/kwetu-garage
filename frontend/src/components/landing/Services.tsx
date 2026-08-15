"use client";

import { Battery, Car, Droplet, Gauge, Hammer, PaintBucket, Settings, Sparkles } from "lucide-react";

const services = [
  {
    icon: Settings,
    title: "Mécanique générale",
    description: "Diagnostic, entretien et réparation de tous systèmes mécaniques avec outillage professionnel.",
  },
  {
    icon: Car,
    title: "Carrosserie & peinture",
    description: "Redonnez à votre véhicule son aspect d origine avec nos peintres et carrossiers qualifiés.",
  },
  {
    icon: Battery,
    title: "Électricité auto",
    description: "Dépannage électrique, batterie, alternateur, démarreur et systèmes électroniques embarqués.",
  },
  {
    icon: Droplet,
    title: "Vidange & freins",
    description: "Vidange, remplacement plaquettes/disques, purge de freins et liquides avec pièces de qualité.",
  },
  {
    icon: Gauge,
    title: "Climatisation",
    description: "Recharge climatisation, détection de fuites, réparation compresseur et circuit frigorifique.",
  },
  {
    icon: Hammer,
    title: "Soudure & tôlerie",
    description: "Travaux de tôlerie, soudure MIG/TIG et renforcement de châssis et structures métalliques.",
  },
  {
    icon: PaintBucket,
    title: "Vente de pièces",
    description: "Grand stock de pièces détachées neuves et d origine pour toutes les marques courantes.",
  },
  {
    icon: Sparkles,
    title: "Nettoyage premium",
    description: "Lavage intérieur/extérieur, detailing, polish et traitement céramique pour votre véhicule.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-600/10 px-4 py-1.5 text-sm font-semibold text-blue-400">
            Nos prestations
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Des services complets pour <br />
            <span className="text-blue-500">votre automobile</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Que ce soit pour un entretien régulier ou une réparation complexe, notre équipe met son expertise à votre service.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:bg-slate-800/60 hover:shadow-xl hover:shadow-blue-900/20"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-600/10 transition-all group-hover:bg-blue-600/20" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-600/20">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{service.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
