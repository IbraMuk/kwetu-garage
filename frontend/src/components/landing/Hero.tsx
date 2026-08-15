"use client";

import { ArrowRight, Calendar, Phone, Shield, Wrench } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
              <Shield className="h-4 w-4" />
              Garage professionnel &agrave; Kinshasa
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              L excellence automobile <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                au service de votre v&eacute;hicule
              </span>
            </h1>

            <p className="max-w-xl text-lg text-slate-400">
              Kwetu Garage vous propose une maintenance et des r&eacute;parations de haut niveau pour toutes marques. 
              M&eacute;canique, carrosserie, &eacute;lectricit&eacute; et pi&egrave;ces d origine avec un service rapide et fiable.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
              >
                Espace client
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10"
              >
                <Phone className="h-5 w-5" />
                Nous contacter
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { value: "15+", label: "Années d expérience" },
                { value: "5 000+", label: "Véhicules réparés" },
                { value: "98%", label: "Clients satisfaits" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white lg:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-2">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl" />
              <div className="relative flex h-full items-center justify-center rounded-2xl bg-slate-900/90 p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/20 to-blue-800/20">
                    <Wrench className="h-16 w-16 text-blue-500" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">Prenez rendez-vous</h3>
                  <p className="mb-6 text-slate-400">
                    G&eacute;rez vos r&eacute;parations, consultez vos factures et suivez vos v&eacute;hicules en ligne.
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                  >
                    <Calendar className="h-5 w-5" />
                    Créer un compte
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="h-10 w-6 rounded-full border-2 border-white/20 p-1">
          <div className="h-2 w-full rounded-full bg-blue-500" />
        </div>
      </div>
    </section>
  );
}
