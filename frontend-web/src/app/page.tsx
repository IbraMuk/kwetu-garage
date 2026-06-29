"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import About from "@/components/landing/About";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Services from "@/components/landing/Services";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
          <p className="mt-4 font-medium text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <LandingNavbar />
      <Hero />
      <Stats />
      <Services />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
