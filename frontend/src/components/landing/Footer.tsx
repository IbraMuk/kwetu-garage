"use client";

import { Car, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  services: [
    { label: "Mécanique générale", href: "#services" },
    { label: "Carrosserie", href: "#services" },
    { label: "Électricité auto", href: "#services" },
    { label: "Vente de pièces", href: "#services" },
  ],
  company: [
    { label: "À propos", href: "#about" },
    { label: "Témoignages", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
    { label: "Espace client", href: "/login" },
  ],
  legal: [
    { label: "Mentions légales", href: "#" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "CGV", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Kwetu <span className="text-blue-500">Garage</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-slate-400">
              Garage automobile professionnel à Kinshasa. Entretien, réparation, carrosserie et vente de pièces pour toutes marques.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-all hover:border-blue-500/30 hover:bg-blue-600/10 hover:text-blue-500"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-400 transition-colors hover:text-blue-400">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-400 transition-colors hover:text-blue-400">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Informations</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-400 transition-colors hover:text-blue-400">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Kwetu Garage. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
