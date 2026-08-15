"use client";

import About from "@/components/landing/About";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Services from "@/components/landing/Services";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";

export default function Home() {
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
