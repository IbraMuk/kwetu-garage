"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pouvez intégrer une API d envoi d email
    alert("Merci pour votre message ! Nous vous recontacterons rapidement.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-600/10 px-4 py-1.5 text-sm font-semibold text-blue-400">
            Contactez-nous
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Besoin d un rendez-vous ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Notre équipe est à votre disposition pour toute question ou prise de rendez-vous.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Adresse</h3>
                <p className="text-slate-400">Kinshasa, République Démocratique du Congo</p>
                <p className="text-slate-500 text-sm">Ouvert du lundi au samedi</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Téléphone</h3>
                <p className="text-slate-400">+243 000 000 000</p>
                <p className="text-slate-500 text-sm">Disponible 6j/7</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Email</h3>
                <p className="text-slate-400">contact@kwetugarage.com</p>
                <p className="text-slate-500 text-sm">Réponse sous 24h</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Horaires d ouverture</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Lundi - Vendredi</span>
                  <span>08:00 - 18:00</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Samedi</span>
                  <span>08:00 - 14:00</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-slate-900/50 p-8">
            <h3 className="mb-6 text-2xl font-bold text-white">Envoyez-nous un message</h3>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Votre nom"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="+243..."
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Décrivez votre besoin..."
                />
              </div>
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
              >
                <Send className="h-5 w-5" />
                Envoyer le message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
