"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jean-Paul M.",
    role: "Client depuis 2020",
    content:
      "Kwetu Garage a réparé ma Toyota en un temps record. Le service est professionnel, le personnel compétent et les prix honnêtes. Je recommande vivement !",
    rating: 5,
  },
  {
    name: "Marie K.",
    role: "Propriétaire d une Hyundai",
    content:
      "Enfin un garage où l on peut suivre ses réparations en ligne. Le dashboard client est pratique et l équipe est toujours disponible pour répondre aux questions.",
    rating: 5,
  },
  {
    name: "Patrick L.",
    role: "Entrepreneur",
    content:
      "J ai confié toute ma flotte de véhicules à Kwetu Garage. Leur suivi rigoureux et leur réactivité m ont permis de réduire considérablement les pannes imprévues.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-600/10 px-4 py-1.5 text-sm font-semibold text-blue-400">
            Témoignages
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ce que disent nos clients
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            La satisfaction de nos clients est notre meilleure publicité.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative rounded-2xl border border-white/10 bg-slate-900/50 p-8 transition-all hover:border-blue-500/30 hover:bg-slate-800/50"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="mb-6 text-slate-300 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 font-bold text-white">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
