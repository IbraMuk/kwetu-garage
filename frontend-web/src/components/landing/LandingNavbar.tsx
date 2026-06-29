"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "À propos" },
  { href: "#testimonials", label: "Témoignages" },
  { href: "#contact", label: "Contact" },
];

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Kwetu Garage"
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl object-contain"
            priority
          />
          <span className="text-xl font-bold tracking-tight text-white">
            Kwetu <span className="text-blue-500">Garage</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-blue-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Espace client
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-300 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-slate-300 transition-colors hover:text-blue-400"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
